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
  await expect(news.getByRole('heading', { level: 3 })).toHaveText([
    newestFirst[2]!,
    newestFirst[0]!,
    newestFirst[1]!,
  ]);
  await expect(news.locator('time')).toHaveText([
    '10 August 2025',
    '5 September 2026',
    '5 September 2026',
  ]);
});

test('news page shows news from newest to oldest publication date', async ({
  page,
}) => {
  await page.goto('/updates');

  await expect(page.getByRole('heading', { level: 3 })).toHaveText(newestFirst);
});
