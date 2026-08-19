import time
from pathlib import Path
from typing import List
from appium.webdriver.webdriver import WebDriver
from appium.webdriver.webelement import WebElement
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

from tests.e2e.config.config import Config
from tests.e2e.utils.logger import get_logger

logger = get_logger("AppiumBasePage")

class AppiumBasePage:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 20)

    def find_element(self, locator: tuple) -> WebElement:
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_elements(self, locator: tuple) -> List[WebElement]:
        return self.driver.find_elements(*locator)

    def wait_until_visible(self, locator: tuple, timeout: int = 20) -> WebElement:
        return WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))

    def click(self, locator: tuple):
        element = self.wait_until_visible(locator)
        element.click()

    def send_keys(self, locator: tuple, text: str):
        element = self.wait_until_visible(locator)
        element.clear()
        element.send_keys(text)

    def get_text(self, locator: tuple) -> str:
        element = self.wait_until_visible(locator)
        return element.text

    def is_displayed(self, locator: tuple) -> bool:
        try:
            element = self.driver.find_element(*locator)
            return element.is_displayed()
        except (NoSuchElementException, TimeoutException):
            return False

    def switch_to_webview_if_available(self):
        """Switch to WEBVIEW context in Capacitor hybrid app if present."""
        try:
            contexts = self.driver.contexts
            logger.info(f"Available Appium contexts: {contexts}")
            for context in contexts:
                if "WEBVIEW" in context.upper():
                    self.driver.switch_to.context(context)
                    logger.info(f"Switched to WebView context: {context}")
                    return True
        except Exception as e:
            logger.warning(f"Could not switch to WebView context: {e}")
        return False

    def take_screenshot(self, name: str) -> str:
        Config.ensure_directories()
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        file_name = f"appium_{name}_{timestamp}.png"
        file_path = Config.SCREENSHOTS_DIR / file_name
        self.driver.save_screenshot(str(file_path))
        logger.info(f"Appium screenshot captured: {file_path}")
        return str(file_path)
