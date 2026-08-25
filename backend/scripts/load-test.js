import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.05'], // failure rate under 5%
    http_req_duration: ['p(95)<1500'] // 95% of requests must complete below 1.5s (1500ms)
  }
};

export default function () {
  const backendUrl = __ENV.BACKEND_URL || 'http://127.0.0.1:8787';
  
  // Health check endpoint
  const resHealth = http.get(`${backendUrl}/api/health`);
  check(resHealth, {
    'health status is 200': (r) => r.status === 200,
    'health response time < 1500ms': (r) => r.timings.duration < 1500
  });

  sleep(0.5);

  // Analyses list endpoint
  const resAnalyses = http.get(`${backendUrl}/api/analyses`);
  check(resAnalyses, {
    'analyses status is 200': (r) => r.status === 200,
    'analyses response time < 1500ms': (r) => r.timings.duration < 1500
  });

  sleep(0.5);
}
