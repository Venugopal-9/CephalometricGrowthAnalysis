export type GrowthClass = 'Vertical' | 'Average' | 'Horizontal';

export type CephalometricLandmark = {
  id: 'S' | 'N' | 'Go' | 'Me';
  name: string;
  x: number;
  y: number;
};

export type CaseRecord = {
  id: string;
  patient: string;
  image: string;
  angle: number;
  className: GrowthClass;
  confidence: number;
  date: string;
};

export type User = {
  name: string;
  email: string;
};

export type AnalysisResult = {
  id: string;
  patientName: string;
  imageName: string;
  angle: string | number;
  growthClass: GrowthClass;
  confidence: number;
  aiSummary: string;
  createdAt: string;
  landmarks?: CephalometricLandmark[];
};

export type Measurements = {
  fma?: number;
  yAxis?: number;
  jarabakRatio?: number;
};

export type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};
