const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const WebConfig = require('../config');
const { LandingPage, AuthPage, DashboardPage, UploadPage } = require('../pages/PageObjects');

async function runWebTestSuite() {
    const results = [];
    let driver;

    const options = new chrome.Options();
    if (WebConfig.HEADLESS) {
        options.addArguments('--headless=new');
    }
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');

    try {
        console.log(`[Node.js Selenium] Launching Chrome WebDriver targeting: ${WebConfig.BASE_URL}`);
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.manage().setTimeouts({ implicit: WebConfig.IMPLICIT_WAIT_MS });

        // Scenario 1: Public Landing Screen & Brand Navigation
        const t1_start = Date.now();
        try {
            const landing = new LandingPage(driver);
            await landing.navigateTo(WebConfig.BASE_URL);
            results.push({
                name: 'test_node_selenium_landing_page_load',
                suite: 'NodeWebTestSuite',
                status: 'PASSED',
                duration: (Date.now() - t1_start) / 1000
            });
        } catch (err) {
            results.push({
                name: 'test_node_selenium_landing_page_load',
                suite: 'NodeWebTestSuite',
                status: 'FAILED',
                duration: (Date.now() - t1_start) / 1000,
                error: err.message
            });
        }

        // Scenario 2: Authentication Flow
        const t2_start = Date.now();
        try {
            const auth = new AuthPage(driver);
            await auth.navigateTo(`${WebConfig.BASE_URL.replace(/\/$/, '')}/login`);
            await auth.login('clinician@cephgrow.ai', 'Password123!');
            results.push({
                name: 'test_node_selenium_auth_login',
                suite: 'NodeWebTestSuite',
                status: 'PASSED',
                duration: (Date.now() - t2_start) / 1000
            });
        } catch (err) {
            results.push({
                name: 'test_node_selenium_auth_login',
                suite: 'NodeWebTestSuite',
                status: 'FAILED',
                duration: (Date.now() - t2_start) / 1000,
                error: err.message
            });
        }

        // Scenario 3: Upload & Cephalometric Analysis Execution
        const t3_start = Date.now();
        try {
            const upload = new UploadPage(driver);
            await upload.navigateTo(`${WebConfig.BASE_URL.replace(/\/$/, '')}/upload`);
            await upload.runDemoAnalysis('Node.js Test Patient');
            results.push({
                name: 'test_node_selenium_growth_analysis',
                suite: 'NodeWebTestSuite',
                status: 'PASSED',
                duration: (Date.now() - t3_start) / 1000
            });
        } catch (err) {
            results.push({
                name: 'test_node_selenium_growth_analysis',
                suite: 'NodeWebTestSuite',
                status: 'FAILED',
                duration: (Date.now() - t3_start) / 1000,
                error: err.message
            });
        }

    } catch (globalErr) {
        console.error(`[Node.js Selenium Error] ${globalErr.message}`);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }

    return results;
}

module.exports = { runWebTestSuite };
