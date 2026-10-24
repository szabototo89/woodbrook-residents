import { expect, test } from '@playwright/test';

const newestFirst = [
  'LDA Woodbrook homes move through construction',
  'Shanganagh Castle Estate reaches occupation stage',
  'Woodbrook DART station is now open',
];

test('landing page separates the editorial feature from recent news', async ({
  page,
}) => {
  await page.goto('/');

  const news = page.getByRole('region', { name: 'What’s new in Woodbrook' });
  await expect(news.getByRole('heading', { level: 3 })).toHaveText(newestFirst);
  await expect(news.locator('time')).toHaveText([
    '5 September 2026',
    '5 September 2026',
    '10 August 2025',
  ]);
});

test('news page features the newest editorial pick above the chronological grid', async ({
  page,
}) => {
  await page.goto('/updates');

  await expect(page.getByRole('heading', { level: 3 })).toHaveText(newestFirst);
  const featured = page.getByRole('article', { name: newestFirst[0]! });
  await expect(
    featured.getByText('Featured news', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.update-card')).toHaveCount(2);
});
