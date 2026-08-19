import sys
import pytest
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from tests.e2e.config.config import Config
from tests.e2e.utils.logger import get_logger

logger = get_logger("AppiumTestRunner")

def run():
    Config.ensure_directories()
    logger.info("=" * 60)
    logger.info("Starting Android Appium E2E Test Suite Execution")
    logger.info("=" * 60)
    
    test_dir = Path(__file__).parent / "appium" / "test_suites"
    conftest_path = Path(__file__).parent / "conftest_appium.py"
    
    pytest_args = [
        str(test_dir),
        "-c", str(Path(__file__).parent / "pytest.ini"),
        "-v",
        "--tb=short",
        "-s"
    ]
    
    exit_code = pytest.main(pytest_args)
    logger.info(f"Appium test execution finished with code: {exit_code}")
    sys.exit(exit_code)

if __name__ == "__main__":
    run()
