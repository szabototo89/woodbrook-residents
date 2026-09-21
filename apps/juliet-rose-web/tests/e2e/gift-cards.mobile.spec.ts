import { expect, test } from '@playwright/test';

test('keeps the gift-card purchase path comfortable on a phone', async ({
  page,
}) => {
  await page.goto('/gift-cards');
  await page.evaluate(() => document.fonts?.ready);

  const checkoutLink = page.getByRole('link', {
    name: 'Continue to gift card checkout',
  });
  await expect(checkoutLink).toBeVisible();

  const layout = await page.evaluate(() => {
    const link = document
      .querySelector<HTMLAnchorElement>('.gift-card-checkout-link')!
      .getBoundingClientRect();

    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      checkoutHeight: link.height,
      checkoutWidth: link.width,
    };
  });

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  expect(layout.checkoutHeight).toBeGreaterThanOrEqual(48);
  expect(layout.checkoutWidth).toBeGreaterThanOrEqual(240);
});
