import { expect, test } from '@playwright/test';

test('publishes Juliet Rose metadata without inherited branding', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(
    'Juliet Rose Beauty Studio | Relax and Revitalize',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.julietrosebeauty.com/',
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'Juliet Rose Beauty Studio',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
});
