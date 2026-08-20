import time
import pytest
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from tests.e2e.config.config import Config
from tests.e2e.utils.logger import get_logger
from tests.e2e.utils.report_generator import ReportGenerator, TestResultItem

logger = get_logger("Conftest")
TEST_RESULTS_LIST = []

@pytest.fixture(scope="session")
def driver():
    Config.ensure_directories()
    options = Options()
    
    options.page_load_strategy = 'eager'
    if Config.HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--allow-insecure-localhost")

    logger.info("Initializing Headless Chrome WebDriver...")
    try:
        browser = webdriver.Chrome(options=options)
    except Exception as e:
        logger.error(f"Failed to initialize Chrome Driver: {e}")
        raise e

    browser.implicitly_wait(Config.IMPLICIT_WAIT)
    browser.set_page_load_timeout(60)
    
    yield browser
    
    logger.info("Tearing down Chrome WebDriver session.")
    browser.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call":
        suite_name = item.parent.name if item.parent else "DefaultSuite"
        test_name = item.name
        duration = report.duration
        status = report.outcome.upper()
        error_msg = ""
        screenshot_path = ""
        
        if report.failed:
            error_msg = str(report.longreprtext)
            # Try capturing screenshot on failure if driver fixture is present
            if "driver" in item.fixturenames:
                try:
                    web_driver = item.funcargs["driver"]
                    timestamp = time.strftime("%Y%m%d_%H%M%S")
                    screenshot_name = f"{test_name}_{timestamp}.png"
                    full_path = Config.SCREENSHOTS_DIR / screenshot_name
                    web_driver.save_screenshot(str(full_path))
                    screenshot_path = str(full_path)
                    logger.info(f"Captured failure screenshot: {full_path}")
                except Exception as ss_err:
                    logger.warning(f"Could not capture screenshot on failure: {ss_err}")

        result_item = TestResultItem(
            name=test_name,
            suite=suite_name,
            status=status,
            duration=duration,
            error=error_msg,
            screenshot=screenshot_path
        )
        TEST_RESULTS_LIST.append(result_item)

def pytest_sessionfinish(session, exitstatus):
    logger.info(f"Test session finished with exit status: {exitstatus}. Generating reports...")
    if TEST_RESULTS_LIST:
        generator = ReportGenerator(TEST_RESULTS_LIST)
        generator.generate_all()
    else:
        logger.warning("No test results collected during execution session.")
