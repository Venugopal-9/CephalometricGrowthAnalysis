import time
import pytest
from tests.e2e.config.config import Config
from tests.e2e.pages.auth_page import AuthPage
from tests.e2e.pages.dashboard_page import DashboardPage

@pytest.mark.usefixtures("driver")
class TestAuthentication:
    def test_login_flow(self, driver):
        """Verify successful login redirects user to protected clinical dashboard."""
        auth = AuthPage(driver)
        auth.login("doctor@cephgrow.ai", "cephgrow123")
        
        dashboard = DashboardPage(driver)
        assert dashboard.is_dashboard_loaded(), "User should be redirected to clinical workspace dashboard after login."

    def test_signup_flow(self, driver):
        """Verify new clinician signup redirects to clinical workspace dashboard."""
        auth = AuthPage(driver)
        auth.signup(name="Dr. Test Specialist", email="specialist@cephgrow.ai", password="password123")
        
        dashboard = DashboardPage(driver)
        assert dashboard.is_dashboard_loaded(), "User should be redirected to clinical workspace dashboard after signup."

    def test_protected_route_redirect(self, driver):
        """Verify accessing /dashboard without authentication redirects unauthenticated users to /login."""
        driver.get(Config.BASE_URL)
        try:
            driver.execute_script("window.localStorage.clear();")
        except Exception:
            pass
        
        dashboard = DashboardPage(driver)
        dashboard.load()
        time.sleep(1)
        current_url = dashboard.get_current_url()
        assert "login" in current_url.lower() or "dashboard" not in current_url.lower(), f"Unauthenticated access to dashboard should redirect to login. Got: {current_url}"

