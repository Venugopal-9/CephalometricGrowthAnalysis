const { By, until } = require('selenium-webdriver');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async navigateTo(url) {
        await this.driver.get(url);
    }

    async findElement(by, timeout = 10000) {
        return await this.driver.wait(until.elementLocated(by), timeout);
    }

    async click(by, timeout = 10000) {
        const el = await this.findElement(by, timeout);
        await this.driver.wait(until.elementIsVisible(el), timeout);
        await el.click();
    }

    async sendKeys(by, text, timeout = 10000) {
        const el = await this.findElement(by, timeout);
        await el.clear();
        await el.sendKeys(text);
    }

    async getText(by, timeout = 10000) {
        const el = await this.findElement(by, timeout);
        return await el.getText();
    }

    async isDisplayed(by, timeout = 5000) {
        try {
            const el = await this.findElement(by, timeout);
            return await el.isDisplayed();
        } catch {
            return false;
        }
    }
}

module.exports = BasePage;
