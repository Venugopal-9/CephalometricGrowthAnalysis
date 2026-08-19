import pytest
from tests.e2e.pages.landing_page import LandingPage

@pytest.mark.usefixtures("driver")
class TestLandingPage:
    def test_landing_page_load(self, driver):
        """Verify the public landing page loads cleanly with expected hero heading and brand logo."""
        landing = LandingPage(driver)
        landing.load()
        
        assert landing.is_brand_visible(), "Brand logo 'CephGrow AI' should be visible on landing page."
        hero_text = landing.get_hero_title_text()
        assert "Measure angles. Predict growth." in hero_text, f"Unexpected hero text: {hero_text}"

    def test_landing_navigation_to_signup(self, driver):
        """Verify clicking 'Create Account' redirects user to the signup route."""
        landing = LandingPage(driver)
        landing.load()
        landing.click_create_account()
        
        assert "/signup" in landing.get_current_url(), f"URL should contain '/signup', got: {landing.get_current_url()}"

    def test_landing_navigation_to_login(self, driver):
        """Verify clicking 'Login to Workspace' redirects user to the login route."""
        landing = LandingPage(driver)
        landing.load()
        landing.click_login_workspace()
        
        assert "/login" in landing.get_current_url(), f"URL should contain '/login', got: {landing.get_current_url()}"
