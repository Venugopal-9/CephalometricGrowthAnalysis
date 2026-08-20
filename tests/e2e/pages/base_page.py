import time
from pathlib import Path
from typing import List
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

from tests.e2e.config.config import Config
from tests.e2e.utils.logger import get_logger

logger = get_logger("BasePage")

class BasePage:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, Config.EXPLICIT_WAIT)

    def navigate_to(self, path: str = ""):
        clean_path = path.lstrip('/')
        target_url = f"{Config.BASE_URL.rstrip('/')}/{clean_path}" if clean_path else Config.BASE_URL
        logger.info(f"Navigating to: {target_url}")
        
        base_origin = Config.BASE_URL.rstrip('/')
        current_url = self.driver.current_url.lower() if self.driver.current_url else ""
        
        if not current_url.startswith("http") or base_origin not in current_url:
            self.driver.get(Config.BASE_URL)
            time.sleep(1.5)

        if clean_path:
            route_path = f"/CephalometricGrowthAnalysis/{clean_path}" if "CephalometricGrowthAnalysis" in Config.BASE_URL else f"/{clean_path}"
            js_nav = """
            var target = arguments[0];
            window.history.pushState({}, '', target);
            window.dispatchEvent(new PopStateEvent('popstate'));
            """
            try:
                self.driver.execute_script(js_nav, route_path)
            except Exception:
                self.driver.get(target_url)
        time.sleep(1)

    def get_current_url(self) -> str:
        return self.driver.current_url

    def find_element(self, locator: tuple) -> WebElement:
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_elements(self, locator: tuple) -> List[WebElement]:
        return self.driver.find_elements(*locator)

    def wait_until_visible(self, locator: tuple, timeout: int = Config.EXPLICIT_WAIT) -> WebElement:
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

    def take_screenshot(self, name: str) -> str:
        Config.ensure_directories()
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        file_name = f"{name}_{timestamp}.png"
        file_path = Config.SCREENSHOTS_DIR / file_name
        self.driver.save_screenshot(str(file_path))
        logger.info(f"Screenshot captured: {file_path}")
        return str(file_path)
