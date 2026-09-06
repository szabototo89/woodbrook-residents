import { expect, test } from '@playwright/test';

test('the homepage presents four balanced starting points on desktop', async ({
  page,
}) => {
  await page.goto('/');

  const startingPoints = [
    page.getByRole('link', { name: /new to woodbrook/i }),
    page.getByRole('link', { name: /keep up/i }),
    page.getByRole('link', { name: /come along/i }),
    page.getByRole('link', { name: /have a say/i }),
  ];
  const boxes = await Promise.all(
    startingPoints.map((startingPoint) =>
      startingPoint.evaluate((element) => {
        const { top, width } = element.getBoundingClientRect();
        return { top, width };
      }),
    ),
  );

  expect(new Set(boxes.map(({ top }) => Math.round(top))).size).toBe(1);
  expect(new Set(boxes.map(({ width }) => Math.round(width))).size).toBe(1);

  await page
    .getByRole('link', { name: 'Explore the community hub', exact: true })
    .click();
  const anchorClearance = await page.evaluate(() => {
    const headerBottom = document
      .querySelector('.site-header')!
      .getBoundingClientRect().bottom;
    const eyebrowTop = document
      .querySelector('#community-start .eyebrow')!
      .getBoundingClientRect().top;

    return eyebrowTop - headerBottom;
  });

  expect(anchorClearance).toBeGreaterThanOrEqual(0);
});
