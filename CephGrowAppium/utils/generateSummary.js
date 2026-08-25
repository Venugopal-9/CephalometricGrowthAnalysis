import fs from 'fs';
import path from 'path';

export function writeStepSummary(summaryData) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const content = `
## 📱 CephGrow AI Mobile Appium E2E Summary
- **Total Mobile Assertions**: ${summaryData.total}
- **Passed**: ${summaryData.passed}
- **Failed**: ${summaryData.failed}
- **Pass Rate**: **${summaryData.passRate}%**
- **Execution Time**: ${(summaryData.totalDuration / 1000).toFixed(2)}s
`;

  fs.appendFileSync(summaryPath, content, 'utf-8');
  console.log('[Appium Summary] Appended summary to $GITHUB_STEP_SUMMARY');
}
