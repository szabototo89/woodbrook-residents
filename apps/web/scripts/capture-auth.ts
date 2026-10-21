import { chromium } from 'playwright';
import { resolve } from 'node:path';

const output = resolve(
  import.meta.dir,
  '../../../docs/handoffs/firebase-authentication/assets',
);
const origin = process.env.AUTH_PREVIEW_URL ?? 'http://localhost:3004';
const browser = await chromium.launch();
for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await context.newPage();
  for (const route of ['login', 'register', 'forgot-password']) {
    await page.goto(`${origin}/${route}?feature_flag=firebase-auth`);
    await page.getByLabel('Email address', { exact: true }).waitFor();
    const rejectCookies = page.getByRole('button', {
      name: 'Reject',
      exact: true,
    });
    if (await rejectCookies.isVisible()) await rejectCookies.click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${output}/${route}-${viewport.name}.png`,
      fullPage: true,
    });
  }
  await context.close();
}
await browser.close();
