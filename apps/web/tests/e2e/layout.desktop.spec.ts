import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 2 });

const layoutTolerancePx = 4;

test('the homepage follows the desktop reference with aligned highlights and quick services', async ({
  page,
}) => {
  // Keep the published fixture event upcoming while testing its layout.
  await page.clock.setFixedTime(new Date('2026-10-01T12:00:00.000Z'));
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Find what’s happening in Woodbrook, fast.',
    }),
  ).toBeVisible();
  const updates = page.getByRole('region', { name: 'What’s new in Woodbrook' });
  const event = page.getByRole('article', {
    name: 'DLR household hazardous waste collection day',
  });
  await expect(updates).toBeVisible();
  await expect(event).toBeVisible();
  const updateBox = await updates.boundingBox();
  const eventBox = await event.boundingBox();
  expect(Math.abs(updateBox!.y - eventBox!.y)).toBeLessThanOrEqual(
    layoutTolerancePx,
  );
  expect(eventBox!.x).toBeGreaterThan(updateBox!.x + updateBox!.width);
  const serviceLinks = page
    .getByRole('navigation', { name: 'Everyday services' })
    .getByRole('link');
  const tops = await serviceLinks.evaluateAll((links) =>
    links.map((link) => link.getBoundingClientRect().top),
  );
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(
    layoutTolerancePx,
  );
  await expect(serviceLinks).toHaveCount(6);
  await expect(
    page.getByRole('heading', { name: 'Who should I contact?' }),
  ).toBeVisible();
  if (process.env.DESIGN_SCREENSHOT_DIR)
    await page.screenshot({
      path: `${process.env.DESIGN_SCREENSHOT_DIR}/desktop.png`,
      fullPage: true,
      scale: 'device',
    });
  await serviceLinks.getByText('Healthcare & GPs').click();
  await expect(page).toHaveURL(/category=health/);
  await expect(
    page.getByRole('heading', { name: 'Shankill Family Practice' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Plumbers Dublin — Shankill' }),
  ).not.toBeVisible();
});

test('homepage search finds public updates, projects, events, consultations and services', async ({
  page,
}) => {
  await page.goto('/');
  const search = page.getByRole('search', { name: 'Search Woodbrook' });
  await search.getByRole('searchbox').fill('Woodbrook');
  await search.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/\/search\?q=Woodbrook/);
  await expect(
    page.getByRole('heading', { name: 'Search results', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Woodbrook DART station is now open',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Woodbrook housing delivery', exact: true }),
  ).toHaveAttribute('href', '/projects/woodbrook-housing-delivery');
  await expect(
    page.getByRole('link', {
      name: 'Woodbrook DART Gateway consultation archive',
      exact: true,
    }),
  ).toHaveAttribute(
    'href',
    '/surveys/woodbrook-dart-gateway-consultation-2026',
  );
  await page
    .getByRole('search', { name: 'Header search' })
    .getByRole('searchbox')
    .fill('pharmacy');
  await page
    .getByRole('search', { name: 'Header search' })
    .getByRole('searchbox')
    .press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Shankill Pharmacy' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'View details: Shankill Pharmacy', exact: true })
    .click();
  await expect(page).toHaveURL(/\/local-info\/shankill-pharmacy$/);
});

test('responsive homepage avoids overflow at phone, tablet and desktop widths', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.scrollWidth,
      `overflow at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    await expect(
      page
        .getByRole('search', { name: 'Search Woodbrook' })
        .getByRole('button', { name: 'Search' }),
    ).toBeVisible();
  }
});

test('home and inner pages share the typography scale', async ({ page }) => {
  await page.goto('/');
  const homeTitle = await page
    .locator('.home-update h3')
    .first()
    .evaluate((element) => ({
      size: getComputedStyle(element).fontSize,
      family: getComputedStyle(element).fontFamily,
    }));
  const homeBody = await page
    .locator('.home-update p')
    .first()
    .evaluate((element) => getComputedStyle(element).fontSize);
  await page.goto('/projects');
  const cardTitle = await page
    .locator('.project-card h3')
    .first()
    .evaluate((element) => ({
      size: getComputedStyle(element).fontSize,
      family: getComputedStyle(element).fontFamily,
    }));
  const cardBody = await page
    .locator('.project-card .card-body > p')
    .first()
    .evaluate((element) => getComputedStyle(element).fontSize);
  expect(homeTitle).toEqual(cardTitle);
  expect(homeBody).toEqual(cardBody);
});

test('header uses readable live lettering with a smaller muted subtitle', async ({
  page,
}) => {
  await page.goto('/');
  const brand = page
    .getByRole('banner')
    .getByRole('link', { name: 'Woodbrook Residents', exact: true });
  await expect(brand).toHaveAttribute('href', '/');
  const title = brand.getByText('Woodbrook Residents', { exact: true });
  const subtitle = brand.getByText('Community Hub', { exact: true });
  await expect(title).toBeVisible();
  await expect(subtitle).toBeVisible();
  await expect(brand.locator('img')).toHaveAttribute(
    'src',
    '/images/woodbrook-logo.png',
  );
  await expect(brand.locator('img')).toHaveAttribute('alt', '');
  const annotation = page.locator('img.coast-note');
  await expect(annotation).toHaveAttribute('src', '/images/coast-note.png');
  await expect(annotation).toHaveAttribute('alt', '');
  await expect(
    page.getByRole('navigation', { name: 'Bottom navigation' }),
  ).toHaveCount(0);
  for (const path of ['/images/woodbrook-logo.png', '/images/coast-note.png']) {
    const response = await page.request.get(path);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
  }

  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const logo = brand.locator('img');
    await expect(logo).toBeVisible();
    expect(
      await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    const titleBounds = await title.boundingBox();
    const subtitleBounds = await subtitle.boundingBox();
    expect(Math.abs(titleBounds!.x - subtitleBounds!.x)).toBeLessThan(1);
    expect(subtitleBounds!.y).toBeGreaterThanOrEqual(
      titleBounds!.y + titleBounds!.height + 3,
    );
    const typography = await brand.evaluate((element) => {
      const titleStyle = getComputedStyle(element.querySelector('strong')!);
      const subtitleStyle = getComputedStyle(
        element.querySelector('[aria-hidden="true"]')!,
      );
      return {
        titleSize: parseFloat(titleStyle.fontSize),
        subtitleSize: parseFloat(subtitleStyle.fontSize),
        titleWeight: Number(titleStyle.fontWeight),
        titleColour: titleStyle.color,
        subtitleColour: subtitleStyle.color,
      };
    });
    expect(typography.subtitleSize).toBeLessThanOrEqual(
      typography.titleSize * 0.75,
    );
    expect(typography.titleWeight).toBeLessThanOrEqual(500);
    expect(typography.subtitleColour).not.toBe(typography.titleColour);
    const bounds = await brand.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
  }
  if (process.env.DESIGN_SCREENSHOT_DIR)
    await page.getByRole('banner').screenshot({
      path: `${process.env.DESIGN_SCREENSHOT_DIR}/desktop-header.png`,
      scale: 'device',
    });
});

test('project summaries retain readable text width when imagery is absent', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page
      .locator('.home-project-list img')
      .evaluateAll((images) => images.map((image) => image.remove()));
    const titleWidths = await page
      .locator('.home-project-list h3')
      .evaluateAll((titles) =>
        titles.map((title) => title.getBoundingClientRect().width),
      );
    expect(
      Math.min(...titleWidths),
      `project title width at ${width}px`,
    ).toBeGreaterThan(200);
  }
});

test('image credit stays clear of shortcuts when the hero navigation wraps', async ({
  page,
}) => {
  for (const width of [800, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const credit = await page.locator('.coastal-image-credit').boundingBox();
    const shortcuts = await page
      .locator('.home-shortcuts a')
      .evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().toJSON()),
      );
    for (const shortcut of shortcuts) {
      const overlapWidth =
        Math.min(credit!.x + credit!.width, shortcut.right) -
        Math.max(credit!.x, shortcut.left);
      const overlapHeight =
        Math.min(credit!.y + credit!.height, shortcut.bottom) -
        Math.max(credit!.y, shortcut.top);
      expect(
        overlapWidth > 0 && overlapHeight > 0,
        `credit overlaps a shortcut at ${width}px`,
      ).toBe(false);
    }
  }
});

test('trades shortcut opens the directory with the correct filter', async ({
  page,
}) => {
  await page.goto('/');
  const shortcut = page
    .getByRole('navigation', { name: 'Explore Woodbrook' })
    .getByRole('link', { name: 'Trades & services' });
  await expect(shortcut).toHaveAttribute('href', '/local-info?category=trades');
  await shortcut.click();
  await expect(page).toHaveURL(/category=trades/);
  await expect(
    page.getByRole('heading', { name: 'Plumbers Dublin — Shankill' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Shankill Pharmacy' }),
  ).not.toBeVisible();
});
