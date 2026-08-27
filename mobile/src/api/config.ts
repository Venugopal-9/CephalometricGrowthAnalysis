import { Platform } from 'react-native';

export const PRODUCTION_BACKEND_URL = 'https://cephalometricgrowthanalysis-production.up.railway.app';

// Development backend fallbacks:
// Android Emulator uses 10.0.2.2 for localhost
// iOS Simulator uses localhost
const DEV_BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8787' : 'http://localhost:8787';

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = PRODUCTION_BACKEND_URL || DEV_BACKEND_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl.replace(/\/+$/, '')}${cleanEndpoint}`;
};

export function classify(angle: number): 'Horizontal' | 'Vertical' | 'Average' {
  if (angle < 121) return 'Horizontal';
  if (angle > 135) return 'Vertical';
  return 'Average';
}

export function measureGrowthClass(value: number, horizontalMax: number, verticalMin: number): 'Horizontal' | 'Vertical' | 'Average' {
  if (value < horizontalMax) return 'Horizontal';
  if (value > verticalMin) return 'Vertical';
  return 'Average';
}
