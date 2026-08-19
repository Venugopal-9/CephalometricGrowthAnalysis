from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.common.by import By
from tests.appium.pages.appium_base_page import AppiumBasePage

class AppiumLoginPage(AppiumBasePage):
    # Locators (supports both Native Android XML elements & Capacitor WebView HTML elements)
    LOGIN_BTN = (By.XPATH, "//button[contains(text(),'Login') or contains(text(),'Sign up')] | //*[@content-desc='Login']")
    EMAIL_INPUT = (By.XPATH, "//input[@type='email'] | //android.widget.EditText[1]")
    PASSWORD_INPUT = (By.XPATH, "//input[@type='password'] | //android.widget.EditText[2]")
    SUBMIT_BTN = (By.XPATH, "//form//button | //android.widget.Button[contains(@text,'Login')]")

    def perform_app_login(self, email: str = "doctor@cephgrow.ai", password: str = "cephgrow123"):
        self.switch_to_webview_if_available()
        if self.is_displayed(self.EMAIL_INPUT):
            self.send_keys(self.EMAIL_INPUT, email)
            self.send_keys(self.PASSWORD_INPUT, password)
            self.click(self.SUBMIT_BTN)
