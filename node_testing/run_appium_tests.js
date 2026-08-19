const { runMobileAppiumTestSuite } = require('./appium_mobile/test_suites/test_mobile_appium_e2e');
const AppiumExcelReporter = require('./appium_mobile/utils/appiumExcelReporter');

async function main() {
    console.log('============================================================');
    console.log('STARTING NODE.JS APPIUM MOBILE AUTOMATION SUITE');
    console.log('============================================================');
    
    const results = await runMobileAppiumTestSuite();
    await AppiumExcelReporter.generateReport(results);

    console.log('============================================================');
    console.log('NODE.JS APPIUM MOBILE AUTOMATION COMPLETED');
    console.log('============================================================');
}

main().catch(err => {
    console.error('Fatal error in Node.js Appium Runner:', err);
    process.exit(1);
});
