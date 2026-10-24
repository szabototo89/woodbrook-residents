import { expect, test } from '@playwright/test';
import { captureSearchDesign } from './search-design';

test('search submits, filters with accurate counts, restores URL state, clears and opens results', async ({
  page,
}) => {
  await page.goto('/search?q=DART');
  await expect(
    page.getByRole('heading', { name: 'Search results', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('searchbox', { name: 'Search community information' }),
  ).toHaveValue('DART');
  await expect(
    page.getByRole('button', { name: 'Projects (1)', exact: true }),
  ).toBeVisible();
  const allCount = await page
    .getByRole('button', { name: /^All \(/ })
    .textContent();
  await page.getByRole('button', { name: 'Projects (1)', exact: true }).click();
  await expect(page).toHaveURL(/\/search\?q=DART&category=projects$/);
  await expect(page.getByRole('article')).toHaveCount(1);
  await page
    .getByRole('link', { name: 'Woodbrook DART station', exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/woodbrook-dart-station$/);
  await page.goBack();
  await expect(page.getByRole('button', { name: /^All \(/ })).toHaveText(
    allCount!,
  );
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Projects (1)', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goBack();
  await expect(page.getByRole('button', { name: /^All \(/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page
    .getByRole('link', {
      name: 'Woodbrook DART station is now open',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/updates\/woodbrook-dart-station-now-open$/);
  await page.goBack();
  await page
    .getByRole('link', {
      name: 'Woodbrook DART Gateway consultation archive',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(
    /\/surveys\/woodbrook-dart-gateway-consultation-2026$/,
  );
  await page.goBack();
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(
    page.getByRole('searchbox', { name: 'Search community information' }),
  ).toHaveValue('');
  await expect(
    page.getByRole('heading', { name: 'What are you looking for?' }),
  ).toBeVisible();
  await expect(
    page.getByRole('searchbox', { name: 'Search community information' }),
  ).toBeFocused();
  await page
    .getByRole('searchbox', { name: 'Search community information' })
    .fill('no-matching-content-123');
  await page
    .getByRole('searchbox', { name: 'Search community information' })
    .press('Enter');
  await expect(page).toHaveURL(/q=no-matching-content-123/);
  await expect(
    page.getByRole('heading', { name: 'No results found' }),
  ).toBeVisible();
  await page
    .getByRole('searchbox', { name: 'Search community information' })
    .fill('waste');
  await page.getByRole('button', { name: 'Submit search' }).click();
  await expect(page.getByRole('article')).not.toHaveCount(0);
  await page.getByRole('button', { name: /^Events \(/ }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(
    page.getByText('17 October 2026', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('link', {
      name: 'DLR household hazardous waste collection day',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(
    /\/events\/dlr-household-hazardous-waste-day-2026$/,
  );
  await page.goBack();
  await page.getByRole('button', { name: /^All \(/ }).click();
  await page
    .getByRole('searchbox', { name: 'Search community information' })
    .fill('DART');
  await page
    .getByRole('searchbox', { name: 'Search community information' })
    .press('Enter');
  await page.getByRole('button', { name: /^Services \(/ }).click();
  await page
    .getByRole('link', { name: 'TFI journey planner', exact: true })
    .click();
  await expect(page).toHaveURL(/\/local-info\/tfi-journey-planner$/);
});

test('desktop header offers one search control and submits its query', async ({
  page,
}) => {
  await page.goto('/');
  const header = page.getByRole('banner');
  await expect(
    header
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Search', exact: true }),
  ).toHaveCount(0);
  await expect(header.getByRole('search')).toHaveCount(1);
  const searchbox = header.getByRole('searchbox', {
    name: 'Search news, events and services',
  });
  await expect(searchbox).toBeVisible();
  await searchbox.fill('DART');
  await searchbox.press('Enter');
  await expect(page).toHaveURL(/\/search\?q=DART$/);
  await expect(
    page.getByRole('searchbox', { name: 'Search community information' }),
  ).toHaveValue('DART');
});

test('reuses the site header branding and footer', async ({ page }) => {
  async function chromeAppearance() {
    return {
      brand: await page
        .getByRole('banner')
        .getByRole('link', { name: 'Woodbrook Residents', exact: true })
        .evaluate((element) => {
          const mark = element.querySelector('img')!;
          const style = getComputedStyle(mark);
          return {
            name: mark.getAttribute('alt'),
            image: mark.getAttribute('src'),
            background: style.backgroundColor,
            radius: style.borderRadius,
            width: style.width,
            height: style.height,
          };
        }),
      footer: await page.getByRole('contentinfo').evaluate((element) => ({
        text: element.textContent,
        background: getComputedStyle(element).backgroundColor,
        links: [...element.querySelectorAll('a')].map((link) =>
          link.getAttribute('href'),
        ),
      })),
    };
  }
  await page.goto('/');
  const sharedAppearance = await chromeAppearance();
  await page.goto('/search');
  expect(await chromeAppearance()).toEqual(sharedAppearance);
});

test('shares heading and body typography with the updates page and prioritises services', async ({
  page,
}) => {
  const typography = (element: Element) => ({
    family: getComputedStyle(element).fontFamily,
    weight: getComputedStyle(element).fontWeight,
    size: getComputedStyle(element).fontSize,
    lineHeight: getComputedStyle(element).lineHeight,
    color: getComputedStyle(element).color,
  });
  await page.goto('/updates');
  const heading = await page
    .getByRole('heading', { name: 'News', level: 1 })
    .evaluate(typography);
  const cardHeading = await page
    .locator('.update-card')
    .first()
    .getByRole('heading')
    .evaluate(typography);
  const body = await page
    .locator('.update-card')
    .first()
    .locator('p')
    .evaluate(typography);
  await page.goto('/search?q=DART');
  expect(
    await page
      .getByRole('heading', { name: 'Search results', level: 1 })
      .evaluate(typography),
  ).toEqual(heading);
  expect(
    await page
      .getByRole('article')
      .first()
      .getByRole('heading')
      .evaluate(typography),
  ).toEqual(cardHeading);
  expect(
    await page.getByRole('article').first().locator('p').evaluate(typography),
  ).toEqual(body);
  await expect(
    page
      .getByRole('group', { name: 'Filter search results' })
      .getByRole('button'),
  ).toHaveText([
    'All (5)',
    'Services (1)',
    'News (3)',
    'Projects (1)',
    'Events (0)',
  ]);
});

test.describe('desktop design review', () => {
  test.use({ deviceScaleFactor: 2 });
  test('uses shared page and card layouts with loaded thumbnails', async ({
    page,
  }, testInfo) => {
    await captureSearchDesign(page, testInfo, 1440, 'desktop');
    await captureSearchDesign(page, testInfo, 1440, 'desktop', '');
  });
});
