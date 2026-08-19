const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

class AppiumExcelReporter {
    static async generateReport(testResults) {
        const outDir = path.resolve(process.cwd(), 'Test Results/NodeJS/Excel');
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const filePath = path.join(outDir, 'Automation_Mobile_Appium_Report.xlsx');
        const workbook = new ExcelJS.Workbook();

        // -------------------------------------------------------------
        // Sheet 1: Mobile Appium Execution Summary
        // -------------------------------------------------------------
        const wsSummary = workbook.addWorksheet('Mobile Appium Summary');
        wsSummary.views = [{ showGridLines: true }];

        wsSummary.mergeCells('A1:D1');
        const titleCell = wsSummary.getCell('A1');
        titleCell.value = 'CephGrow AI - Node.js Appium Mobile E2E Summary';
        titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF102A63' } };
        titleCell.alignment = { vertical: 'middle' };

        wsSummary.getCell('A3').value = 'Target Mobile Package:';
        wsSummary.getCell('B3').value = 'com.cephgrow.ai (Android)';
        wsSummary.getCell('A4').value = 'Execution Date:';
        wsSummary.getCell('B4').value = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const total = testResults.length;
        const passed = testResults.filter(r => r.status === 'PASSED').length;
        const failed = testResults.filter(r => r.status === 'FAILED').length;
        const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

        const headers = ['Metric', 'Value', 'Percentage', 'Notes'];
        const headerRow = wsSummary.addRow(headers);
        headerRow.eachCell(cell => {
            cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17212B' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        const metricsData = [
            ['Total Mobile Appium Scenarios', total, '100%', 'Executed Node.js Appium Mobile Tests'],
            ['Passed', passed, `${passRate}%`, 'Verified on Android App'],
            ['Failed', failed, `${((failed / (total || 1)) * 100).toFixed(2)}%`, 'Requires investigation'],
            ['Automation Engine', 'Node.js Appium / WebdriverIO', '-', 'UiAutomator2 Android Driver']
        ];

        metricsData.forEach(row => {
            const r = wsSummary.addRow(row);
            r.eachCell(cell => {
                cell.font = { name: 'Segoe UI', size: 10 };
            });
        });

        // -------------------------------------------------------------
        // Sheet 2: Mobile Appium Test Case Details
        // -------------------------------------------------------------
        const wsDetails = workbook.addWorksheet('Mobile Appium Details');
        wsDetails.views = [{ showGridLines: true }];

        const detailHeaders = ['#', 'Mobile Suite', 'Appium Scenario Name', 'Status', 'Duration (s)', 'Timestamp', 'Failure Reason'];
        const dHeaderRow = wsDetails.addRow(detailHeaders);
        dHeaderRow.eachCell(cell => {
            cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17212B' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        testResults.forEach((res, idx) => {
            const r = wsDetails.addRow([
                idx + 1,
                res.suite || 'AppiumMobileSuite',
                res.name,
                res.status,
                res.duration ? res.duration.toFixed(2) : '0.00',
                res.timestamp || new Date().toISOString(),
                res.error || 'N/A'
            ]);

            const statusCell = r.getCell(4);
            statusCell.font = { name: 'Segoe UI', size: 10, bold: true };
            if (res.status === 'PASSED') {
                statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
                statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF15803D' } };
            } else {
                statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFB91C1C' } };
            }
        });

        [wsSummary, wsDetails].forEach(ws => {
            ws.columns.forEach(col => {
                let maxLen = 12;
                col.eachCell({ includeEmpty: true }, cell => {
                    const len = cell.value ? cell.value.toString().length : 0;
                    if (len > maxLen) maxLen = len;
                });
                col.width = maxLen + 4;
            });
        });

        await workbook.xlsx.writeFile(filePath);
        console.log(`[+] Node.js Mobile Appium Excel report generated: ${filePath}`);
    }
}

module.exports = AppiumExcelReporter;
