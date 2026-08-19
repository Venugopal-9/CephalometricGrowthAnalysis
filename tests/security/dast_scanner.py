import time
import requests
from typing import List, Dict, Any

def run_dast_scan(target_url: str) -> List[Dict[str, Any]]:
    findings = []
    base_url = target_url.rstrip("/") + "/"
    
    # 1. Missing Security Headers Check
    try:
        res = requests.get(base_url, timeout=5)
        headers = res.headers
        missing_headers = []
        for header in ["Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Content-Security-Policy"]:
            if header not in headers:
                missing_headers.append(header)
        if missing_headers:
            findings.append({
                "severity": "Low",
                "type": "Configuration - Missing Security Headers",
                "file": "backend/src/index.ts",
                "endpoint": "/",
                "description": f"Missing security headers: {', '.join(missing_headers)}",
                "impact": "Reduces browser-side protection against MIME sniffing, clickjacking, and XSS.",
                "fix": "Configure Helmet security headers in Express app: app.use(helmet())"
            })
    except Exception:
        pass

    # 2. CORS Policy Check
    try:
        res = requests.get(f"{base_url}api/health", headers={"Origin": "http://localhost:9999"}, timeout=5)
        if res.headers.get("Access-Control-Allow-Origin") in ["http://localhost:9999", "*"]:
            findings.append({
                "severity": "Low",
                "type": "Configuration - Dynamic Localhost CORS",
                "file": "backend/src/index.ts",
                "endpoint": "/api/health",
                "description": "CORS origin callback permits any localhost origin starting with 'http://localhost:'",
                "impact": "Any local process or developer server on any port can access API resources via CORS.",
                "fix": "Strictly whitelist explicitly permitted localhost ports (e.g. 5173, 8787)."
            })
    except Exception:
        pass

    # 3. Rate Limiting Check
    try:
        t0 = time.time()
        requests_count = 30
        status_codes = []
        for _ in range(requests_count):
            r = requests.get(f"{base_url}api/health", timeout=3)
            status_codes.append(r.status_code)
        if 429 not in status_codes:
            findings.append({
                "severity": "Medium",
                "type": "Business Logic - Missing Rate Limiting",
                "file": "backend/src/index.ts",
                "endpoint": "/api/*",
                "description": "API endpoints accept rapid consecutive requests without returning HTTP 429 Too Many Requests.",
                "impact": "Exposes API endpoints to request flooding, resource exhaustion, and Denial of Service (DoS).",
                "fix": "Implement express-rate-limit middleware on public API routes."
            })
    except Exception:
        pass

    return findings
