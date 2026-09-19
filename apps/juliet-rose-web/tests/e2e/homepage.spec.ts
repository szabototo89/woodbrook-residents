import { expect, test } from '@playwright/test';

const bookingUrl = 'https://www.julietrosebeauty.com/book-online';

test('presents the Juliet Rose design and booking journey', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Relax and Revitalize' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Find the right treatment for you' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Featured treatments' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'The perfect gift' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Juliet Rose beauty studio' }),
  ).toBeVisible();

  const bookingLinks = page.getByRole('link', { name: 'Book an appointment' });
  await expect(bookingLinks.first()).toHaveAttribute('href', bookingUrl);
});

test('makes every treatment category one accessible link', async ({ page }) => {
  await page.goto('/');

  const categoryNames = [
    /Facials & Skin.*signature facial/,
    /Massage.*therapeutic massage/,
    /Beauty Essentials.*brows/,
    /Packages.*combination of treatments/,
  ];

  for (const name of categoryNames) {
    await expect(page.getByRole('link', { name })).toHaveAttribute(
      'href',
      bookingUrl,
    );
  }
});

test('uses the selected typography consistently', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const fonts = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    heading: getComputedStyle(document.querySelector('h1')!).fontFamily,
  }));

  expect(fonts.body).toContain('Manrope');
  expect(fonts.heading).toContain('Instrument Serif');
});
