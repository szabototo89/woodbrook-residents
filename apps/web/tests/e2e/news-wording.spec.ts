import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 2 });

test('residents browse News through navigation, search and article pages', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'News', exact: true }),
  ).toHaveAttribute('href', '/updates');
  await expect(
    page.locator('footer').getByRole('link', { name: 'News', exact: true }),
  ).toHaveAttribute('href', '/updates');
  await expect(page.getByRole('link', { name: 'Latest news' })).toBeVisible();
  await page.getByRole('link', { name: 'View all news' }).click();
  await expect(
    page.getByRole('heading', { name: 'News', exact: true, level: 1 }),
  ).toBeVisible();
  await expect(page).toHaveTitle('News | Woodbrook Residents');
  await page.screenshot({
    path: testInfo.outputPath('news-desktop.png'),
    fullPage: true,
    scale: 'device',
  });
  await page.locator('.update-card h2 a, .update-card h3 a').first().click();
  await expect(page.getByRole('link', { name: 'All news' })).toHaveAttribute(
    'href',
    '/updates',
  );
  await page.goto('/updates/missing-news-article');
  await expect(
    page.getByRole('heading', { name: 'We couldn’t find that news article' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Back to news' }),
  ).toHaveAttribute('href', '/updates');
  await page.goto('/search');
  await expect(page.getByRole('button', { name: /^News \(/ })).toBeVisible();
});

test('News stays accessible in mobile navigation', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'News', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'News', exact: true, level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeHidden();
  await page.screenshot({
    path: testInfo.outputPath('news-mobile.png'),
    fullPage: true,
    scale: 'device',
  });
});
