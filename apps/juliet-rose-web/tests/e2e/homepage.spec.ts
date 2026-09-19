import { expect, test } from '@playwright/test';

const bookingUrl = '/book';

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

  const categories = [
    {
      name: /Facials & Skin.*signature facial/,
      href: '/treatments#facials-and-skin',
    },
    { name: /Massage.*therapeutic massage/, href: '/treatments#massage' },
    {
      name: /Beauty Essentials.*brows/,
      href: '/treatments#beauty-essentials',
    },
    {
      name: /Packages.*combination of treatments/,
      href: '/treatments#packages',
    },
  ];

  for (const category of categories) {
    await expect(
      page.getByRole('link', { name: category.name }),
    ).toHaveAttribute('href', category.href);
  }
});

test('uses the proposal display serif and selected interface typography consistently', async ({
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
      bodyColor: body.color,
      bodyFamily: body.fontFamily,
      bodySize: body.fontSize,
      brandFamily: stylesFor('.brand span').fontFamily,
      cardCopyColor: stylesFor('.category-copy p').color,
      eyebrowColor: eyebrow.color,
      heroColor: hero.color,
      heroFamily: hero.fontFamily,
      heroWeight: hero.fontWeight,
      sectionSize: Number.parseFloat(section.fontSize),
      cardSize: card.fontSize,
      cardWeight: card.fontWeight,
      eyebrowWeight: eyebrow.fontWeight,
    };
  });

  expect(typography.bodyColor).toBe('rgb(51, 47, 44)');
  expect(typography.bodyFamily).toContain('DM Sans');
  expect(typography.bodySize).toBe('17px');
  expect(typography.brandFamily).toContain('Cormorant Garamond');
  expect(typography.cardCopyColor).toBe('rgb(98, 89, 86)');
  expect(typography.eyebrowColor).toBe('rgb(135, 66, 71)');
  expect(typography.heroColor).toBe('rgb(45, 41, 38)');
  expect(typography.heroFamily).toContain('Cormorant Garamond');
  expect(typography.heroWeight).toBe('500');
  expect(typography.sectionSize).toBeGreaterThanOrEqual(38.4);
  expect(typography.cardSize).toBe('24.8px');
  expect(typography.cardWeight).toBe('500');
  expect(typography.eyebrowWeight).toBe('600');
});
