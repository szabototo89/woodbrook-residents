import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

test.use({ deviceScaleFactor: 2 });

test('featured news stands out, reflows and opens through one keyboard-accessible story link', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const card = page.getByRole('article', {
      name: 'LDA Woodbrook homes move through construction',
    });
    await expect(
      card.getByText('Featured news', { exact: true }),
    ).toBeVisible();
    await expect(card.getByRole('link')).toHaveCount(1);
    await expect(card.locator('time')).toHaveText('5 September 2026');
    await expect(
      card.getByText('Land Development Agency', { exact: true }),
    ).toBeVisible();
    const styles = await card.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        color: style.color,
        heading: parseFloat(
          getComputedStyle(element.querySelector('h3')!).fontSize,
        ),
        summary: parseFloat(
          getComputedStyle(element.querySelector('.featured-news-summary')!)
            .fontSize,
        ),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    expect(styles.background).toBe('rgb(23, 61, 50)');
    expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.heading).toBeGreaterThan(styles.summary);
    expect(styles.overflow).toBe(false);
    const link = card.getByRole('link');
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await card.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).toBe('solid');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      /\/updates\/lda-woodbrook-homes-construction-update$/,
    );
  }
});

test('capture featured news on desktop and mobile', async ({ page }) => {
  const directory = process.env.FEATURED_NEWS_SCREENSHOT_DIR;
  test.skip(!directory, 'Opt-in review screenshots');
  await mkdir(directory!, { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const reject = page.getByRole('button', { name: 'Reject', exact: true });
    if (await reject.isVisible()) await reject.click();
    await page
      .getByRole('region', { name: 'What’s new in Woodbrook' })
      .screenshot({
        path: join(directory!, width === 1440 ? 'desktop.png' : 'mobile.png'),
      });
  }
});
