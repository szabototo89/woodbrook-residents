import { expect, test } from '@playwright/test';

test('keeps treatment cards balanced on desktop', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const cards = page.locator('.category-card');
  await expect(cards).toHaveCount(4);
  const widths = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().width),
  );

  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);
});
