import { expect, test } from '../fixtures/gallery-test';

test('contact page follows the reference journey and exposes working contact links', async ({
  page,
}) => {
  await page.goto('/contact');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Get in Touch' }),
  ).toHaveCount(1);
  for (const name of [
    'Send a Message',
    'What to Include',
    'Ways I Can Help',
    'How It Works',
  ]) {
    await expect(
      page.getByRole('heading', { name, exact: true }),
    ).toBeVisible();
  }
  await expect(page.locator('.contact-service-card')).toHaveCount(3);
  await expect(page.locator('.process-steps > li')).toHaveCount(3);
  const hero = page.locator('.contact-hero');
  await expect(
    hero.getByRole('link', { name: 'Start a Project' }),
  ).toHaveAttribute('href', '#enquiry');
  await expect(hero.locator('a[href^="tel:"]')).toBeVisible();
  await expect(hero.locator('a[href^="mailto:"]')).toBeVisible();
  await hero.getByRole('link', { name: 'Start a Project' }).click();
  await expect(page.getByRole('textbox', { name: 'Your Name' })).toBeFocused();
});

test('required fields and email validation prevent incomplete enquiries', async ({
  page,
}) => {
  await page.goto('/contact');
  const form = page.getByRole('form', { name: 'Send a Message' });
  await form.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByLabel('Your Name')).toBeFocused();
  await expect(page.getByRole('status')).toBeEmpty();
  await page.getByLabel('Your Name').fill('Sarah');
  await page.getByLabel('Your Email').fill('not-an-email');
  await form.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByLabel('Your Email')).toBeFocused();
  await expect(page.getByRole('status')).toBeEmpty();
});

test('a selected service and complete enquiry produce an honest, reusable email draft', async ({
  page,
}) => {
  await page.goto('/contact?service=murals-indoor-outdoor');
  const service = page.getByLabel('Service Interested In');
  await expect(service).toHaveValue('murals-indoor-outdoor');
  await page.getByLabel('Your Name').fill('Sarah Murphy');
  await page.getByLabel('Your Email').fill('sarah@example.com');
  await page.getByLabel('Phone (optional)').fill('089 123 4567');
  await page
    .getByLabel('Your Message')
    .fill('A pink & blue mural for our café.');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText(
    'Send it in your email app',
  );
  const draft = await page
    .getByRole('link', { name: 'Open email draft' })
    .getAttribute('href');
  expect(draft).toMatch(/^mailto:/);
  const query = new URLSearchParams(draft!.split('?')[1]);
  expect(query.get('body')).toContain('Sarah Murphy');
  expect(query.get('body')).toContain('sarah@example.com');
  expect(query.get('body')).toContain('089 123 4567');
  expect(query.get('body')).toContain('A pink & blue mural for our café.');
  expect(query.get('subject')).toContain('Murals');
  await expect(page.getByLabel('Your Message')).toHaveValue(
    'A pink & blue mural for our café.',
  );
});

test('unknown service links leave the visitor free to choose', async ({
  page,
}) => {
  await page.goto('/contact?service=unknown-service');
  await expect(page.getByLabel('Service Interested In')).toHaveValue('');
  await page.getByLabel('Service Interested In').selectOption('other');
  await expect(page.getByLabel('Service Interested In')).toHaveValue('other');
});

test('whitespace cannot submit an enquiry and the visitor can correct it', async ({
  page,
}) => {
  await page.goto('/contact?service=other');
  await page.getByLabel('Your Name').fill('   ');
  await page.getByLabel('Your Email').fill('jo@example.com');
  await page.getByLabel('Your Message').fill('   ');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByLabel('Your Name')).toBeFocused();
  await expect(page.getByRole('status')).toBeEmpty();
  await page.getByLabel('Your Name').fill('Jo');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByLabel('Your Message')).toBeFocused();
  await page.getByLabel('Your Message').fill('A colourful gift.');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveAttribute('href', /A%20colourful%20gift/);
  await page.getByLabel('Your Message').fill('A different idea.');
  await expect(page.getByRole('status')).toBeEmpty();
});

for (const width of [320, 390, 640, 768, 935, 1440]) {
  test(`contact content fits and controls remain usable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/contact');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const form = page.getByRole('form', { name: 'Send a Message' });
    for (const field of await form
      .locator('input, select, textarea, button')
      .all()) {
      const bounds = await field.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(
        await field.evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        ),
      ).toBeGreaterThanOrEqual(16);
    }
    const formBounds = await form.boundingBox();
    const guide = await page
      .getByRole('complementary', { name: 'What to Include' })
      .boundingBox();
    if (!formBounds || !guide) throw new Error('Enquiry panels are missing');
    if (width <= 768)
      expect(guide.y).toBeGreaterThanOrEqual(formBounds.y + formBounds.height);
    else
      expect(guide.x).toBeGreaterThanOrEqual(formBounds.x + formBounds.width);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.screenshot({
      path: `test-results/contact-${width}.png`,
      fullPage: true,
    });
  });
}
