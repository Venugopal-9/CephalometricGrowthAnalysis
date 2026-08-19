from selenium.webdriver.common.by import By
from tests.e2e.pages.base_page import BasePage

class AuthPage(BasePage):
    # Locators
    NAME_INPUT = (By.XPATH, "//input[@placeholder='Dr. Name']")
    EMAIL_INPUT = (By.XPATH, "//input[@type='email']")
    PASSWORD_INPUT = (By.XPATH, "//input[@type='password']")
    SUBMIT_BTN = (By.XPATH, "//form//button")
    SWITCH_AUTH_LINK = (By.XPATH, "//form//p//a")
    FORM_HEADING = (By.XPATH, "//form//h2")

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
        self.load_login()
        self.enter_email(email)
        self.enter_password(password)
        self.submit_form()

    def signup(self, name: str = "Dr. John Doe", email: str = "john@cephgrow.ai", password: str = "securepass123"):
        self.load_signup()
        self.enter_name(name)
        self.enter_email(email)
        self.enter_password(password)
        self.submit_form()
