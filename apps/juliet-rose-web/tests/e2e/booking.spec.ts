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
  await expect(page.getByText('Professional & friendly care')).toBeVisible();
  await expect(page.getByText('Relaxing environment')).toBeVisible();
  await expect(page.getByText('Tailored to your needs')).toBeVisible();

  const heroBackground = await hero.evaluate(
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(heroBackground).toContain('/images/studio-interior.jpg');
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

test('matches the booking concept at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/book?service=luxurious-espa-massage');

  const intro = page.locator('.editorial-page-hero');
  await expect(intro).toHaveCSS('background-image', /studio-interior\.jpg/);

  const firstStepLayout = await page
    .locator('.booking-step')
    .first()
    .evaluate((step) => {
      const number = step
        .querySelector('.step-number')!
        .getBoundingClientRect();
      const heading = step.querySelector('h2')!.getBoundingClientRect();
      return {
        numberRight: number.right,
        numberTop: number.top,
        headingLeft: heading.left,
        headingTop: heading.top,
      };
    });
  expect(firstStepLayout.numberRight).toBeLessThan(firstStepLayout.headingLeft);
  expect(
    Math.abs(firstStepLayout.numberTop - firstStepLayout.headingTop),
  ).toBeLessThan(8);

  const customerColumns = await page
    .locator('.customer-fields')
    .evaluate((fields) => {
      const labels = fields.querySelectorAll('label');
      const email = labels[1]!.getBoundingClientRect();
      const phone = labels[2]!.getBoundingClientRect();
      return {
        emailTop: email.top,
        phoneTop: phone.top,
        columns: getComputedStyle(fields).gridTemplateColumns,
      };
    });
  expect(customerColumns.emailTop).toBe(customerColumns.phoneTop);
  expect(customerColumns.columns.split(' ')).toHaveLength(2);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test('uses the concept layout without over-stretching on desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/book?service=luxurious-espa-massage');

  const layout = await page.evaluate(() => {
    const intro = document
      .querySelector('.editorial-page-hero')!
      .getBoundingClientRect();
    const steps = document
      .querySelector('.booking-flow')!
      .getBoundingClientRect();
    const promises = getComputedStyle(
      document.querySelector('.booking-reassurance ul')!,
    ).gridTemplateColumns;
    return { introWidth: intro.width, stepsWidth: steps.width, promises };
  });

  expect(layout.introWidth).toBeGreaterThan(1100);
  expect(layout.stepsWidth).toBeLessThanOrEqual(900);
  expect(layout.promises.split(' ')).toHaveLength(3);
});
