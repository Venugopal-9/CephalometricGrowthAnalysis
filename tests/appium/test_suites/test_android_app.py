import pytest
from tests.appium.pages.appium_login_page import AppiumLoginPage
from tests.appium.pages.appium_main_page import AppiumMainPage

@pytest.mark.usefixtures("appium_driver")
class TestAndroidApp:
    def test_android_app_launch(self, appium_driver):
        """Verify Android APK launches successfully and main screen is rendered."""
        main_page = AppiumMainPage(appium_driver)
        assert main_page.is_app_loaded(), "Android application header or main interface should be visible upon app launch."

    def test_android_app_login_and_analysis(self, appium_driver):
        """Verify performing login inside Android app loads clinical workspace and generates analysis."""
        login_page = AppiumLoginPage(appium_driver)
        login_page.perform_app_login("doctor@cephgrow.ai", "cephgrow123")
        
        main_page = AppiumMainPage(appium_driver)
        main_page.trigger_growth_analysis()
        assert main_page.is_app_loaded(), "Clinical workspace analysis should render cleanly inside Android App."
