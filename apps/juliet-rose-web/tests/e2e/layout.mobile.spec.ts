import { expect, test } from '@playwright/test';

test('has no horizontal overflow on a phone', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
});

test('opens and dismisses the mobile menu accessibly', async ({ page }) => {
  await page.goto('/');

  const openMenu = page.getByRole('button', { name: 'Open menu' });
  await openMenu.click();
  const closeMenu = page.getByRole('button', { name: 'Close menu' });
  await expect(closeMenu).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(openMenu).toHaveAttribute('aria-expanded', 'false');
});

test('keeps booking available from the mobile viewport', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Book an appointment' }).last(),
  ).toBeVisible();
});

test('keeps treatment browsing and booking controls usable on a phone', async ({
  page,
}) => {
  await page.goto('/treatments');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Treatments & prices' }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts?.ready);

  const catalogLayout = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>('.editorial-page-hero')!;
    const title = hero.querySelector<HTMLElement>('h1')!;
    const promiseParts = Array.from(
      hero.querySelectorAll<HTMLElement>(
        '.editorial-page-hero-highlights li > *',
      ),
    );
    const catalog = document.querySelector<HTMLElement>('.treatment-catalog')!;
    const firstTreatment =
      catalog.querySelector<HTMLElement>('.catalog-treatment')!;
    const price = firstTreatment.querySelector<HTMLElement>('strong')!;
    const bookingLink = firstTreatment.querySelector<HTMLElement>('a')!;
    const heroBox = hero.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const catalogBox = catalog.getBoundingClientRect();
    const priceBox = price.getBoundingClientRect();
    const bookingBox = bookingLink.getBoundingClientRect();
    const promiseBoxes = promiseParts.map((part) =>
      part.getBoundingClientRect(),
    );
    const promiseLeft = Math.min(...promiseBoxes.map((box) => box.left));
    const promiseRight = Math.max(...promiseBoxes.map((box) => box.right));

    return {
      catalogGap: catalogBox.top - heroBox.bottom,
      titleCenterOffset:
        titleBox.left + titleBox.width / 2 - (heroBox.left + heroBox.width / 2),
      promiseContentCenterOffset:
        (promiseLeft + promiseRight) / 2 - (heroBox.left + heroBox.width / 2),
      actionCenterOffset:
        priceBox.top +
        priceBox.height / 2 -
        (bookingBox.top + bookingBox.height / 2),
      bookingTargetHeight: bookingBox.height,
    };
  });

  expect(Math.abs(catalogLayout.titleCenterOffset)).toBeLessThanOrEqual(2);
  expect(
    Math.abs(catalogLayout.promiseContentCenterOffset),
  ).toBeLessThanOrEqual(4);
  expect(catalogLayout.catalogGap).toBeGreaterThanOrEqual(20);
  expect(Math.abs(catalogLayout.actionCenterOffset)).toBeLessThanOrEqual(2);
  expect(catalogLayout.bookingTargetHeight).toBeGreaterThanOrEqual(44);
  await expect(page.locator('html')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('html').evaluate((element) => element.clientWidth),
  );

  await page.goto('/book?service=swedish-massage');
  await expect(page.getByRole('combobox', { name: 'Treatment' })).toHaveValue(
    'swedish-massage',
  );
  await expect(
    page.getByRole('heading', { name: 'Choose a date' }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('html').evaluate((element) => element.clientWidth),
  );
});
