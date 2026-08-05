const puppeteer = require('puppeteer-core');
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

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
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
    printBackground: false,      // 不打印背景色，#eee 灰色消失
    displayHeaderFooter: false,  // 不显示 Chrome 自带的日期/URL 页眉页脚
    margin: { top: '10mm', right: '0', bottom: '10mm', left: '0' },
  });
  await browser.close();
  console.log('Generated: docs/lianghuaibin.pdf');
}

main().catch(err => { console.error(err); process.exit(1); });
