from selenium.webdriver.common.by import By
from tests.e2e.pages.base_page import BasePage

class UploadPage(BasePage):
    # Locators
    PAGE_TITLE = (By.XPATH, "//h2[contains(text(),'Upload. Measure. Review.')]")
    DEMO_CASE_A = (By.XPATH, "//button[contains(.,'Demo Case A')]")
    DEMO_CASE_B = (By.XPATH, "//button[contains(.,'Demo Case B')]")
    DEMO_CASE_C = (By.XPATH, "//button[contains(.,'Demo Case C')]")
    MEASUREMENTS_MODE_BTN = (By.XPATH, "//button[contains(text(),'Measurements')]")
    IMAGE_ASSISTED_MODE_BTN = (By.XPATH, "//button[contains(text(),'Image assisted')]")
    PATIENT_NAME_INPUT = (By.XPATH, "//input[@placeholder='Patient name']")
    FMA_INPUT = (By.XPATH, "//input[@placeholder='Optional' and preceding-sibling::span[contains(text(),'FMA')]]")
    GENERATE_REPORT_BTN = (By.XPATH, "//button[contains(text(),'Generate support report')]")
    GROWTH_CLASS_RESULT = (By.XPATH, "//div[contains(text(),'Growth Class')]/following-sibling::div[1]")
    ANGLE_RESULT = (By.XPATH, "//div[contains(text(),'Cephalometric angle:')]")
    CONFIDENCE_RESULT = (By.XPATH, "//div[contains(text(),'confidence')]")

    def load(self):
        self.navigate_to("upload")

    def is_workspace_loaded(self) -> bool:
        return self.is_displayed(self.PAGE_TITLE)

    def select_demo_case_a(self):
        self.click(self.DEMO_CASE_A)

    def select_demo_case_c(self):
        self.click(self.DEMO_CASE_C)

    def set_patient_name(self, name: str):
        self.send_keys(self.PATIENT_NAME_INPUT, name)

    def click_generate_report(self):
        self.click(self.GENERATE_REPORT_BTN)

    def get_growth_class_result(self) -> str:
        return self.get_text(self.GROWTH_CLASS_RESULT)
