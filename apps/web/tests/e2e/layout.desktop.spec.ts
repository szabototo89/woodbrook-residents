import { expect, test } from '@playwright/test';

test('the homepage presents four balanced starting points on desktop', async ({
  page,
}) => {
  await page.goto('/');

  const startingPoints = [
    page.getByRole('link', { name: /find practical help/i }),
    page.getByRole('link', { name: /stay informed/i }),
    page.getByRole('link', { name: /take part/i }),
    page.getByRole('link', { name: /have your say/i }),
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

  const titleTops = await Promise.all(
    startingPoints.map((startingPoint) =>
      startingPoint
        .getByRole('heading', { level: 3 })
        .evaluate((element) => element.getBoundingClientRect().top),
    ),
  );

  expect(new Set(titleTops.map(Math.round)).size).toBe(1);

  const featureCardTops = await Promise.all([
    page
      .locator('article.event-card')
      .evaluate((element) => element.getBoundingClientRect().top),
    page
      .locator('article.survey-card')
      .evaluate((element) => element.getBoundingClientRect().top),
  ]);

  expect(new Set(featureCardTops.map(Math.round)).size).toBe(1);

  await page
    .getByRole('link', { name: 'Choose where to start', exact: true })
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

test('the homepage action panel keeps its icon with its label and uses clear numerals', async ({
  page,
}) => {
  await page.goto('/');

  const actionPanel = page.getByRole('heading', {
    level: 2,
    name: 'Help keep local information useful.',
  });
  const label = page.getByText('Ways to help', { exact: true });
  const icon = page.locator('.help-desk-icon');

  await expect(actionPanel).toBeVisible();
  await expect(label).toBeVisible();
  await expect(icon).toBeVisible();

  const labelGap = await Promise.all([
    icon.evaluate((element) => element.getBoundingClientRect().right),
    label.evaluate((element) => element.getBoundingClientRect().left),
  ]).then(([iconRight, labelLeft]) => labelLeft - iconRight);

  expect(labelGap).toBeGreaterThanOrEqual(0);
  expect(labelGap).toBeLessThanOrEqual(16);

  const actionBottoms = await Promise.all([
    page
      .locator('.help-desk-copy')
      .evaluate((element) => element.getBoundingClientRect().bottom),
    page
      .locator('.help-desk-card .button-row')
      .evaluate((element) => element.getBoundingClientRect().bottom),
  ]);

  expect(Math.abs(actionBottoms[0] - actionBottoms[1])).toBeLessThanOrEqual(1);
  await expect(
    page.getByRole('link', { name: 'Woodbrook Residents', exact: true }),
  ).toHaveCSS('border-radius', '12px');
  await expect(
    page.getByText('Closed 24 July 2026', { exact: true }),
  ).toHaveCSS('font-family', /Inter Variable/);
});
