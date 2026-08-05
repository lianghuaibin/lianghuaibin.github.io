const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
  const browser = await puppeteer.launch({
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
