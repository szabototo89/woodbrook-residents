import { test, expect } from '@playwright/test';

const phoneWidths = [320, 360, 375, 390, 430];

phoneWidths.map((width) => {
  test(`mobile actions and service cards have a clear layout at ${width}px`, async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Phone layout is checked in Chromium and WebKit.');
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/');
    const hero = page.getByRole('region', {
      name: 'Websites that help local businesses grow.',
    });
    const actions = hero.locator('.hero-actions');
    const primary = hero.getByRole('link', { name: 'Discuss your project' });
    const secondary = hero.getByRole('link', { name: 'See Our Work' });
    const actionBounds = await actions.boundingBox();
    const primaryBounds = await primary.boundingBox();
    const secondaryBounds = await secondary.boundingBox();
    if (
      actionBounds === null ||
      primaryBounds === null ||
      secondaryBounds === null
    )
      throw new Error('Expected visible hero actions');
    expect(primaryBounds.width).toBeGreaterThanOrEqual(actionBounds.width - 1);
    expect(secondaryBounds.y).toBeGreaterThanOrEqual(
      primaryBounds.y + primaryBounds.height,
    );
    expect(
      Math.abs(secondaryBounds.x + secondaryBounds.width / 2 - width / 2),
    ).toBeLessThan(2);
    const card = page
      .getByRole('heading', { name: 'Website Design' })
      .locator('..');
    const titleBounds = await card.getByRole('heading').boundingBox();
    const iconBounds = await card.locator('.icon-circle').boundingBox();
    if (titleBounds === null || iconBounds === null)
      throw new Error('Expected visible service title and icon');
    expect(
      Math.abs(
        titleBounds.y +
          titleBounds.height / 2 -
          iconBounds.y -
          iconBounds.height / 2,
      ),
    ).toBeLessThan(2);
    await card.locator('summary').click();
    await expect(card.getByText('A clear enquiry journey')).toBeVisible();
    await page
      .getByRole('link', { name: 'Discuss Growth', exact: true })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    const contact = page.getByRole('region', {
      name: /Let’s build a stronger/,
    });
    await expect(
      contact.getByRole('link', { name: 'Email us' }),
    ).toBeInViewport();
    await expect(
      contact.getByRole('link', { name: 'szabototo89@gmail.com' }),
    ).toHaveAttribute('href', /^mailto:szabototo89@gmail\.com\?/);
    const clipped = await page
      .locator(
        'main h1, main h2, main h3, main p, main a, main summary, main button',
      )
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.getClientRects().length > 0)
          .filter((node) => {
            const bounds = node.getBoundingClientRect();
            return bounds.left < -1 || bounds.right > innerWidth + 1;
          })
          .map((node) => node.textContent?.trim()),
      );
    expect(clipped).toEqual([]);
  });
});

test('mobile navigation stays reachable on a short landscape screen', async ({
  page,
  isMobile,
}) => {
  test.skip(
    !isMobile,
    'Phone landscape layout is checked in Chromium and WebKit.',
  );
  await page.setViewportSize({ width: 640, height: 320 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const bounds = await nav.boundingBox();
  if (bounds === null) throw new Error('Expected visible landscape navigation');
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(320);
  const contact = nav.getByRole('link', { name: 'Contact', exact: true });
  await contact.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('button', { name: 'Close navigation' }),
  ).toBeInViewport();
  await contact.click();
  await expect(page).toHaveURL(/#contact$/);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('journal guides remain readable and contact stays reachable on a small phone', async ({
  page,
  isMobile,
}) => {
  test.skip(
    !isMobile,
    'Journal phone layout is checked in Chromium and WebKit.',
  );
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/blog');
  await page.locator('summary').filter({ hasText: 'Read guide' }).click();
  await expect(
    page.getByText(/Start with the questions your customers/),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('link', { name: 'Discuss your project' }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.getByRole('link', { name: 'Email us' })).toBeVisible();
});
