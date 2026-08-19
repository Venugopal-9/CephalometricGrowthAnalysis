const { runWebTestSuite } = require('./selenium_web/test_suites/test_web_e2e');
const WebExcelReporter = require('./selenium_web/utils/webExcelReporter');

async function main() {
    console.log('============================================================');
    console.log('STARTING NODE.JS SELENIUM WEB AUTOMATION SUITE');
    console.log('============================================================');
    
    const results = await runWebTestSuite();
    await WebExcelReporter.generateReport(results);

    console.log('============================================================');
    console.log('NODE.JS SELENIUM WEB AUTOMATION COMPLETED');
    console.log('============================================================');
}

main().catch(err => {
    console.error('Fatal error in Node.js Web Runner:', err);
    process.exit(1);
});
