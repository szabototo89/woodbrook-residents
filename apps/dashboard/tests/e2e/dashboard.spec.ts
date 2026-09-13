import { expect, test } from '@playwright/test';

test('environments inventory is the operational home page', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/environments');
  await expect(
    page.getByRole('heading', { name: 'Environments' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'web-local' })).toBeVisible();
  await expect(page.getByText('3 stopped').first()).toBeVisible();
});

test('environment search persists in the URL and clears cleanly', async ({
  page,
}) => {
  await page.goto('/environments');
  await page.getByLabel('Search environments').fill('cms');
  await expect(page).toHaveURL(/search=cms/);
  await expect(page.getByRole('link', { name: 'cms-local' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'web-local' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Clear filters' }).first().click();
  await expect(page).toHaveURL('/environments');
  await expect(page.getByRole('link', { name: 'web-local' })).toBeVisible();
});

test('environment detail tabs are deep-linkable with working history', async ({
  page,
}) => {
  await page.goto('/environments');
  await page.getByRole('link', { name: 'web-local' }).click();
  await expect(page).toHaveURL('/environments/web-local');
  await expect(page.getByRole('heading', { name: 'web-local' })).toBeVisible();

  await page.getByRole('link', { name: 'Logs' }).click();
  await expect(page).toHaveURL('/environments/web-local?tab=logs');
  await expect(page.getByText('No live logs')).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL('/environments/web-local');
  await expect(page.getByText('Start locally')).toBeVisible();
});

test('legacy app URLs redirect to environment detail', async ({ page }) => {
  await page.goto('/app/web');
  await expect(page).toHaveURL('/environments/web-local');

  await page.goto('/app/cms/scripts');
  await expect(page).toHaveURL('/environments/cms-local?tab=scripts');
  await expect(page.getByText('bun run --cwd apps/cms develop')).toBeVisible();
});

test('sidebar navigates the operational sections', async ({ page }) => {
  await page.goto('/environments');
  await page.getByRole('link', { name: 'Templates' }).click();
  await expect(page).toHaveURL('/templates');
  await expect(page.getByRole('heading', { name: 'Templates' })).toBeVisible();

  await page.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL('/projects');
  await expect(page.getByRole('link', { name: 'cms' })).toBeVisible();
});

test('command palette opens with the keyboard shortcut', async ({ page }) => {
  await page.goto('/environments');
  await page.keyboard.press('Control+k');
  await expect(
    page.getByRole('dialog', { name: 'Command palette' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
});

test('dashboard skip link receives keyboard focus', async ({ page }) => {
  await page.goto('/environments');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip/i }).first()).toBeFocused();
});
