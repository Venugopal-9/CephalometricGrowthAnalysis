class AppiumBasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async findElement(selector) {
        return await this.driver.$(selector);
    }

    async click(selector) {
        const el = await this.findElement(selector);
        await el.waitForDisplayed({ timeout: 10000 });
        await el.click();
    }

    async setValue(selector, value) {
        const el = await this.findElement(selector);
        await el.waitForDisplayed({ timeout: 10000 });
        await el.setValue(value);
    }

    async isDisplayed(selector) {
        try {
            const el = await this.findElement(selector);
            return await el.isDisplayed();
        } catch {
            return false;
        }
    }
}

class AppiumLoginPage extends AppiumBasePage {
    constructor(driver) {
        super(driver);
        this.emailField = 'input[type="email"]';
        this.passwordField = 'input[type="password"]';
        this.loginButton = 'button[type="submit"]';
    }

    async login(email, password) {
        await this.setValue(this.emailField, email);
        await this.setValue(this.passwordField, password);
        await this.click(this.loginButton);
    }
}

class AppiumMainPage extends AppiumBasePage {
    constructor(driver) {
        super(driver);
        this.brandTitle = '//*[contains(text(),"CephGrow AI")]';
        this.newAnalysisButton = '//*[contains(text(),"New Analysis")]';
        this.demoCaseButton = '//*[contains(text(),"Demo Case A")]';
    }

    async isAppLoaded() {
        return await this.isDisplayed(this.brandTitle);
    }
}

module.exports = { AppiumBasePage, AppiumLoginPage, AppiumMainPage };
