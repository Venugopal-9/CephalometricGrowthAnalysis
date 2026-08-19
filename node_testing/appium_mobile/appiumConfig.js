class AppiumNodeConfig {
    static APPIUM_HOST = process.env.APPIUM_HOST || '127.0.0.1';
    static APPIUM_PORT = parseInt(process.env.APPIUM_PORT || '4723');
    static PLATFORM_NAME = 'Android';
    static AUTOMATION_NAME = 'UiAutomator2';
    static DEVICE_NAME = process.env.ANDROID_DEVICE_NAME || 'Android Emulator';
    static APP_PACKAGE = 'com.cephgrow.ai';
    static APP_ACTIVITY = '.MainActivity';
    
    static getCapabilities() {
        return {
            platformName: this.PLATFORM_NAME,
            'appium:automationName': this.AUTOMATION_NAME,
            'appium:deviceName': this.DEVICE_NAME,
            'appium:appPackage': this.APP_PACKAGE,
            'appium:appActivity': this.APP_ACTIVITY,
            'appium:noReset': true,
            'appium:newCommandTimeout': 120
        };
    }
}

module.exports = AppiumNodeConfig;
