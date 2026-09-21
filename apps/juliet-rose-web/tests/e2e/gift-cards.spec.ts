import { expect, test } from '@playwright/test';

test('opens the in-app gift-card page and offers the existing checkout', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Buy a gift card' }).click();

  await expect(page).toHaveURL(/\/gift-cards$/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Give the gift of time to unwind',
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle('Gift Cards | Juliet Rose Beauty Studio');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.julietrosebeauty.com/gift-cards',
  );
  await expect(
    page.getByRole('link', { name: 'Continue to gift card checkout' }),
  ).toHaveAttribute('href', 'https://www.julietrosebeauty.com/gift-card');
});
