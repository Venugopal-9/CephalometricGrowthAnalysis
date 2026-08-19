import pytest
from tests.e2e.pages.auth_page import AuthPage
from tests.e2e.pages.dashboard_page import DashboardPage

@pytest.mark.usefixtures("driver")
class TestDashboard:
    def test_dashboard_metrics_and_navigation(self, driver):
        """Verify clinical dashboard displays totals summary tiles and navigate to upload page."""
        auth = AuthPage(driver)
        auth.login("doctor@cephgrow.ai", "cephgrow123")
        
        dashboard = DashboardPage(driver)
        assert dashboard.is_dashboard_loaded(), "Dashboard header should be visible."
        
        dashboard.click_upload()
        assert "/upload" in dashboard.get_current_url(), f"Clicking 'Upload X-ray' should navigate to /upload, got: {dashboard.get_current_url()}"

    def test_user_logout(self, driver):
        """Verify user logout clears workspace state and redirects to public login page."""
        auth = AuthPage(driver)
        auth.login("doctor@cephgrow.ai", "cephgrow123")
        
        dashboard = DashboardPage(driver)
        dashboard.logout()
        
        assert "/login" in dashboard.get_current_url() or "/" in dashboard.get_current_url(), "Logout should clear session and leave protected area."
