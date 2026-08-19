import time
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options

from tests.appium.config.appium_config import AppiumConfig
from tests.e2e.config.config import Config
from tests.e2e.utils.logger import get_logger
from tests.e2e.utils.report_generator import ReportGenerator, TestResultItem

logger = get_logger("ConftestAppium")
APPIUM_RESULTS_LIST = []

@pytest.fixture(scope="session")
def appium_driver():
    Config.ensure_directories()
    options = UiAutomator2Options()
    for key, val in AppiumConfig.get_capabilities().items():
        clean_key = key.replace("appium:", "")
        options.set_capability(clean_key, val)

    logger.info(f"Connecting to Appium Server at {AppiumConfig.APPIUM_SERVER_URL}...")
    try:
        driver = webdriver.Remote(command_executor=AppiumConfig.APPIUM_SERVER_URL, options=options)
    except Exception as e:
        logger.error(f"Failed to connect to Appium driver: {e}")
        pytest.skip(f"Appium server not running or Android emulator unavailable: {e}")
        return

    driver.implicitly_wait(AppiumConfig.IMPLICIT_WAIT)
    
    yield driver
    
    logger.info("Tearing down Appium WebDriver session.")
    driver.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call":
        suite_name = "AppiumAndroidSuite"
        test_name = item.name
        duration = report.duration
        status = report.outcome.upper()
        error_msg = ""
        screenshot_path = ""
        
        if report.failed:
            error_msg = str(report.longreprtext)
            if "appium_driver" in item.fixturenames:
                try:
                    driver = item.funcargs["appium_driver"]
                    timestamp = time.strftime("%Y%m%d_%H%M%S")
                    file_name = f"appium_{test_name}_{timestamp}.png"
                    full_path = Config.SCREENSHOTS_DIR / file_name
                    driver.save_screenshot(str(full_path))
                    screenshot_path = str(full_path)
                except Exception as ss_err:
                    logger.warning(f"Could not capture Appium screenshot: {ss_err}")

        result_item = TestResultItem(
            name=test_name,
            suite=suite_name,
            status=status,
            duration=duration,
            error=error_msg,
            screenshot=screenshot_path
        )
        APPIUM_RESULTS_LIST.append(result_item)

def pytest_sessionfinish(session, exitstatus):
    if APPIUM_RESULTS_LIST:
        generator = ReportGenerator(APPIUM_RESULTS_LIST)
        generator.generate_all()
