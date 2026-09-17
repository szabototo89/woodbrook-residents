import { expect, test } from '@playwright/test';

test('presents the business and its real booking choices', async ({ page }) => {
  await page.goto('./');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Relax and Revitalize' }),
  ).toBeVisible();
  await expect(
    page.getByText('Beauty treatments in Stillorgan, South Dublin.'),
  ).toBeVisible();
  if (test.info().project.name === 'desktop') {
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeVisible();
  }

  for (const category of [
    'Facials & Skin',
    'Massage',
    'Beauty Essentials',
    'Packages',
  ]) {
    await expect(
      page.getByRole('heading', { level: 3, name: category, exact: true }),
    ).toBeVisible();
  }

  const featured = page.locator('#featured');
  for (const treatment of [
    ['Juliet Rose Signature Facial', '€95'],
    ['Microneedling', '€130'],
    ['Deep hydration 6 step facial', '€110'],
    ['Swedish massage', '€80'],
  ]) {
    const card = featured
      .getByRole('article')
      .filter({ hasText: treatment[0] });
    await expect(card).toContainText('1 hour');
    await expect(card).toContainText(treatment[1]);
    await expect(card.getByRole('link', { name: /Book now/ })).toHaveAttribute(
      'href',
      /julietrosebeauty\.com\/book-online/,
    );
  }

  await expect(
    page.getByText('10 Merville road, Stillorgan, Dublin, Ireland, A94YV78'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /0852867059/ })).toHaveAttribute(
    'href',
    'tel:+353852867059',
  );
  await expect(
    page.getByRole('link', { name: /denizzza1@gmail.com/ }),
  ).toHaveAttribute('href', 'mailto:denizzza1@gmail.com');
});

test('matches the compact desktop geometry of the proposal', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await page.goto('./');

  await expect(page.locator('.category-grid')).toHaveCSS(
    'grid-template-columns',
    /\d+(\.\d+)?px \d+(\.\d+)?px \d+(\.\d+)?px \d+(\.\d+)?px/,
  );
  await expect(page.locator('.category-card').first()).toHaveCSS(
    'border-radius',
    '4px',
  );
  await expect(page.locator('.primary-button').first()).toHaveCSS(
    'border-radius',
    '4px',
  );
  await expect(page.locator('.primary-button').first()).toHaveCSS(
    'white-space',
    'nowrap',
  );
  const actionGap = await page
    .locator('.primary-button')
    .first()
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).columnGap),
    );
  const linkGap = await page
    .locator('.section-link')
    .first()
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).columnGap),
    );
  expect(actionGap).toBeLessThanOrEqual(8);
  expect(linkGap).toBeLessThanOrEqual(8);
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'hidden');
});

test('never creates horizontal page overflow', async ({ page }) => {
  await page.goto('./');

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
});

test('opens and closes the mobile navigation accessibly', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('./');

  const toggle = page.locator('.menu-button');
  await expect(toggle).toHaveAccessibleName('Open menu');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close menu');
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toHaveCSS('background-color', 'rgb(251, 248, 244)');
  await expect(page.locator('.mobile-booking')).toBeHidden();

  const closeBars = await toggle.locator('span').evaluateAll((bars) =>
    bars
      .filter((_, index) => index !== 1)
      .map((bar) => {
        const bounds = bar.getBoundingClientRect();
        return {
          centerX: bounds.left + bounds.width / 2,
          centerY: bounds.top + bounds.height / 2,
        };
      }),
  );
  expect(Math.abs(closeBars[0].centerX - closeBars[1].centerX)).toBeLessThan(1);
  expect(Math.abs(closeBars[0].centerY - closeBars[1].centerY)).toBeLessThan(1);

  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Treatments', exact: true })
    .click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#treatments$/);
});

test('reveals mobile booking after a pause or when returning up the page', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('./');

  const booking = page.locator('.mobile-booking');
  await expect(booking).toBeHidden();
  await expect(booking).toHaveAttribute('aria-hidden', 'true');

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(100);
  await expect(booking).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(100);
  await expect(booking).toBeVisible();
  await expect(booking).toHaveAttribute('aria-hidden', 'false');

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(100);
  await expect(booking).toBeHidden();

  await page.waitForTimeout(700);
  await expect(booking).toBeVisible();
});

test('keeps the mobile gift-card action compact', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('./');

  const giftButtonWidth = await page
    .locator('.gift-section > .secondary-button')
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(giftButtonWidth).toBeLessThanOrEqual(180);
});

test('uses the compact layout at tablet width', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'tablet');
  await page.goto('./');

  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect(page.locator('.category-grid')).toHaveCSS(
    'grid-template-columns',
    /^\d+(\.\d+)?px \d+(\.\d+)?px$/,
  );
  await expect(page.locator('.featured-grid')).toHaveCSS(
    'grid-template-columns',
    /^\d+(\.\d+)?px \d+(\.\d+)?px$/,
  );

  const heroHeight = await page
    .locator('.hero')
    .evaluate((element) => element.getBoundingClientRect().height);
  const headingHeight = await page
    .locator('h1')
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(heroHeight).toBeLessThanOrEqual(460);
  expect(headingHeight).toBeLessThan(70);
  await expect(page.locator('.hero-copy')).toContainText('products, all');
});

test('keeps laptop typography and banner proportions readable', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'laptop');
  await page.goto('./');

  const supportingTextSize = await page
    .locator('.category-copy p')
    .first()
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
  expect(supportingTextSize).toBeGreaterThanOrEqual(14);

  const contentWidth = await page
    .locator('.page-width')
    .first()
    .evaluate((element) => element.getBoundingClientRect().width);
  const giftWidth = await page
    .locator('.gift-section')
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(giftWidth - contentWidth).toBeLessThanOrEqual(52);

  const giftButtonWidth = await page
    .locator('.gift-section > .secondary-button')
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(giftButtonWidth).toBeLessThanOrEqual(165);

  const giftButton = page.locator('.gift-section > .secondary-button');
  await giftButton.hover();
  await expect(giftButton).toHaveCSS('background-color', 'rgb(164, 84, 88)');
  await expect(giftButton).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('is available from the design proposals gallery', async ({ page }) => {
  await page.goto('../design-proposals/');

  const proposal = page.getByRole('article').filter({
    has: page.getByRole('heading', { name: 'Juliet Rose Beauty Studio' }),
  });
  await expect(proposal).toBeVisible();
  await proposal.getByRole('link', { name: /Open proposal/ }).click();

  await expect(
    page.getByRole('heading', { level: 1, name: 'Relax and Revitalize' }),
  ).toBeVisible();
  await expect(
    page.getByText('Beauty treatments in Stillorgan, South Dublin.'),
  ).toBeVisible();
});

test('uses the supplied image-based brand details', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle(
    'Juliet Rose Beauty Studio | Relax and Revitalize',
  );
  await expect(page.locator('svg')).toHaveCount(0);
  await expect(page.locator('.hero-aside')).toHaveCount(0);
  await expect(page.locator('.policy-link .booking-icon')).toHaveCount(2);

  for (const icon of [
    'booking-icon',
    'icon-clock',
    'icon-phone',
    'icon-email',
    'icon-instagram',
    'icon-facebook',
  ]) {
    const backgroundImage = await page
      .locator(`.${icon}`)
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundImage);
    expect(backgroundImage).toContain('.png');
  }

  const footerRose = await page
    .locator('.site-footer')
    .evaluate((footer) => getComputedStyle(footer, '::after').backgroundImage);
  expect(footerRose).toContain('footer-rose.png');
});
