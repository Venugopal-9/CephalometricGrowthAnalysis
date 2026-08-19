from selenium.webdriver.common.by import By
from tests.appium.pages.appium_base_page import AppiumBasePage

class AppiumMainPage(AppiumBasePage):
    # Locators
    APP_HEADER = (By.XPATH, "//*[contains(text(),'CephGrow') or contains(text(),'Cephalometric')]")
    DEMO_CASE_BTN = (By.XPATH, "//button[contains(.,'Demo Case A')] | //*[contains(@text,'Demo Case A')]")
    GENERATE_REPORT_BTN = (By.XPATH, "//button[contains(text(),'Generate support report')]")
    GROWTH_CLASS_TEXT = (By.XPATH, "//div[contains(text(),'Growth Class')]/following-sibling::div[1]")

    def is_app_loaded(self) -> bool:
        return self.is_displayed(self.APP_HEADER) or self.is_displayed(self.DEMO_CASE_BTN)

    def trigger_growth_analysis(self):
        if self.is_displayed(self.DEMO_CASE_BTN):
            self.click(self.DEMO_CASE_BTN)
        if self.is_displayed(self.GENERATE_REPORT_BTN):
            self.click(self.GENERATE_REPORT_BTN)
