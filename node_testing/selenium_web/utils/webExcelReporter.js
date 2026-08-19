const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

class WebExcelReporter {
    static async generateReport(testResults) {
        const outDir = path.resolve(process.cwd(), 'Test Results/NodeJS/Excel');
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const filePath = path.join(outDir, 'Automation_Web_Test_Report.xlsx');
        const workbook = new ExcelJS.Workbook();

        // -------------------------------------------------------------
        // Sheet 1: Web Execution Summary
        // -------------------------------------------------------------
        const wsSummary = workbook.addWorksheet('Web Execution Summary');
        wsSummary.views = [{ showGridLines: true }];

        wsSummary.mergeCells('A1:D1');
        const titleCell = wsSummary.getCell('A1');
        titleCell.value = 'CephGrow AI - Node.js Selenium Web E2E Summary';
        titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF102A63' } };
        titleCell.alignment = { vertical: 'middle' };

        wsSummary.getCell('A3').value = 'Target Web URL:';
        wsSummary.getCell('B3').value = process.env.BASE_URL || 'https://Venugopal-9.github.io/CephalometricGrowthAnalysis/';
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
            ['Total Web Scenarios', total, '100%', 'Executed Node.js Selenium Tests'],
            ['Passed', passed, `${passRate}%`, 'Verified against web application'],
            ['Failed', failed, `${((failed / (total || 1)) * 100).toFixed(2)}%`, 'Requires investigation'],
            ['Automation Framework', 'Node.js Selenium Webdriver', '-', 'Headless Chrome']
        ];

        metricsData.forEach(row => {
            const r = wsSummary.addRow(row);
            r.eachCell(cell => {
                cell.font = { name: 'Segoe UI', size: 10 };
            });
        });

        // -------------------------------------------------------------
        // Sheet 2: Web Test Case Details
        // -------------------------------------------------------------
        const wsDetails = workbook.addWorksheet('Web Test Details');
        wsDetails.views = [{ showGridLines: true }];

        const detailHeaders = ['#', 'Test Suite', 'Web Scenario Name', 'Status', 'Duration (s)', 'Timestamp', 'Failure Reason'];
        const dHeaderRow = wsDetails.addRow(detailHeaders);
        dHeaderRow.eachCell(cell => {
            cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17212B' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        testResults.forEach((res, idx) => {
            const r = wsDetails.addRow([
                idx + 1,
                res.suite || 'WebTestSuite',
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
        console.log(`[+] Node.js Web Selenium Excel report generated: ${filePath}`);
    }
}

module.exports = WebExcelReporter;
