from selenium.webdriver.common.by import By
from tests.e2e.pages.base_page import BasePage

class LandingPage(BasePage):
    # Locators
    BRAND_TITLE = (By.XPATH, "//span[contains(text(),'CephGrow AI')]")
    HERO_HEADING = (By.XPATH, "//h1[contains(text(),'Measure angles')]")
    CREATE_ACCOUNT_BTN = (By.XPATH, "//a[contains(text(),'Create Account')]")
    LOGIN_WORKSPACE_BTN = (By.XPATH, "//a[contains(text(),'Login to Workspace')]")
    LOGIN_NAV_LINK = (By.XPATH, "//a[@href='/login' or contains(text(),'Login')]")
    SIGNUP_NAV_LINK = (By.XPATH, "//a[@href='/signup' or contains(text(),'Sign up')]")
    PLATFORM_SECTION = (By.ID, "platform")
    CLINICAL_SECTION = (By.ID, "clinical")
    TESTIMONIALS_SECTION = (By.ID, "testimonials")
    METRIC_CARDS = (By.XPATH, "//div[contains(@class,'grid-cols-2') or contains(@class,'grid-cols-4')]//div[contains(@class,'rounded-lg')]")

    def load(self):
        self.navigate_to("/")

    def get_hero_title_text(self) -> str:
        return self.get_text(self.HERO_HEADING)

    def is_brand_visible(self) -> bool:
        return self.is_displayed(self.BRAND_TITLE)

    def click_create_account(self):
        self.click(self.CREATE_ACCOUNT_BTN)

    def click_login_workspace(self):
        self.click(self.LOGIN_WORKSPACE_BTN)
