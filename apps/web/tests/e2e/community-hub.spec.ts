import { expect, test } from '@playwright/test';

test('shows researched community content and supports primary navigation', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /a shared place for everyday woodbrook/i,
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

  await page
    .getByRole('link', { name: 'Woodbrook housing delivery', exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Woodbrook housing delivery',
    }),
  ).toBeVisible();
  await expect(page.getByText('What happens next')).toBeVisible();
  await expect(page.getByRole('link', { name: 'All projects' })).toBeVisible();
});

test('opens event and survey detail pages from their listings', async ({
  page,
}) => {
  await page.goto('/events');
  await page.getByRole('link', { name: /^View event:/ }).click();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'DLR household hazardous waste collection day',
    }),
  ).toBeVisible();
  await expect(page.getByText('Location', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'All events' })).toBeVisible();

  await page.goto('/surveys');
  await page.getByRole('link', { name: /^View details:/ }).click();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Woodbrook DART Gateway consultation archive',
    }),
  ).toBeVisible();
  await expect(page.getByText('Source and freshness')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'All consultations' }),
  ).toBeVisible();
});

test('validates a private issue report before sending it', async ({ page }) => {
  await page.goto('/report');
  await page.getByRole('button', { name: 'Submit private report' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'Please choose a category',
  );
});

test('detail pages offer a way back when content is unavailable', async ({
  page,
}) => {
  const unavailablePages = [
    {
      path: '/events/not-published',
      heading: 'We couldn’t find that event',
      backLink: 'Back to events',
    },
    {
      path: '/projects/not-published',
      heading: 'We couldn’t find that project',
      backLink: 'Back to projects',
    },
    {
      path: '/surveys/not-published',
      heading: 'We couldn’t find that consultation',
      backLink: 'Back to consultations',
    },
  ];

  for (const unavailablePage of unavailablePages) {
    await page.goto(unavailablePage.path);
    await expect(
      page.getByRole('heading', { level: 1, name: unavailablePage.heading }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: unavailablePage.backLink }),
    ).toBeVisible();
  }
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
