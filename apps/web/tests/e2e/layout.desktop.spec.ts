import { expect, test } from '@playwright/test';

const layoutTolerancePx = 4;

function expectAligned(values: number[], tolerance = layoutTolerancePx) {
  expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(
    tolerance,
  );
}

test('the homepage presents four balanced starting points on desktop', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const startingPoints = [
    page.getByRole('link', { name: /find practical help/i }),
    page.getByRole('link', { name: /stay informed/i }),
    page.getByRole('link', { name: /take part/i }),
    page.getByRole('link', { name: /have your say/i }),
  ];
  for (const startingPoint of startingPoints) {
    await expect(startingPoint).toBeVisible();
  }
  const boxes = await Promise.all(
    startingPoints.map((startingPoint) =>
      startingPoint.evaluate((element) => {
        const { top, width } = element.getBoundingClientRect();
        return { top, width };
      }),
    ),
  );

  expectAligned(boxes.map(({ top }) => top));
  expectAligned(boxes.map(({ width }) => width));

  const titleTops = await Promise.all(
    startingPoints.map((startingPoint) =>
      startingPoint
        .getByRole('heading', { level: 3 })
        .evaluate((element) => element.getBoundingClientRect().top),
    ),
  );

  expectAligned(titleTops);

  const eventCard = page.locator('article.event-card');
  const surveyCard = page.locator('article.survey-card');
  await expect(eventCard).toBeVisible();
  await expect(surveyCard).toBeVisible();
  const featureCardTops = await Promise.all([
    eventCard.evaluate((element) => element.getBoundingClientRect().top),
    surveyCard.evaluate((element) => element.getBoundingClientRect().top),
  ]);

  expectAligned(featureCardTops);

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
  await page.evaluate(() => document.fonts?.ready);

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

  expect(labelGap).toBeGreaterThanOrEqual(-1);
  expect(labelGap).toBeLessThanOrEqual(24);

  const actionBottoms = await Promise.all([
    page
      .locator('.help-desk-copy')
      .evaluate((element) => element.getBoundingClientRect().bottom),
    page
      .locator('.help-desk-card .button-row')
      .evaluate((element) => element.getBoundingClientRect().bottom),
  ]);

  expect(Math.abs(actionBottoms[0] - actionBottoms[1])).toBeLessThanOrEqual(
    layoutTolerancePx,
  );
  await expect(
    page.getByRole('link', { name: 'Woodbrook Residents home' }),
  ).toHaveCSS('border-radius', '12px');
  const closedLabel = page.getByText('Closed 24 July 2026', { exact: true });
  await expect(closedLabel).toBeVisible();
  await expect(closedLabel).toHaveCSS('font-family', /Inter/);
});
