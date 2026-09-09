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
  const estateImage = page.getByRole('img', {
    name: /aerial view across woodbrook toward the coast/i,
  });
  await expect(estateImage).toBeVisible();
  await expect(estateImage).toHaveAttribute(
    'src',
    '/images/woodbrook-coast-aerial.jpg',
  );
  expect(
    await estateImage.evaluate((image) => {
      if (!(image instanceof HTMLImageElement)) {
        throw new Error('Expected the Woodbrook hero asset to be an image');
      }

      return image.naturalWidth;
    }),
  ).toBe(1920);
  await expect(
    page.getByRole('link', { name: 'Woodbrook Shankill', exact: true }),
  ).toHaveAttribute('href', 'https://www.woodbrookshankill.ie/south-coast');
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
  const calendarLink = page.getByRole('link', { name: 'Add to calendar' });
  await expect(calendarLink).toHaveAttribute(
    'download',
    'dlr-household-hazardous-waste-day-2026.ics',
  );
  await expect(calendarLink).toHaveAttribute(
    'href',
    /^data:text\/calendar;charset=utf-8,/,
  );
  await expect(
    page.getByRole('link', {
      name: /open .* in google maps/i,
    }),
  ).toHaveAttribute(
    'href',
    /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/,
  );
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

test('finds local services by need and category', async ({ page }) => {
  await page.goto('/local-info');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Local information' }),
  ).toBeVisible();

  const search = page.getByRole('searchbox', { name: 'What do you need?' });
  await search.fill('plumber');
  await expect(page.getByText('1 contact', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Plumbers Dublin — Shankill' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Shankill Pharmacy' }),
  ).not.toBeVisible();

  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('button', { name: 'Health', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Shankill Pharmacy' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /call 01 282 3263/i }),
  ).toHaveAttribute('href', 'tel:012823263');
  await expect(
    page.getByRole('link', {
      name: 'Open Violet House, Main Street, Shankill, D18 P2Y3 in Google Maps',
    }),
  ).toHaveAttribute(
    'href',
    'https://www.google.com/maps/search/?api=1&query=Violet+House%2C+Main+Street%2C+Shankill%2C+D18+P2Y3',
  );
  await expect(
    page.getByText('Monday–Friday 8:30am–6:30pm; Saturday 9:30am–6pm', {
      exact: true,
    }),
  ).not.toBeVisible();

  await page
    .getByRole('link', { name: 'View details: Shankill Pharmacy' })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Shankill Pharmacy' }),
  ).toBeVisible();
  await expect(
    page.getByText('Monday–Friday 8:30am–6:30pm; Saturday 9:30am–6pm', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'Open Violet House, Main Street, Shankill, D18 P2Y3 in Google Maps',
    }),
  ).toHaveAttribute(
    'href',
    'https://www.google.com/maps/search/?api=1&query=Violet+House%2C+Main+Street%2C+Shankill%2C+D18+P2Y3',
  );
  await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:shankillpharmacyshop@gmail.com',
  );
  await expect(
    page.getByText(/checked against shankill pharmacy on 7 september 2026/i),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'All local services' }),
  ).toBeVisible();
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
    {
      path: '/local-info/not-published',
      heading: 'We couldn’t find that service',
      backLink: 'Back to local information',
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
