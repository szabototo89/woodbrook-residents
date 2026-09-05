import { expect, test } from '@playwright/test';

test('shows researched community content and supports primary navigation', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /our woodbrook, together/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Woodbrook DART station',
      exact: true,
    }),
  ).toBeVisible();

  await page
    .getByRole('link', { name: 'Projects', exact: true })
    .first()
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Projects and initiatives' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Woodbrook housing delivery' }),
  ).toBeVisible();
});

test('validates a private issue report before sending it', async ({ page }) => {
  await page.goto('/report');
  await page.getByRole('button', { name: 'Submit private report' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'Please choose a category',
  );
});

test('unknown routes have a useful recovery path', async ({ page }) => {
  await page.goto('/not-a-real-page');

  await expect(
    page.getByRole('heading', { name: 'That page could not be found' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Return to the homepage' }),
  ).toBeVisible();
});
