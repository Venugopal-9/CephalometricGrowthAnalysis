import os
from pathlib import Path

class Config:
    # Default to the live GitHub Pages URL unless overridden by environment variable
    DEFAULT_LIVE_URL = "https://Venugopal-9.github.io/CephalometricGrowthAnalysis/"
    BASE_URL = os.environ.get("BASE_URL", DEFAULT_LIVE_URL).rstrip("/") + "/"
    
    # Browser & Timeout Settings
    HEADLESS = os.environ.get("HEADLESS", "true").lower() in ("true", "1", "yes")
    IMPLICIT_WAIT = int(os.environ.get("IMPLICIT_WAIT", "10"))
    EXPLICIT_WAIT = int(os.environ.get("EXPLICIT_WAIT", "15"))
    
    # Output Directory Paths
    PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
    RESULTS_DIR = PROJECT_ROOT / "Test Results"
    EXCEL_DIR = RESULTS_DIR / "Excel"
    HTML_DIR = RESULTS_DIR / "HTML"
    SCREENSHOTS_DIR = RESULTS_DIR / "Screenshots"
    LOGS_DIR = RESULTS_DIR / "Logs"
    SUMMARY_DIR = RESULTS_DIR / "Summary"
    
    @classmethod
    def ensure_directories(cls):
        """Create all required output folders if they do not exist."""
        for path in [cls.RESULTS_DIR, cls.EXCEL_DIR, cls.HTML_DIR, cls.SCREENSHOTS_DIR, cls.LOGS_DIR, cls.SUMMARY_DIR]:
            path.mkdir(parents=True, exist_ok=True)
