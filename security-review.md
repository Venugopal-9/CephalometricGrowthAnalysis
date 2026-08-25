# CephGrow AI — Backend API Security Review

**Security Score**: 72 / 100 (Low Risk)  
**Total Findings**: 14 (0 Critical | 0 High | 14 Low)  

---

## Detailed Findings


### [SEC-BE-001] Fallback JWT Secret Key Used in Non-Production Mode
- **Severity**: `Low` | **Category**: Authentication
- **File**: `backend/src/index.ts`
- **Impact**: Default secret string fallback in development environment if JWT_SECRET is unset.
- **Remediation**: Require mandatory JWT_SECRET startup environment variable check.


### [SEC-BE-002] Missing API Endpoint Rate Limiting (express-rate-limit)
- **Severity**: `Low` | **Category**: Denial of Service
- **File**: `backend/src/index.ts`
- **Impact**: High frequency automated requests could degrade API response latency.
- **Remediation**: Implement express-rate-limit middleware capping requests to 100/min per IP.


### [SEC-BE-003] Wildcard CORS Header Configuration in Development
- **Severity**: `Low` | **Category**: CORS Security
- **File**: `backend/src/index.ts`
- **Impact**: Loose origin CORS policy allows local testing origins to read API responses.
- **Remediation**: Restrict CLIENT_ORIGIN explicitly to trusted production domain names.


### [SEC-BE-004] Unauthenticated Public Health Check & Status Endpoint
- **Severity**: `Low` | **Category**: Information Exposure
- **File**: `backend/src/index.ts`
- **Impact**: GET /api/health exposes server uptime and runtime Node.js environment information.
- **Remediation**: Sanitize health response payload to exclude system memory and version metrics.


### [SEC-BE-005] Missing HTTP Strict Transport Security (HSTS) Header
- **Severity**: `Low` | **Category**: Transport Layer Security
- **File**: `backend/src/index.ts`
- **Impact**: Missing HSTS header allows initial unencrypted HTTP connection attempts.
- **Remediation**: Configure Helmet middleware with hsts maxAge: 31536000 includeSubDomains.


### [SEC-BE-006] Default Password Hash Iteration Count Warning
- **Severity**: `Low` | **Category**: Cryptography
- **File**: `backend/src/index.ts`
- **Impact**: Standard password hashing iterations could be increased for additional security.
- **Remediation**: Set bcrypt/argon2 cost factor to 12 or higher for credential hashing.


### [SEC-BE-007] Oversized Multipart File Upload Buffer Limit
- **Severity**: `Low` | **Category**: Resource Exhaustion
- **File**: `backend/src/index.ts`
- **Impact**: Multer file upload endpoint accepts X-ray files up to 50MB without streaming validation.
- **Remediation**: Cap max image file upload size to 10MB in Multer configuration.


### [SEC-BE-008] Unauthenticated Analysis Progress Query Endpoint
- **Severity**: `Low` | **Category**: Authorization
- **File**: `backend/src/index.ts`
- **Impact**: GET /api/analyses allows reading demo analysis records without clinician login.
- **Remediation**: Enforce JWT authentication middleware on all analysis data routes.


### [SEC-BE-009] Verbose Database Error Details Logged in Internal Errors
- **Severity**: `Low` | **Category**: Information Disclosure
- **File**: `backend/src/index.ts`
- **Impact**: Prisma query exception error messages contain raw PostgreSQL field names.
- **Remediation**: Catch Prisma exceptions and return generic 500 error messages to API consumers.


### [SEC-BE-010] Missing Express Body Parser Payload Truncation
- **Severity**: `Low` | **Category**: Input Validation
- **File**: `backend/src/index.ts`
- **Impact**: JSON request payload size limit is default 1MB without explicit route constraints.
- **Remediation**: Set express.json({ limit: "100kb" }) on standard JSON input routes.


### [SEC-BE-011] Missing Cookie SameSite=Strict Attribute
- **Severity**: `Low` | **Category**: Cookie Security
- **File**: `backend/src/index.ts`
- **Impact**: Session cookies set without explicit SameSite=Strict flag in legacy browsers.
- **Remediation**: Set SameSite=Strict and Secure flags on all outgoing cookie headers.


### [SEC-BE-012] OpenRouter Vision API Request Timeout Omission
- **Severity**: `Low` | **Category**: Third-Party Integration
- **File**: `backend/src/index.ts`
- **Impact**: Unbounded HTTP request timeout when sending X-ray images to AI service.
- **Remediation**: Pass 30-second AbortSignal timeout to OpenAI/OpenRouter SDK calls.


### [SEC-BE-013] Prisma Database Connection String Insecure Fallback
- **Severity**: `Low` | **Category**: Database Connection
- **File**: `backend/src/prisma.ts`
- **Impact**: Fallback SQLite/in-memory database string used when Neon Postgres URL is absent.
- **Remediation**: Fail backend server boot immediately if DATABASE_URL is not configured.


### [SEC-BE-014] Missing X-Content-Type-Options Nosniff Header
- **Severity**: `Low` | **Category**: MIME Sniffing
- **File**: `backend/src/index.ts`
- **Impact**: Browsers may attempt MIME-sniffing on raw cephalogram image downloads.
- **Remediation**: Enable X-Content-Type-Options: nosniff header globally via Helmet.

