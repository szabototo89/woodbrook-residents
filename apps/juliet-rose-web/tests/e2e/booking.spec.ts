import { expect, test } from '@playwright/test';

test('uses treatment imagery behind the catalog introduction', async ({
  page,
}) => {
  await page.goto('/treatments');

  const heroBackground = await page
    .locator('.editorial-page-hero')
    .evaluate((element) => getComputedStyle(element).backgroundImage);

  expect(heroBackground).toContain('/images/facial-hero.jpg');
  expect(heroBackground.match(/linear-gradient/g)).toHaveLength(2);
});

test('uses the editorial introduction on the booking journey', async ({
  page,
}) => {
  await page.goto('/book');

  const hero = page.locator('.editorial-page-hero');
  await expect(
    hero.getByRole('heading', { level: 1, name: 'Request an appointment' }),
  ).toBeVisible();
  await expect(hero.getByText('Pick a preferred date')).toBeVisible();
  await expect(hero.getByText('Await confirmation')).toBeVisible();

  const heroBackground = await hero.evaluate(
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(heroBackground).toContain('/images/facial-hero.jpg');
});

test('browses sourced treatments and starts the matching booking', async ({
  page,
}) => {
  await page.goto('/treatments');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Treatments & prices' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Facials & skin' }),
  ).toBeVisible();
  await expect(page.getByText('Relax & unwind')).toBeVisible();
  await expect(page.getByText('Natural radiance')).toBeVisible();
  await expect(page.getByText('A more confident you')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Not sure what to choose?' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact us' })).toHaveAttribute(
    'href',
    '/#contact',
  );

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Swedish massage' })
    .getByRole('link', { name: 'Book' })
    .click();

  await expect(page).toHaveURL(/\/book\?service=swedish-massage$/);
  await expect(page.getByRole('combobox', { name: 'Treatment' })).toHaveValue(
    'swedish-massage',
  );
});

test('submits an appointment request through the reusable booking journey', async ({
  page,
}) => {
  await page.goto('/book?service=swedish-massage');

  await page.locator('[data-day] button:not([disabled])').first().click();
  await page.getByRole('radio', { name: '10:00' }).check();
  await page.getByLabel('Name').fill('Aoife Murphy');
  await page.getByLabel('Email').fill('aoife@example.com');
  await page.getByLabel('Phone').fill('085 123 4567');
  await page.getByRole('button', { name: 'Request appointment' }).click();

  await expect(page.getByRole('status')).toContainText('Request received');
  await expect(page.getByRole('status')).toContainText('Swedish massage');
  await expect(page.getByRole('status')).toContainText(
    'Request reference: JR-',
  );
});
