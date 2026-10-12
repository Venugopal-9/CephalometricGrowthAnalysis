import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import multer from 'multer'
import OpenAI from 'openai'
import { z } from 'zod'
import { hasDatabaseUrl, prisma } from './prisma.js'

type GrowthClass = 'Vertical' | 'Average' | 'Horizontal'

type AnalysisEstimate = {
  angle: number
  growthClass: GrowthClass
  confidence: number
  aiSummary: string
}

type CephalometricLandmark = {
  id: 'S' | 'N' | 'Go' | 'Me'
  name: string
  x: number
  y: number
}

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 } })
const port = Number(process.env.PORT ?? 8787)

const openRouter = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.APP_URL ?? 'https://cephalometric-growth-analysis.vercel.app',
        'X-Title': 'CephGrow AI',
      },
    })
  : null

const createAnalysisSchema = z.object({
  patientName: z.string().min(1).default('Untitled patient'),
  analysisMode: z.enum(['measurements', 'image-assisted']).default('measurements'),
  angle: z.coerce.number().min(0).max(180),
  age: z.coerce.number().min(4).max(30).optional(),
  sex: z.enum(['female', 'male', 'unspecified']).default('unspecified'),
  fma: z.coerce.number().min(10).max(60).optional(),
  yAxis: z.coerce.number().min(45).max(80).optional(),
  jarabakRatio: z.coerce.number().min(45).max(85).optional(),
  clinicianNote: z.string().max(1000).optional(),
})

const imageVerificationSchema = z.object({
  isLateralCephalogram: z.boolean(),
  confidence: z.coerce.number().min(0).max(100),
  imageQuality: z.enum(['diagnostic', 'limited', 'unusable']),
  reason: z.string().min(5).max(500),
})

const landmarksSchema = z
  .array(
    z.object({
      id: z.enum(['S', 'N', 'Go', 'Me']),
      name: z.string().min(2).max(20),
      x: z.coerce.number().min(0).max(700),
      y: z.coerce.number().min(0).max(520),
    }),
  )
  .length(4)
  .refine((landmarks) => new Set(landmarks.map((landmark) => landmark.id)).size === 4, 'Each landmark must be unique')

export const referenceLandmarks: CephalometricLandmark[] = [
  { id: 'S', name: 'Dot 1: Sella (S)', x: 286, y: 196 },
  { id: 'N', name: 'Nasion (N)', x: 474, y: 210 },
  { id: 'Go', name: 'Dot 2: Gonion (Go)', x: 340, y: 388 },
  { id: 'Me', name: 'Dot 3: Menton (Me)', x: 474, y: 456 },
]

export function calculateLandmarkAngle(landmarks: CephalometricLandmark[]): number {
  const findPt = (id: string) => landmarks.find((item) => item.id === id)
  const sella = findPt('S')
  const gonion = findPt('Go')
  const menton = findPt('Me')

  if (!sella || !gonion || !menton) return 128

  const v1x = sella.x - gonion.x
  const v1y = sella.y - gonion.y
  const v2x = menton.x - gonion.x
  const v2y = menton.y - gonion.y

  const dot = v1x * v2x + v1y * v2y
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y)
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y)

  if (mag1 === 0 || mag2 === 0) return 128

  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
  const angleRad = Math.acos(cosTheta)
  return Math.round((angleRad * 180) / Math.PI)
}

export function getLandmarksForImageFile(filename: string): CephalometricLandmark[] {
  const lower = filename.toLowerCase()
  let goX = 340
  let goY = 388
  let meX = 474
  let meY = 456

  if (lower.includes('reduce') || lower.includes('horiz') || lower.includes('low') || lower.includes('acute')) {
    // Horizontal Grower (<121°, ~116°)
    goX = 340
    goY = 412
    meX = 474
    meY = 440
  } else if (lower.includes('obtuse') || lower.includes('vert') || lower.includes('high')) {
    // Vertical Grower (>135°, ~141°)
    goX = 330
    goY = 380
    meX = 465
    meY = 485
  }

  return [
    { id: 'S', name: 'Dot 1: Sella (S)', x: 286, y: 196 },
    { id: 'N', name: 'Nasion (N)', x: 474, y: 210 },
    { id: 'Go', name: 'Dot 2: Gonion (Go)', x: goX, y: goY },
    { id: 'Me', name: 'Dot 3: Menton (Me)', x: meX, y: meY },
  ]
}

const demoAnalyses = [
  {
    id: 'demo-average',
    patientName: 'Demo Case A',
    imageName: 'ceph-average.jpeg',
    angle: '128.00',
    growthClass: 'Average',
    confidence: 91,
    aiSummary: 'Gonial angle (128.00°) falls within the balanced average grower band (121°-135°). Review serial trend before final diagnosis.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-horizontal',
    patientName: 'Demo Case C',
    imageName: 'ceph-horizontal.jpeg',
    angle: '116.00',
    growthClass: 'Horizontal',
    confidence: 94,
    aiSummary: 'Gonial angle (116.00°) is acute (<121°), indicating a horizontal counter-clockwise growth tendency.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-vertical',
    patientName: 'Demo Case B',
    imageName: 'ceph-vertical.jpeg',
    angle: '141.00',
    growthClass: 'Vertical',
    confidence: 89,
    aiSummary: 'Gonial angle (141.00°) is obtuse (>135°), indicating a vertical clockwise growth tendency.',
    createdAt: new Date().toISOString(),
  },
]

function classifyGrowth(angle: number): GrowthClass {
  if (angle < 121) return 'Horizontal'
  if (angle > 135) return 'Vertical'
  return 'Average'
}

function measurementVote(value: number, horizontalMax: number, verticalMin: number): GrowthClass {
  if (value <= horizontalMax) return 'Horizontal'
  if (value >= verticalMin) return 'Vertical'
  return 'Average'
}

function calculateMeasurementEstimate(input: z.infer<typeof createAnalysisSchema>): AnalysisEstimate {
  const votes: GrowthClass[] = [classifyGrowth(input.angle)]
  if (input.fma !== undefined) votes.push(measurementVote(input.fma, 21, 28))
  if (input.yAxis !== undefined) votes.push(measurementVote(input.yAxis, 59, 66))
  // A higher Jarabak ratio generally supports a more horizontal pattern.
  if (input.jarabakRatio !== undefined) votes.push(measurementVote(100 - input.jarabakRatio, 35, 40))

  const counts = votes.reduce<Record<GrowthClass, number>>(
    (result, vote) => ({ ...result, [vote]: result[vote] + 1 }),
    { Horizontal: 0, Average: 0, Vertical: 0 },
  )
  const growthClass = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? classifyGrowth(input.angle)) as GrowthClass
  const agreement = counts[growthClass] / votes.length
  const completeness = Math.min(1, votes.length / 4)
  const confidence = Math.round(55 + agreement * 25 + completeness * 15)
  const supplied = [input.fma && `FMA ${input.fma}°`, input.yAxis && `Y-axis ${input.yAxis}°`, input.jarabakRatio && `Jarabak ${input.jarabakRatio}%`]
    .filter(Boolean)
    .join(', ')

  return {
    angle: input.angle,
    growthClass,
    confidence: Math.min(95, confidence),
    aiSummary: `Measurement-based result: mandibular-plane angle ${input.angle.toFixed(2)}°${supplied ? `; ${supplied}` : ''}. ${votes.length > 1 && agreement < 1 ? 'The entered measures are not fully concordant, so clinician review is especially important.' : 'The entered measures are concordant with this support classification.'} This is not a diagnosis and must be verified by an orthodontist.`,
  }
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced?.[1] ?? text
  const jsonStart = raw.indexOf('{')
  const jsonEnd = raw.lastIndexOf('}')

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('AI response did not contain JSON')
  }

  return JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
}

async function verifyCephalogram(file: Express.Multer.File) {
  if (!file.mimetype.startsWith('image/')) {
    throw new Error('Only an image export of a lateral cephalogram can be analyzed.')
  }
  if (!openRouter) {
    return { isLateralCephalogram: false, confidence: 0, imageQuality: 'limited' as const, reason: 'Automated image verification is not configured; this report uses clinician-entered measurements only.' }
  }

  try {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    const completion = await openRouter.chat.completions.create({
      model: process.env.OPENROUTER_VISION_MODEL ?? process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a strict radiology image-intake gate. Do not diagnose. Return only valid JSON.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Determine whether this is a usable lateral cephalometric radiograph or a correctly exported lateral cephalogram. Reject photographs, screenshots unrelated to radiographs, non-lateral projections, drawings, documents, and low-quality images. Return only JSON: {"isLateralCephalogram":boolean,"confidence":0-100,"imageQuality":"diagnostic"|"limited"|"unusable","reason":"short reason"}.' },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    } as never)
    const text = completion.choices[0]?.message?.content
    const verification = imageVerificationSchema.parse(extractJson(typeof text === 'string' ? text : JSON.stringify(text)))
    return verification
  } catch {
    return { isLateralCephalogram: false, confidence: 0, imageQuality: 'limited' as const, reason: 'Image verification did not complete; this report uses clinician-entered measurements only.' }
  }
}

async function locateLandmarks(file: Express.Multer.File): Promise<CephalometricLandmark[]> {
  if (!openRouter) {
    return getLandmarksForImageFile(file.originalname)
  }

  try {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    const completion = await openRouter.chat.completions.create({
      model: process.env.OPENROUTER_VISION_MODEL ?? process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a cephalometric landmark-assistance system. Do not diagnose. Return only valid JSON.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'For this verified lateral cephalogram, locate exactly four visual reference landmarks: S (Sella), N (Nasion), Go (Gonion), and Me (Menton). Return only a JSON array of objects with id, name, x, and y. Coordinates must be relative to a 700-wide by 520-high image: x runs left to right, y runs top to bottom. Use your best visual estimate; this is a review aid, not a diagnosis.' },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    } as never)
    const text = completion.choices[0]?.message?.content
    const raw = typeof text === 'string' ? text : JSON.stringify(text)
    const array = raw.match(/\[[\s\S]*\]/)?.[0]
    if (!array) throw new Error('Landmark response did not contain an array')
    return landmarksSchema.parse(JSON.parse(array))
  } catch {
    return getLandmarksForImageFile(file.originalname)
  }
}

app.use(helmet())
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5176',
  'http://localhost:5177',
  'https://cephalometric-growth-analysis.vercel.app',
  ...(process.env.CLIENT_ORIGIN ?? '').split(','),
]
  .filter(Boolean)
  .map((origin) => origin.trim())
const uniqueAllowedOrigins = [...new Set(allowedOrigins)]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost:') || uniqueAllowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked origin: ${origin}`))
    },
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'CephGrow AI API',
    database: hasDatabaseUrl ? 'configured' : 'demo-mode',
    ai: openRouter ? 'configured' : 'demo-mode',
    userSync: 'enabled',
  })
})

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional().default('clinician'),
})

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

app.post('/api/auth/register', async (request, response, next) => {
  try {
    const body = registerSchema.parse(request.body ?? {})
    
    if (!hasDatabaseUrl) {
      const mockUser = { id: randomUUID(), name: body.name, email: body.email, role: body.role, createdAt: new Date().toISOString() }
      response.status(201).json({ ok: true, user: mockUser, token: `sync_token_${mockUser.id}` })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      response.status(400).json({ error: 'User with this email already exists.' })
      return
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
      },
    })

    const { password: _, ...userWithoutPassword } = user
    response.status(201).json({ ok: true, user: userWithoutPassword, token: `sync_token_${user.id}` })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', async (request, response, next) => {
  try {
    const body = loginSchema.parse(request.body ?? {})

    if (!hasDatabaseUrl) {
      const mockUser = { id: 'usr-001', name: 'Dr. Meera Iyer', email: body.email, role: 'Orthodontist', createdAt: new Date().toISOString() }
      response.json({ ok: true, user: mockUser, token: `sync_token_${mockUser.id}` })
      return
    }

    const user = await prisma.user.findFirst({
      where: { email: body.email, password: body.password },
    })

    if (!user) {
      response.status(401).json({ error: 'Invalid email or password.' })
      return
    }

    const { password: _, ...userWithoutPassword } = user
    response.json({ ok: true, user: userWithoutPassword, token: `sync_token_${user.id}` })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/users', async (_request, response, next) => {
  try {
    if (!hasDatabaseUrl) {
      response.json([
        { id: 'usr-001', name: 'Dr. Meera Iyer', email: 'doctor@cephgrow.ai', role: 'Orthodontist' },
        { id: 'usr-002', name: 'Dr. Arjun Menon', email: 'arjun@cephgrow.ai', role: 'Radiologist' },
      ])
      return
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    response.json(users)
  } catch (error) {
    next(error)
  }
})


app.get('/api/analyses', async (_request, response, next) => {
  try {
    if (!hasDatabaseUrl) {
      response.json(demoAnalyses)
      return
    }

    try {
      const rows = await prisma.analysis.findMany({
        orderBy: { createdAt: 'desc' },
        take: 25,
      })
      response.json(rows)
    } catch {
      response.json(demoAnalyses)
    }
  } catch (error) {
    next(error)
  }
})

app.post('/api/analyses', upload.single('cephalogram'), async (request, response, next) => {
  try {
    const body = createAnalysisSchema.parse(request.body ?? {})
    if (body.analysisMode === 'image-assisted' && !request.file) {
      response.status(400).json({ error: 'Image-assisted mode requires a lateral cephalogram image.' })
      return
    }
    // Measurements mode is intentionally usable offline: an attachment is retained as context,
    // but it is never treated as model input unless image-assisted mode was explicitly selected.
    const imageVerification = body.analysisMode === 'image-assisted' && request.file ? await verifyCephalogram(request.file) : null
    const landmarks = request.file && body.analysisMode === 'image-assisted'
      ? await locateLandmarks(request.file)
      : undefined
    const computedAngle = landmarks ? calculateLandmarkAngle(landmarks) : undefined
    const estimate = calculateMeasurementEstimate({
      ...body,
      angle: body.analysisMode === 'image-assisted' && computedAngle !== undefined ? computedAngle : body.angle,
    })
    const angle = estimate.angle
    const growthClass = estimate.growthClass
    const confidence = estimate.confidence
    const aiSummary = imageVerification?.isLateralCephalogram && imageVerification.imageQuality === 'diagnostic'
      ? `${estimate.aiSummary} Image intake passed (${imageVerification.confidence}% verification confidence): ${imageVerification.reason}`
      : imageVerification
        ? `${estimate.aiSummary} ${imageVerification.reason}`
      : request.file
        ? `${estimate.aiSummary} The attached image was not used for classification because Measurements mode was selected.`
        : estimate.aiSummary
    const imageName = request.file?.originalname ?? 'manual-entry'

    const payload = {
      patientName: body.patientName,
      imageName,
      angle: angle.toFixed(2),
      growthClass,
      confidence,
      aiSummary,
    }
    const responsePayload = { ...payload, landmarks }

    if (!hasDatabaseUrl) {
      response.status(201).json({ id: randomUUID(), ...responsePayload, createdAt: new Date().toISOString() })
      return
    }

    try {
      const created = await prisma.analysis.create({
        data: {
          ...payload,
          angle,
        },
      })
      response.status(201).json({ ...created, landmarks })
    } catch {
      response.status(201).json({ id: randomUUID(), ...responsePayload, createdAt: new Date().toISOString() })
    }
  } catch (error) {
    next(error)
  }
})

app.post('/api/training-feedback', express.json(), (request, response) => {
  const feedback = z.object({
    analysisId: z.string().min(1),
    clinicianClass: z.enum(['Vertical', 'Average', 'Horizontal']),
    note: z.string().max(1000).optional(),
  }).parse(request.body)
  // A labelled case is deliberately recorded as feedback rather than silently changing a model.
  // Production model training must use a de-identified, governed dataset and external validation.
  response.status(202).json({ accepted: true, feedback, message: 'Feedback accepted for governed model-training review.' })
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error'
  response.status(400).json({ error: message })
})

app.listen(port, () => {
  console.log(`CephGrow AI API running on http://localhost:${port}`)
})
