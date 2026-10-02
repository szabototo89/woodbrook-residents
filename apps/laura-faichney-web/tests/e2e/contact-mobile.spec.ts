import { expect, test } from '../fixtures/gallery-test';

test.use({
  browserName: 'webkit',
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});

test('touch navigation, service selection and email composition work on mobile Safari', async ({
  page,
}) => {
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
    'Send it in your email app',
  );
  await expect(
    page.getByRole('link', { name: 'Open email draft' }),
  ).toHaveAttribute('href', /^mailto:/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
