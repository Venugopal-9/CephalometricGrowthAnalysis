import os
from pathlib import Path

class AppiumConfig:
    APPIUM_SERVER_URL = os.environ.get("APPIUM_SERVER_URL", "http://127.0.0.1:4723")
    PLATFORM_NAME = "Android"
    AUTOMATION_NAME = "UiAutomator2"
    DEVICE_NAME = os.environ.get("ANDROID_DEVICE_NAME", "Android Emulator")
    APP_PACKAGE = "com.cephgrow.ai"
    APP_ACTIVITY = ".MainActivity"
    
    PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
    APK_PATH = os.environ.get(
        "APK_PATH",
        str(PROJECT_ROOT / "frontend" / "android" / "app" / "build" / "outputs" / "apk" / "debug" / "app-debug.apk")
    )
    
    IMPLICIT_WAIT = int(os.environ.get("APPIUM_IMPLICIT_WAIT", "15"))
    EXPLICIT_WAIT = int(os.environ.get("APPIUM_EXPLICIT_WAIT", "20"))
    
    @classmethod
    def get_capabilities(cls) -> dict:
        caps = {
            "platformName": cls.PLATFORM_NAME,
            "appium:automationName": cls.AUTOMATION_NAME,
            "appium:deviceName": cls.DEVICE_NAME,
            "appium:appPackage": cls.APP_PACKAGE,
            "appium:appActivity": cls.APP_ACTIVITY,
            "appium:noReset": False,
            "appium:fullReset": False,
            "appium:newCommandTimeout": 180,
            "appium:autoGrantPermissions": True
        }
        if os.path.exists(cls.APK_PATH):
            caps["appium:app"] = cls.APK_PATH
        return caps
