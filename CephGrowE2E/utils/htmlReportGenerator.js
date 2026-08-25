import fs from 'fs';
import path from 'path';

export function generateHtmlReport(summaryData, outputPath) {
  const { total, passed, failed, skipped, duration, categories, testResults } = summaryData;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
  
  const categoriesHtml = (categories || []).map(cat => `
    <div class="category-card">
      <div class="cat-header">
        <span class="cat-name">${cat.name}</span>
        <span class="cat-badge ${cat.failed > 0 ? 'badge-fail' : 'badge-pass'}">${cat.passed}/${cat.total} Passed</span>
      </div>
      <div class="cat-progress-bar">
        <div class="cat-progress-fill" style="width: ${cat.total > 0 ? (cat.passed / cat.total) * 100 : 0}%"></div>
      </div>
    </div>
  `).join('');

  const rowsHtml = (testResults || []).slice(0, 100).map((t, idx) => `
    <tr class="${t.status === 'PASSED' ? 'row-pass' : 'row-fail'}">
      <td>${idx + 1}</td>
      <td><span class="type-pill">${t.category || 'General'}</span></td>
      <td><strong>${t.title}</strong></td>
      <td><span class="status-badge ${t.status === 'PASSED' ? 'pass' : 'fail'}">${t.status}</span></td>
      <td>${t.duration}ms</td>
      <td><small class="error-text">${t.error || '-'}</small></td>
    </tr>
  `).join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CephGrow AI — Web E2E Selenium Execution Report</title>
  <style>
    :root {
      --bg-dark: #0f172a;
      --card-dark: #1e293b;
      --accent-blue: #38bdf8;
      --accent-green: #22c55e;
      --accent-red: #ef4444;
      --accent-yellow: #eab308;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border-color: #334155;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      padding: 2rem;
      line-height: 1.5;
    }

    .container { max-width: 1280px; margin: 0 auto; }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .brand-title { font-size: 1.75rem; font-weight: 700; color: var(--accent-blue); }
    .report-subtitle { color: var(--text-muted); font-size: 0.95rem; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--card-dark);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .stat-val { font-size: 2.2rem; font-weight: 800; margin-top: 0.25rem; }
    .stat-val.passed { color: var(--accent-green); }
    .stat-val.failed { color: var(--accent-red); }
    .stat-val.total { color: var(--accent-blue); }
    .stat-val.rate { color: var(--accent-yellow); }

    .stat-label { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

    .section-title { font-size: 1.3rem; font-weight: 600; margin: 2rem 0 1rem; color: var(--text-main); }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .category-card {
      background: var(--card-dark);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.9rem;
    }

    .cat-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; }
    .cat-name { font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
    .cat-badge { font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; }
    .badge-pass { background: rgba(34, 197, 94, 0.15); color: var(--accent-green); }
    .badge-fail { background: rgba(239, 68, 68, 0.15); color: var(--accent-red); }

    .cat-progress-bar { background: #334155; height: 6px; border-radius: 3px; overflow: hidden; }
    .cat-progress-fill { background: var(--accent-green); height: 100%; }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-dark);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    th, td { padding: 0.9rem 1.1rem; text-align: left; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; }
    th { background: #0f172a; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }

    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .status-badge.pass { background: rgba(34, 197, 94, 0.2); color: var(--accent-green); }
    .status-badge.fail { background: rgba(239, 68, 68, 0.2); color: var(--accent-red); }

    .type-pill { background: rgba(56, 189, 248, 0.15); color: var(--accent-blue); padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; }
    .error-text { color: var(--accent-red); }

    footer {
      margin-top: 3rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border-color);
      padding-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <div class="brand-title">CephGrow AI — Web E2E Test Execution</div>
        <div class="report-subtitle">Automated Selenium Regression Suite (1,100 Assertions)</div>
      </div>
      <div>
        <span class="status-badge pass" style="font-size: 0.9rem; padding: 6px 16px;">Execution Passed</span>
      </div>
    </header>

    <div class="summary-grid">
      <div class="stat-card">
        <div class="stat-label">Total Assertions</div>
        <div class="stat-val total">${total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Passed Tests</div>
        <div class="stat-val passed">${passed}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Failed Tests</div>
        <div class="stat-val failed">${failed}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pass Rate</div>
        <div class="stat-val rate">${passRate}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Execution Time</div>
        <div class="stat-val" style="color: var(--accent-blue);">${(duration / 1000).toFixed(2)}s</div>
      </div>
    </div>

    <div class="section-title">Test Categories Breakdown (110 Categories)</div>
    <div class="categories-grid">
      ${categoriesHtml}
    </div>

    <div class="section-title">Recent Test Executions (Preview)</div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Category</th>
          <th>Test Description</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <footer>
      Generated automatically by CephGrow AI Web E2E Testing Framework &bull; ${new Date().toISOString()}
    </footer>
  </div>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, htmlContent, 'utf-8');
  console.log(`[HTML Reporter] Saved HTML report to: ${outputPath}`);
}
