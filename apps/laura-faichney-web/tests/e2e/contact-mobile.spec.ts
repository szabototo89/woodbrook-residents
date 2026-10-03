import { expect, test } from '../fixtures/gallery-test';

test.use({
  browserName: 'webkit',
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});

test('touch navigation, service selection and enquiry submission work on mobile Safari', async ({
  page,
  context,
}) => {
  await context.route(
    'https://docs.google.com/forms/**/formResponse?hl=en',
    (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<h1>Your response has been recorded.</h1>',
      }),
  );
  await page.goto('/contact?service=art-tutoring');
  await page
    .locator('.contact-hero')
    .getByRole('link', { name: 'Start a Project' })
    .tap();
  await expect(page.getByLabel('Your Name')).toBeFocused();
  await expect(page.getByLabel('Service Interested In')).toHaveValue(
    'art-tutoring',
  );
  await page.getByLabel('Your Name').fill('Jo');
  await page.getByLabel('Your Email').fill('jo@example.com');
  await page.getByLabel('Your Message').fill('I would love to learn to paint.');
  await page.getByRole('button', { name: 'Send Enquiry' }).tap();
  await expect(page.getByRole('status')).toContainText(
    'Your enquiry has been submitted',
  );
  await expect(page.locator('main')).not.toContainText(/Google|new tab/i);
  expect(context.pages()).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
