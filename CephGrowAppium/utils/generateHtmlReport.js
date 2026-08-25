import fs from 'fs';
import path from 'path';

export function generateAppiumHtmlReport(summaryData, outputPath) {
  const { total, passed, failed, passRate, totalDuration, categories, testResults } = summaryData;

  const categoriesHtml = (categories || []).map(cat => `
    <div class="cat-card">
      <div class="cat-title">${cat.name}</div>
      <div class="cat-stats">${cat.passed} / ${cat.total} Passed (${cat.total > 0 ? ((cat.passed / cat.total)*100).toFixed(1) : 0}%)</div>
      <div class="progress-bg"><div class="progress-fill" style="width:${cat.total > 0 ? (cat.passed/cat.total)*100 : 0}%"></div></div>
    </div>
  `).join('');

  const rowsHtml = (testResults || []).slice(0, 100).map((t, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><span class="pill">${t.category}</span></td>
      <td>${t.title}</td>
      <td><span class="badge ${t.status === 'PASSED' || t.status === 'PASS' ? 'pass' : 'fail'}">${t.status}</span></td>
      <td>${t.duration}ms</td>
      <td class="err-cell">${t.error || '-'}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CephGrow AI — Mobile Appium Android Execution Report</title>
  <style>
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #38bdf8; font-size: 1.8rem; margin-bottom: 0.5rem; }
    .subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1rem; text-align: center; }
    .val { font-size: 2rem; font-weight: 800; margin-top: 0.2rem; }
    .val.green { color: #22c55e; }
    .val.blue { color: #38bdf8; }
    .val.yellow { color: #eab308; }
    .lbl { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; }
    .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .cat-card { background: #1e293b; border: 1px solid #334155; padding: 0.8rem; border-radius: 8px; }
    .cat-title { font-weight: 600; font-size: 0.9rem; }
    .cat-stats { font-size: 0.8rem; color: #94a3b8; margin: 0.3rem 0; }
    .progress-bg { background: #334155; height: 5px; border-radius: 3px; overflow: hidden; }
    .progress-fill { background: #22c55e; height: 100%; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; border: 1px solid #334155; }
    th, td { padding: 0.8rem 1rem; text-align: left; border-bottom: 1px solid #334155; font-size: 0.85rem; }
    th { background: #0f172a; color: #94a3b8; text-transform: uppercase; font-size: 0.75rem; }
    .badge { padding: 2px 8px; border-radius: 10px; font-weight: 700; font-size: 0.75rem; }
    .badge.pass { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .badge.fail { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .pill { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 6px; border-radius: 4px; }
    .err-cell { color: #ef4444; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 CephGrow AI — Mobile Appium E2E Report</h1>
    <div class="subtitle">Automated Android Mobile Test Suite (1,111 Test Assertions)</div>

    <div class="grid">
      <div class="card"><div class="lbl">Total Tests</div><div class="val blue">${total}</div></div>
      <div class="card"><div class="lbl">Passed</div><div class="val green">${passed}</div></div>
      <div class="card"><div class="lbl">Failed</div><div class="val">${failed}</div></div>
      <div class="card"><div class="lbl">Pass Rate</div><div class="val yellow">${passRate}%</div></div>
      <div class="card"><div class="lbl">Duration</div><div class="val blue">${(totalDuration / 1000).toFixed(2)}s</div></div>
    </div>

    <h3>Categories Breakdown (11 Categories &bull; 101 Tests Each)</h3>
    <div class="cat-grid">${categoriesHtml}</div>

    <h3>Execution Log (Preview)</h3>
    <table>
      <thead>
        <tr><th>#</th><th>Category</th><th>Test Description</th><th>Status</th><th>Duration</th><th>Error</th></tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`[Appium HTML] Saved report to: ${outputPath}`);
}
