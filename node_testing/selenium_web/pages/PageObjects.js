const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LandingPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.brandHeader = By.xpath("//*[contains(text(),'CephGrow AI') or contains(text(),'Cephalometric')]");
        this.loginButton = By.xpath("//a[contains(@href,'login') or contains(text(),'Sign In')]");
        this.signupButton = By.xpath("//a[contains(@href,'signup') or contains(text(),'Get Started')]");
        this.demoSection = By.xpath("//*[contains(text(),'Demo Cases') or contains(text(),'Try Demo')]");
    }

    async isBrandVisible() {
        return await this.isDisplayed(this.brandHeader);
    }

    async clickSignIn() {
        await this.click(this.loginButton);
    }
}

class AuthPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.emailInput = By.css("input[type='email']");
        this.passwordInput = By.css("input[type='password']");
        this.submitButton = By.css("button[type='submit']");
        this.dashboardHeader = By.xpath("//*[contains(text(),'Workspace') or contains(text(),'Dashboard')]");
    }

    async login(email, password) {
        await this.sendKeys(this.emailInput, email);
        await this.sendKeys(this.passwordInput, password);
        await this.click(this.submitButton);
    }

    async isDashboardVisible() {
        return await this.isDisplayed(this.dashboardHeader);
    }
}

class DashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.newScanButton = By.xpath("//a[contains(@href,'upload') or contains(text(),'New Analysis')]");
        this.caseTable = By.xpath("//table | //*[contains(@class,'grid')]");
        this.logoutButton = By.xpath("//button[contains(text(),'Sign Out') or contains(text(),'Log out')]");
    }

    async clickNewAnalysis() {
        await this.click(this.newScanButton);
    }
}

class UploadPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.patientNameInput = By.css("input[name='patientName'], input[placeholder*='patient']");
        this.demoAverageButton = By.xpath("//button[contains(text(),'Demo Case A') or contains(text(),'Average')]");
        this.angleSlider = By.css("input[type='range']");
        this.analyzeButton = By.xpath("//button[contains(text(),'Run Analysis') or contains(text(),'Generate')]");
        this.growthResultBadge = By.xpath("//*[contains(text(),'Vertical') or contains(text(),'Average') or contains(text(),'Horizontal')]");
    }

    async runDemoAnalysis(patientName) {
        if (await this.isDisplayed(this.patientNameInput)) {
            await this.sendKeys(this.patientNameInput, patientName);
        }
        if (await this.isDisplayed(this.demoAverageButton)) {
            await this.click(this.demoAverageButton);
        }
        if (await this.isDisplayed(this.analyzeButton)) {
            await this.click(this.analyzeButton);
        }
    }

    async isResultVisible() {
        return await this.isDisplayed(this.growthResultBadge);
    }
}

module.exports = { LandingPage, AuthPage, DashboardPage, UploadPage };
