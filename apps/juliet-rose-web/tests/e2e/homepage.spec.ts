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

test('uses the selected brand, display, and interface typography consistently', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const typography = await page.evaluate(() => {
    const stylesFor = (selector: string) =>
      getComputedStyle(document.querySelector(selector)!);
    const body = stylesFor('body');
    const hero = stylesFor('h1');
    const section = stylesFor('.section-heading h2');
    const card = stylesFor('.category-card h3');
    const eyebrow = stylesFor('.eyebrow');

    return {
      bodyFamily: body.fontFamily,
      bodySize: body.fontSize,
      brandFamily: stylesFor('.brand span').fontFamily,
      heroFamily: hero.fontFamily,
      heroWeight: hero.fontWeight,
      sectionSize: Number.parseFloat(section.fontSize),
      cardSize: card.fontSize,
      cardWeight: card.fontWeight,
      eyebrowWeight: eyebrow.fontWeight,
    };
  });

  expect(typography.bodyFamily).toContain('DM Sans');
  expect(typography.bodySize).toBe('17px');
  expect(typography.brandFamily).toContain('Instrument Serif');
  expect(typography.heroFamily).toContain('Newsreader');
  expect(typography.heroWeight).toBe('400');
  expect(typography.sectionSize).toBeGreaterThanOrEqual(38.4);
  expect(typography.cardSize).toBe('24.8px');
  expect(typography.cardWeight).toBe('500');
  expect(typography.eyebrowWeight).toBe('600');
});
