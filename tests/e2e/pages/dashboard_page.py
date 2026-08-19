from selenium.webdriver.common.by import By
from tests.e2e.pages.base_page import BasePage

class DashboardPage(BasePage):
    # Locators
    DASHBOARD_HEADER = (By.XPATH, "//h1[contains(text(),'Cephalometric growth analysis')]")
    TOTAL_CASES_TILE = (By.XPATH, "//div[contains(text(),'Total cases')]")
    RECENT_CASES_HEADING = (By.XPATH, "//h2[contains(text(),'Recent serial cases')]")
    UPLOAD_XRAY_BTN = (By.XPATH, "//a[contains(text(),'Upload X-ray')]")
    LOGOUT_BTN = (By.XPATH, "//button[contains(text(),'Logout')]")
    NAV_DASHBOARD = (By.XPATH, "//a[contains(@href,'/dashboard') or contains(text(),'Dashboard')]")
    NAV_UPLOAD = (By.XPATH, "//a[contains(@href,'/upload') or contains(text(),'Upload')]")
    NAV_CASES = (By.XPATH, "//a[contains(@href,'/cases') or contains(text(),'Cases')]")
    NAV_REPORTS = (By.XPATH, "//a[contains(@href,'/reports') or contains(text(),'Reports')]")

    def load(self):
        self.navigate_to("dashboard")

    def is_dashboard_loaded(self) -> bool:
        return self.is_displayed(self.DASHBOARD_HEADER) or self.is_displayed(self.RECENT_CASES_HEADING)

    def click_upload(self):
        self.click(self.UPLOAD_XRAY_BTN)

    def logout(self):
        self.click(self.LOGOUT_BTN)
