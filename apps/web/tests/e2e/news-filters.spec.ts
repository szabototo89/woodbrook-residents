import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

test.use({ deviceScaleFactor: 2 });
const dart = 'Woodbrook DART station is now open';
const lda = 'LDA Woodbrook homes move through construction';
const castle = 'Shanganagh Castle Estate reaches occupation stage';

test('residents filter and sort News with shareable URLs and browser history', async ({
  page,
}) => {
  await page.goto('/updates');
  await expect(page.getByRole('status')).toHaveText('3 articles');
  await expect(page.getByRole('article', { name: lda })).toBeVisible();
  await page.getByLabel('Category', { exact: true }).selectOption('transport');
  await expect(page).toHaveURL(/category=transport/);
  await expect(page.getByRole('status')).toHaveText('1 article');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([dart]);
  await expect(page.getByText('Featured news', { exact: true })).toHaveCount(0);
  await page.getByLabel('Sort by', { exact: true }).selectOption('oldest');
  await expect(page).toHaveURL(/sort=oldest/);
  await expect(page.getByLabel('Category', { exact: true })).toHaveValue(
    'transport',
  );
  await page.reload();
  await expect(page.getByLabel('Sort by', { exact: true })).toHaveValue(
    'oldest',
  );
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([dart]);
  await page.getByLabel('Category', { exact: true }).selectOption('all');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([
    dart,
    lda,
    castle,
  ]);
  await page.goBack();
  await expect(page.getByLabel('Category', { exact: true })).toHaveValue(
    'transport',
  );
  await page.goForward();
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([
    dart,
    lda,
    castle,
  ]);
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.getByLabel('Category', { exact: true })).toHaveValue('all');
  await expect(page.getByLabel('Sort by', { exact: true })).toHaveValue(
    'newest',
  );
  await expect(page.getByRole('article', { name: lda })).toBeVisible();
  await page.getByLabel('Category', { exact: true }).selectOption('planning');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([lda]);
  await page.getByRole('link', { name: lda, exact: true }).click();
  await expect(page).toHaveURL(
    /\/updates\/lda-woodbrook-homes-construction-update$/,
  );
});

test('invalid filters fall back safely and empty categories offer recovery', async ({
  page,
}) => {
  await page.goto('/updates?category=invalid&sort=invalid');
  await expect(page.getByLabel('Category', { exact: true })).toHaveValue('all');
  await expect(page.getByLabel('Sort by', { exact: true })).toHaveValue(
    'newest',
  );
  await page.getByLabel('Category', { exact: true }).selectOption('parks');
  await expect(
    page.getByRole('heading', { name: 'No matching news' }),
  ).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 articles');
  await expect(page.getByRole('article')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.getByRole('status')).toHaveText('3 articles');
});

test('news controls work at narrow widths and capture desktop and mobile review', async ({
  page,
}) => {
  const directory = process.env.NEWS_FILTER_SCREENSHOT_DIR;
  if (directory) await mkdir(directory, { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto('/updates');
    await expect(page.getByLabel('Category', { exact: true })).toBeVisible();
    await page.getByLabel('Sort by', { exact: true }).selectOption('oldest');
    await expect(page.getByRole('heading', { level: 3 })).toHaveText([
      dart,
      lda,
      castle,
    ]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    await page.getByLabel('Category', { exact: true }).focus();
    await expect(page.getByLabel('Category', { exact: true })).toBeFocused();
    if (directory && (width === 390 || width === 1440)) {
      await page.evaluate(() => document.fonts.ready);
      const reject = page.getByRole('button', { name: 'Reject', exact: true });
      if (await reject.isVisible()) await reject.click();
      await page.screenshot({
        path: join(directory, width === 1440 ? 'desktop.png' : 'mobile.png'),
        fullPage: true,
        scale: 'device',
      });
    }
  }
});
