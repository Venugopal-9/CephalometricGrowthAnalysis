import time
from selenium.webdriver.common.by import By
from tests.e2e.pages.base_page import BasePage
from tests.e2e.config.config import Config

class AuthPage(BasePage):
    # Locators
    NAME_INPUT = (By.XPATH, "//input[contains(@placeholder,'Name') or contains(@placeholder,'name')] | //label[contains(.,'name') or contains(.,'Name')]//input")
    EMAIL_INPUT = (By.XPATH, "//input[@type='email'] | //input[contains(@placeholder,'email') or contains(@placeholder,'Email')]")
    PASSWORD_INPUT = (By.XPATH, "//input[@type='password']")
    SUBMIT_BTN = (By.XPATH, "//form//button | //button[contains(text(),'Login') or contains(text(),'Signup') or contains(text(),'Create Account')]")
    SWITCH_AUTH_LINK = (By.XPATH, "//form//p//a | //a[contains(@href,'/login') or contains(@href,'/signup')]")
    FORM_HEADING = (By.XPATH, "//form//h2 | //h1[contains(text(),'Login') or contains(text(),'Signup') or contains(text(),'account')]")

    def load_login(self):
        self.navigate_to("login")

    def load_signup(self):
        self.navigate_to("signup")

    def enter_name(self, name: str):
        self.send_keys(self.NAME_INPUT, name)

    def enter_email(self, email: str):
        self.send_keys(self.EMAIL_INPUT, email)

    def enter_password(self, password: str):
        self.send_keys(self.PASSWORD_INPUT, password)

    def submit_form(self):
        self.click(self.SUBMIT_BTN)

    def login(self, email: str = "doctor@cephgrow.ai", password: str = "cephgrow123"):
        self.driver.get(Config.BASE_URL)
        try:
            self.driver.execute_script("window.localStorage.clear();")
        except Exception:
            pass
        self.navigate_to("login")
        self.enter_email(email)
        self.enter_password(password)
        self.submit_form()
        time.sleep(1.5)

    def signup(self, name: str = "Dr. John Doe", email: str = "john@cephgrow.ai", password: str = "securepass123"):
        self.driver.get(Config.BASE_URL)
        try:
            self.driver.execute_script("window.localStorage.clear();")
        except Exception:
            pass
        self.navigate_to("signup")
        self.enter_name(name)
        self.enter_email(email)
        self.enter_password(password)
        self.submit_form()
        time.sleep(1.5)
