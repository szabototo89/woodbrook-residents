import { expect, test } from '@playwright/test';

const mobileLayoutTolerancePx = 4;

test('the homepage has no horizontal overflow on a phone', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Local information and ways to take part.',
    }),
  ).toBeVisible();

  const startingPoints = [
    page.getByRole('link', { name: /find practical help/i }),
    page.getByRole('link', { name: /stay informed/i }),
    page.getByRole('link', { name: /take part/i }),
    page.getByRole('link', { name: /have your say/i }),
  ];
  for (const startingPoint of startingPoints) {
    await expect(startingPoint).toBeVisible();
  }
  const cardWidths = await Promise.all(
    startingPoints.map((startingPoint) =>
      startingPoint.evaluate(
        (element) => element.getBoundingClientRect().width,
      ),
    ),
  );

  expect(Math.max(...cardWidths) - Math.min(...cardWidths)).toBeLessThanOrEqual(
    mobileLayoutTolerancePx,
  );

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

test('the mobile navigation can be dismissed accessibly', async ({ page }) => {
  await page.goto('/');

  const openNavigation = page.getByRole('button', {
    name: 'Open navigation',
  });
  await expect(openNavigation).toHaveAttribute('aria-expanded', 'false');

  await openNavigation.click();
  const closeNavigation = page.getByRole('button', {
    name: 'Close navigation',
  });
  await expect(closeNavigation).toHaveAttribute('aria-expanded', 'true');
  const mobileNavigation = page.getByRole('navigation', {
    name: 'Mobile navigation',
  });
  await expect(mobileNavigation).toBeVisible();

  await page.touchscreen.tap(10, 180);
  await expect(openNavigation).toHaveAttribute('aria-expanded', 'false', {
    timeout: 10_000,
  });

  await openNavigation.click();
  await page.keyboard.press('Escape');
  await expect(openNavigation).toHaveAttribute('aria-expanded', 'false');
  await expect(openNavigation).toBeFocused();

  await openNavigation.click();
  await closeNavigation.click();
  await expect(openNavigation).toHaveAttribute('aria-expanded', 'false');

  await openNavigation.click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Local information' })
    .click();
  await expect(page).toHaveURL(/\/local-info$/);
  await expect(openNavigation).toHaveAttribute('aria-expanded', 'false');
});

test('the local highlight uses the full card width without overlapping facts', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-09-09T09:00:00+01:00'));
  await page.goto('/local-info');

  const highlight = page.getByRole('region', {
    name: 'Good to know locally',
  });
  await expect(highlight).toBeVisible();

  const layout = await highlight.getByRole('article').evaluate((card) => {
    const bounds = (selector: string) =>
      card.querySelector(selector)!.getBoundingClientRect();
    const title = bounds('h3');
    const facts = bounds('.local-highlight-facts');
    const action = bounds('.local-highlight-action');
    const factTerms = [...card.querySelectorAll('dt')].map((term) =>
      term.getBoundingClientRect(),
    );
    const factValues = [...card.querySelectorAll('dd')].map((value) =>
      value.getBoundingClientRect(),
    );

    return {
      card: card.getBoundingClientRect().toJSON(),
      title: title.toJSON(),
      facts: facts.toJSON(),
      action: action.toJSON(),
      factTerms: factTerms.map((term) => term.toJSON()),
      factValues: factValues.map((value) => value.toJSON()),
      viewportWidth: document.documentElement.clientWidth,
    };
  });

  expect(Math.abs(layout.title.left - layout.facts.left)).toBeLessThanOrEqual(
    mobileLayoutTolerancePx,
  );
  expect(layout.factTerms).toHaveLength(2);
  expect(layout.factValues).toHaveLength(2);
  expect(
    Math.abs(layout.factTerms[0].left - layout.factTerms[1].left),
  ).toBeLessThanOrEqual(mobileLayoutTolerancePx);
  expect(
    Math.abs(layout.factValues[0].left - layout.factValues[1].left),
  ).toBeLessThanOrEqual(mobileLayoutTolerancePx);
  expect(layout.factValues[0].left).toBeGreaterThanOrEqual(
    layout.factTerms[0].right - 1,
  );
  expect(layout.factValues[1].left).toBeGreaterThanOrEqual(
    layout.factTerms[1].right - 1,
  );
  expect(layout.action.top).toBeGreaterThanOrEqual(layout.facts.bottom - 1);
  expect(layout.card.left).toBeGreaterThanOrEqual(-1);
  expect(layout.card.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
});
