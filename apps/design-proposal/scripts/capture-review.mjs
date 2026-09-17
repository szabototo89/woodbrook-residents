import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseUrl =
  process.env.PROPOSAL_URL ?? 'http://127.0.0.1:4176/apps/design-proposal/';
const outputDirectory = fileURLToPath(
  new URL('../screenshots/', import.meta.url),
);

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();

for (const review of [
  { filename: 'homepage-1024x1536.png', width: 1024, height: 1536 },
  { filename: 'homepage-1440x900.png', width: 1440, height: 900 },
  { filename: 'homepage-tablet-768x1024.png', width: 768, height: 1024 },
  { filename: 'homepage-mobile-390x844.png', width: 390, height: 844 },
  { filename: 'homepage-mobile-320x800.png', width: 320, height: 800 },
]) {
  const page = await browser.newPage({
    viewport: { width: review.width, height: review.height },
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: `${outputDirectory}/${review.filename}`,
    fullPage: true,
  });
  await page.close();
}

const menuPage = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await menuPage.goto(baseUrl, { waitUntil: 'networkidle' });
await menuPage.getByRole('button', { name: 'Open menu' }).click();
await menuPage.screenshot({
  path: `${outputDirectory}/menu-mobile-390x844.png`,
});
await menuPage.close();

await browser.close();
