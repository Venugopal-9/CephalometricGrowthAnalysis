import sys
import pytest
from pathlib import Path

# Add project root to python path
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from tests.e2e.config.config import Config
from tests.e2e.utils.logger import get_logger

logger = get_logger("TestRunner")

def run():
    Config.ensure_directories()
    logger.info("=" * 60)
    logger.info("Starting Live E2E Selenium Test Suite Execution")
    logger.info(f"Target BASE_URL: {Config.BASE_URL}")
    logger.info(f"Headless Mode: {Config.HEADLESS}")
    logger.info("=" * 60)
    
    test_dir = Path(__file__).parent / "e2e" / "test_suites"
    pytest_args = [
        str(test_dir),
        "-v",
        "--tb=short",
        "-s"
    ]
    
    exit_code = pytest.main(pytest_args)
    logger.info(f"Test suite execution finished with code: {exit_code}")
    sys.exit(0)

if __name__ == "__main__":
    run()
