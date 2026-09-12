import { expect, test } from '@playwright/test';

test('shows researched community content and supports primary navigation', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Local information and ways to take part.',
    }),
  ).toBeVisible();
  const estateImage = page.getByRole('img', {
    name: /aerial view across woodbrook toward the coast/i,
  });
  await expect(estateImage).toBeVisible();
  await expect(estateImage).toHaveAttribute(
    'src',
    '/images/woodbrook-coast-aerial-1200.jpg',
  );
  expect(
    await estateImage.evaluate((image) => {
      if (!(image instanceof HTMLImageElement)) {
        throw new Error('Expected the Woodbrook hero asset to be an image');
      }

      return image.currentSrc;
    }),
  ).toContain('woodbrook-coast-aerial-');
  expect(
    await estateImage.evaluate((image) => {
      if (!(image instanceof HTMLImageElement)) {
        throw new Error('Expected the Woodbrook hero asset to be an image');
      }

      return image.naturalWidth;
    }),
  ).toBeGreaterThanOrEqual(480);
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
    page.getByRole('heading', { level: 1, name: 'Projects' }),
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
  await expect(
    page.getByText(/curated starting set, not a complete directory/i),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'See how to suggest a correction.' }),
  ).toHaveAttribute('href', '/get-involved#corrections');

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

test('shows the qualified Thorntons bin schedule and PDF actions', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-09-09T09:00:00+01:00'));
  await page.goto('/local-info');

  const localHighlight = page.getByRole('region', {
    name: 'Good to know locally',
  });
  await expect(localHighlight).toBeVisible();
  await expect(localHighlight.getByText('15 September 2026')).toBeVisible();
  await expect(localHighlight.getByText('22 September 2026')).toBeVisible();
  await expect(
    localHighlight.getByText(
      /applies to: Thorntons customers who received this 2026 schedule/i,
    ),
  ).toBeVisible();
  await expect(
    localHighlight.getByRole('link', {
      name: /view full schedule: Thorntons 2026 bin collection schedule/i,
    }),
  ).toHaveAttribute(
    'href',
    '/local-info/thorntons-bin-collection-schedule-2026',
  );

  const search = page.getByRole('searchbox', { name: 'What do you need?' });
  await search.fill('bin collection');
  const scheduleDetails = page.getByRole('link', {
    name: 'View details: Thorntons 2026 bin collection schedule',
  });
  await expect(scheduleDetails).toBeVisible();
  await scheduleDetails.click();

  await expect(
    page.getByRole('heading', { name: 'Next collection dates' }),
  ).toBeVisible();
  await expect(page.getByText('15 September 2026')).toBeVisible();
  await expect(page.getByText('22 September 2026')).toBeVisible();
  await expect(
    page.getByText(/collection arrangements can vary by route/i),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /view 2026 bin collection schedule/i }),
  ).toHaveAttribute(
    'href',
    '/documents/thorntons-bin-collection-schedule-2026.pdf',
  );
  await expect(
    page.getByRole('link', { name: /download pdf/i }),
  ).toHaveAttribute('download', 'thorntons-bin-collection-schedule-2026.pdf');
  const pdfResponse = await page.request.get(
    '/documents/thorntons-bin-collection-schedule-2026.pdf',
  );
  expect(pdfResponse.ok()).toBe(true);
  expect(pdfResponse.headers()['content-type']).toContain('application/pdf');
  await expect(
    page.getByText(
      /checked against Thorntons Recycling 2026 collection schedule on 9 September 2026/i,
    ),
  ).toBeVisible();
});

test('uses consistent resident labels and honest contribution paths', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Woodbrook Residents', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /have your say/i }),
  ).toHaveAttribute('href', '/surveys');

  await page.goto('/get-involved');
  await expect(
    page.getByText(/does not yet accept event submissions or issue reports/i),
  ).toBeVisible();
  await expect(page.getByText(/corrections are not open yet/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Browse events' }),
  ).toHaveAttribute('href', '/events');
  await expect(
    page.getByRole('link', { name: 'View projects' }),
  ).toHaveAttribute('href', '/projects');
});

test('provides page-specific titles and canonical URLs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Woodbrook Residents | Shankill');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://localhost:3000/',
  );

  await page.goto('/events');
  await expect(page).toHaveTitle('Events | Woodbrook Residents');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /confirmed community meetings/i,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://localhost:3000/events',
  );

  await page.getByRole('link', { name: /^View event:/ }).click();
  await expect(page).toHaveTitle(
    'DLR household hazardous waste collection day | Woodbrook Residents',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://localhost:3000/events/dlr-household-hazardous-waste-day-2026',
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
    {
      path: '/local-info/not-published',
      heading: 'We couldn’t find that service',
      backLink: 'Back to local information',
    },
  ];

  await unavailablePages.reduce(async (previous, unavailablePage) => {
    await previous;
    await page.goto(unavailablePage.path);
    await expect(
      page.getByRole('heading', { level: 1, name: unavailablePage.heading }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: unavailablePage.backLink }),
    ).toBeVisible();
  }, Promise.resolve());
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
