import os

class LoadConfig:
    DEFAULT_LIVE_URL = "https://Venugopal-9.github.io/CephalometricGrowthAnalysis/"
    BASE_URL = os.environ.get("BASE_URL", DEFAULT_LIVE_URL).rstrip("/") + "/"
    
    # Load Test Execution Settings
    VIRTUAL_USERS = int(os.environ.get("VIRTUAL_USERS", "100"))
    DURATION_SECONDS = int(os.environ.get("DURATION_SECONDS", "60"))
    REQUEST_TIMEOUT = float(os.environ.get("REQUEST_TIMEOUT", "10.0"))
    
    # Endpoints to benchmark
    ENDPOINTS = [
        "",                 # Base application
        "api/health",       # Health API endpoint
        "api/analyses"      # Analyses listing endpoint
    ]
