const path = require('path');

class WebConfig {
    static BASE_URL = process.env.BASE_URL || 'https://Venugopal-9.github.io/CephalometricGrowthAnalysis/';
    static HEADLESS = process.env.HEADLESS === 'true';
    static IMPLICIT_WAIT_MS = 10000;
    static PAGE_LOAD_TIMEOUT_MS = 30000;
}

module.exports = WebConfig;
