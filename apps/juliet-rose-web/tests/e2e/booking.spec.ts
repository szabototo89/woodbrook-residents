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

test('centers the treatments title against the full hero', async ({ page }) => {
  await page.setViewportSize({ width: 885, height: 800 });
  await page.goto('/treatments');
  await page.evaluate(() => document.fonts?.ready);

  const centerOffset = await page
    .locator('.editorial-page-hero')
    .evaluate((hero) => {
      const title = hero.querySelector('h1')!;
      const titleRange = document.createRange();
      titleRange.selectNodeContents(title);
      const titleBounds = titleRange.getBoundingClientRect();
      const heroBounds = hero.getBoundingClientRect();
      return Math.abs(
        titleBounds.left +
          titleBounds.width / 2 -
          (heroBounds.left + heroBounds.width / 2),
      );
    });

  expect(centerOffset).toBeLessThanOrEqual(4);
});

test('uses the editorial introduction on the booking journey', async ({
  page,
}) => {
  await page.goto('/book');

  const hero = page.locator('.editorial-page-hero');
  await expect(
    hero.getByRole('heading', { level: 1, name: 'Request an appointment' }),
  ).toBeVisible();
  await expect(hero.getByText('Professional & friendly care')).toBeVisible();
  await expect(hero.getByText('Relaxing environment')).toBeVisible();
  await expect(hero.getByText('Tailored to your needs')).toBeVisible();

  const heroBackground = await hero.evaluate(
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(heroBackground).toContain('/images/studio-interior.jpg');
});

test('keeps booking hero copy inside its light backdrop at intermediate widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto('/book?service=luxurious-espa-massage');

  const titleLines = page.locator(
    '.editorial-page-hero-heading h1 > .booking-hero-title-line',
  );
  await expect(titleLines).toHaveCount(2);

  const copyLayout = await page
    .locator('.editorial-page-hero')
    .evaluate((hero) => {
      const heroBounds = hero.getBoundingClientRect();
      const titleLineBounds = Array.from(
        hero.querySelectorAll('.booking-hero-title-line'),
      ).map((line) => line.getBoundingClientRect());
      const descriptionBounds = hero
        .querySelector('.editorial-page-hero-heading > p:last-child')!
        .getBoundingClientRect();
      return {
        titleLineTops: titleLineBounds.map((line) => line.top),
        descriptionRightRatio:
          (descriptionBounds.right - heroBounds.left) / heroBounds.width,
        background: getComputedStyle(hero).backgroundImage,
      };
    });

  expect(copyLayout.titleLineTops[1]).toBeGreaterThan(
    copyLayout.titleLineTops[0]!,
  );
  expect(copyLayout.descriptionRightRatio).toBeLessThanOrEqual(0.68);
  expect(copyLayout.background).toContain('rgba(252, 249, 246, 0.82)');
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

test('uses the concept two-column booking layout on desktop', async ({
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
    const firstStep = document
      .querySelector('.booking-step')!
      .getBoundingClientRect();
    const sidebar = document
      .querySelector('.booking-sidebar')!
      .getBoundingClientRect();
    const promises = getComputedStyle(
      document.querySelector('.editorial-page-hero-highlights')!,
    ).gridTemplateColumns;
    return {
      introWidth: intro.width,
      stepsWidth: steps.width,
      firstStepBorder: getComputedStyle(
        document.querySelector('.booking-step')!,
      ).borderTopWidth,
      firstStepRadius: getComputedStyle(
        document.querySelector('.booking-step')!,
      ).borderRadius,
      sidebarLeft: sidebar.left,
      stepsRight: steps.right,
      sidebarWidth: sidebar.width,
      firstStepWidth: firstStep.width,
      promises,
    };
  });

  expect(layout.introWidth).toBeGreaterThan(1100);
  expect(layout.stepsWidth).toBeLessThan(760);
  expect(layout.firstStepWidth).toBe(layout.stepsWidth);
  expect(layout.sidebarLeft).toBeGreaterThanOrEqual(layout.stepsRight);
  expect(layout.sidebarWidth).toBeGreaterThan(240);
  expect(layout.firstStepBorder).toBe('1px');
  expect(Number.parseFloat(layout.firstStepRadius)).toBeGreaterThan(0);
  expect(layout.promises.split(' ')).toHaveLength(3);

  await expect(
    page.getByRole('complementary', { name: 'Your booking summary' }),
  ).toBeVisible();
  await expect(page.getByText('More than a treatment')).toBeVisible();

  const editorialTreatment = await page
    .locator('.booking-editorial-card')
    .evaluate((card) => {
      const caption = card.querySelector('figcaption')!;
      const captionStyle = getComputedStyle(caption);
      const cardBounds = card.getBoundingClientRect();
      const captionBounds = caption.getBoundingClientRect();
      return {
        overlay: getComputedStyle(card, '::after').backgroundImage,
        fontSize: Number.parseFloat(captionStyle.fontSize),
        textShadow: captionStyle.textShadow,
        rightInset: cardBounds.right - captionBounds.right,
      };
    });

  expect(editorialTreatment.overlay).toContain('90deg');
  expect(editorialTreatment.overlay).toContain('rgba(62, 40, 29');
  expect(editorialTreatment.fontSize).toBeLessThanOrEqual(22);
  expect(editorialTreatment.textShadow).not.toBe('none');
  expect(editorialTreatment.rightInset).toBeGreaterThanOrEqual(24);
  await expect(page.locator('.booking-editorial-lead > span')).toHaveCount(2);
  await expect(page.locator('.booking-editorial-detail > span')).toHaveCount(2);
  await expect(page.locator('.booking-editorial-card figcaption')).toHaveCSS(
    'text-align',
    'center',
  );
  await expect(page.locator('.booking-editorial-card figcaption')).toHaveCSS(
    'color',
    'rgb(255, 250, 243)',
  );
});

test('keeps desktop-only booking context out of the compact mobile flow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/book?service=luxurious-espa-massage');

  await expect(
    page.getByRole('complementary', { name: 'Your booking summary' }),
  ).toBeHidden();
  await expect(page.getByText('More than a treatment')).toBeHidden();
});
