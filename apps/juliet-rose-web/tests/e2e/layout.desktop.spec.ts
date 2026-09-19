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

test('keeps a calm vertical rhythm around treatment headings and card copy', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const rhythm = await page.evaluate(() => {
    const verticalGap = (first: string, second: string) => {
      const firstRect = document.querySelector(first)!.getBoundingClientRect();
      const secondRect = document
        .querySelector(second)!
        .getBoundingClientRect();
      return secondRect.top - firstRect.bottom;
    };

    const treatmentsHeading = document
      .querySelector('#treatments-heading')!
      .getBoundingClientRect();
    const sectionLink = document
      .querySelector('.treatments-section .section-link')!
      .getBoundingClientRect();

    return {
      eyebrowToHeading: verticalGap(
        '.treatments-section .eyebrow',
        '#treatments-heading',
      ),
      headingToCategories: verticalGap('#treatments-heading', '.category-grid'),
      headingToFeatured: verticalGap('#featured-heading', '.featured-grid'),
      categoryTitleToCopy: verticalGap('.category-card h3', '.category-card p'),
      linkAlignment: Math.abs(sectionLink.bottom - treatmentsHeading.bottom),
    };
  });

  expect(rhythm.eyebrowToHeading).toBeGreaterThanOrEqual(10);
  expect(rhythm.headingToCategories).toBeGreaterThanOrEqual(28);
  expect(rhythm.headingToFeatured).toBeGreaterThanOrEqual(28);
  expect(rhythm.categoryTitleToCopy).toBeGreaterThanOrEqual(8);
  expect(rhythm.linkAlignment).toBeLessThanOrEqual(8);
});
