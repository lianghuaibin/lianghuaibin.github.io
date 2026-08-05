const puppeteer = require('puppeteer-core');
const path = require('path');

function findChrome() {
  // CI 上优先用环境变量指定路径
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  // ubuntu-latest 上预装的 Chrome
  const candidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  const fs = require('fs');
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  // 本地 macOS：用 chrome-finder
  try {
    return require('chrome-finder')();
  } catch (e) {
    throw new Error('找不到 Chrome，请设置 CHROME_PATH 环境变量');
  }
}

async function main() {
  const executablePath = findChrome();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  const htmlPath = path.resolve(__dirname, '../docs/index.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.resolve(__dirname, '../docs/lianghuaibin.pdf'),
    format: 'A4',
    printBackground: false,
    margin: { top: '10mm', right: '0', bottom: '10mm', left: '0' },
  });
  await browser.close();
  console.log('Generated: docs/lianghuaibin.pdf');
}

main().catch(err => { console.error(err); process.exit(1); });
