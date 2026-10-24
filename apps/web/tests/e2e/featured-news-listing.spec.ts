import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

test.use({ deviceScaleFactor: 2 });

const featuredTitle = 'LDA Woodbrook homes move through construction';

test('News and homepage agree on the newest feature when multiple stories are selected', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(
      page
        .getByRole('article', { name: featuredTitle })
        .getByText('Featured news', { exact: true }),
    ).toBeVisible();
    await page.goto('/updates');
    const feature = page.getByRole('article', { name: featuredTitle });
    await expect(
      feature.getByText('Featured news', { exact: true }),
    ).toBeVisible();
    await expect(feature.getByRole('link')).toHaveCount(1);
    await expect(feature.locator('time')).toHaveText('5 September 2026');
    await expect(
      feature.getByText('Land Development Agency', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Latest news', exact: true }),
    ).toBeVisible();
    await expect(page.locator('.update-card h3')).toHaveText([
      'Shanganagh Castle Estate reaches occupation stage',
      'Woodbrook DART station is now open',
    ]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    const link = feature.getByRole('link');
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await feature.evaluate(
        (element) => getComputedStyle(element).outlineStyle,
      ),
    ).toBe('solid');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      /\/updates\/lda-woodbrook-homes-construction-update$/,
    );
  }
});

test('capture featured News on desktop and mobile', async ({ page }) => {
  const directory = process.env.NEWS_LISTING_SCREENSHOT_DIR;
  test.skip(!directory, 'Opt-in review screenshots');
  await mkdir(directory!, { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/updates');
    await page.evaluate(() => document.fonts.ready);
    const reject = page.getByRole('button', { name: 'Reject', exact: true });
    if (await reject.isVisible()) await reject.click();
    await page.locator('main').screenshot({
      path: join(directory!, width === 1440 ? 'desktop.png' : 'mobile.png'),
    });
  }
});
