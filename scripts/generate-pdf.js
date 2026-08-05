const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  try {
    return require('chrome-finder')();
  } catch {
    throw new Error('找不到 Chrome，请设置 CHROME_PATH 环境变量');
  }
}

const chromePath = findChrome();
const docsDir = path.resolve(__dirname, '../docs');
const pdfPath = path.join(docsDir, 'lianghuaibin.pdf');
const htmlPath = path.join(docsDir, 'index.html');

const result = spawnSync(chromePath, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  `--print-to-pdf=${pdfPath}`,
  '--print-to-pdf-no-header',
  `file://${htmlPath}`,
], { stdio: 'inherit' });

if (result.status !== 0) process.exit(result.status || 1);
console.log(`Generated: ${pdfPath}`);
