const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const file = process.argv[2];
  const out = process.argv[3];
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve(file));
  const el = await page.$('#wrap');
  await el.screenshot({ path: out });
  await browser.close();
  console.log('wrote', out);
})();
