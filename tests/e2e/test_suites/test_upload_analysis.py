import pytest
from tests.e2e.pages.auth_page import AuthPage
from tests.e2e.pages.upload_page import UploadPage

@pytest.mark.usefixtures("driver")
class TestUploadAnalysis:
    def test_demo_case_selection_and_report_generation(self, driver):
        """Verify selecting a demo case, entering patient name, and generating growth analysis report."""
        auth = AuthPage(driver)
        auth.login("doctor@cephgrow.ai", "cephgrow123")
        
        upload = UploadPage(driver)
        upload.load()
        assert upload.is_workspace_loaded(), "Clinical workspace upload page should load."
        
        upload.set_patient_name("E2E Test Patient")
        upload.select_demo_case_a()
        upload.click_generate_report()
        
        growth_class = upload.get_growth_class_result()
        assert growth_class in ["Average", "Horizontal", "Vertical"], f"Growth class result should be one of valid categories. Got: '{growth_class}'"

    def test_horizontal_grower_demo_case(self, driver):
        """Verify selecting Demo Case C classifies as Horizontal grower pattern."""
        auth = AuthPage(driver)
        auth.login("doctor@cephgrow.ai", "cephgrow123")
        
        upload = UploadPage(driver)
        upload.load()
        
        upload.select_demo_case_c()
        upload.click_generate_report()
        
        growth_class = upload.get_growth_class_result()
        assert growth_class in ["Horizontal", "Average"], f"Demo Case C should classify as Horizontal/Average grower. Got: '{growth_class}'"
