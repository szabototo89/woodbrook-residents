import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 2 });

const typography = (element: Element) => {
  const style = getComputedStyle(element);
  return {
    family: style.fontFamily,
    size: style.fontSize,
    weight: style.fontWeight,
    lineHeight: style.lineHeight,
  };
};

test('contact guidance uses shared typography with comfortable space for each destination', async ({
  page,
}) => {
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const contact = page.getByRole('region', { name: 'Who should I contact?' });
    const heading = await contact.getByRole('heading').evaluate(typography);
    const description = await contact
      .locator('small')
      .first()
      .evaluate(typography);
    const label = await contact.locator('strong').first().evaluate(typography);
    expect(label.weight).toBe('600');
    const links = contact.getByRole('link');
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      const spacing = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          height: element.getBoundingClientRect().height,
          padding: parseFloat(style.paddingTop),
          lineHeight: parseFloat(
            getComputedStyle(element.querySelector('small')!).lineHeight,
          ),
          size: parseFloat(
            getComputedStyle(element.querySelector('small')!).fontSize,
          ),
        };
      });
      expect(spacing.height).toBeGreaterThanOrEqual(80);
      expect(spacing.padding).toBeGreaterThanOrEqual(16);
      expect(spacing.lineHeight / spacing.size).toBeGreaterThanOrEqual(1.5);
    }
    await page.goto('/get-involved');
    expect(
      await page
        .getByRole('heading', { name: 'Suggest a correction' })
        .evaluate(typography),
    ).toEqual(heading);
    await page.goto('/projects');
    expect(
      await page
        .locator('.project-card .card-body > p')
        .first()
        .evaluate(typography),
    ).toEqual(description);
  }
});

test('everyday service tiles have one icon and a lighter label without redundant arrows', async ({
  page,
}) => {
  await page.goto('/');
  const links = page
    .getByRole('navigation', { name: 'Everyday services' })
    .getByRole('link');
  for (const link of await links.all()) {
    await expect(link.locator('svg')).toHaveCount(1);
    expect(
      await link.evaluate((element) => getComputedStyle(element).fontWeight),
    ).toBe('600');
  }
  await links.getByText('Schools & childcare').click();
  await expect(page).toHaveURL(/category=education/);
});

test('featured event action rests at the foot of its card with space below the description', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-09-10T12:00:00.000Z'));
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const card = page.getByRole('article', {
      name: 'DLR household hazardous waste collection day',
    });
    const action = card.getByRole('link', { name: 'View event details' });
    const cardBounds = await card.boundingBox();
    const actionBounds = await action.boundingBox();
    const descriptionBounds = await card
      .locator('.home-event-summary')
      .boundingBox();
    const padding = await card.evaluate((element) =>
      parseFloat(getComputedStyle(element).paddingBottom),
    );
    expect(
      Math.abs(
        cardBounds!.y +
          cardBounds!.height -
          actionBounds!.y -
          actionBounds!.height -
          padding,
      ),
    ).toBeLessThanOrEqual(2);
    expect(
      actionBounds!.y - descriptionBounds!.y - descriptionBounds!.height,
    ).toBeGreaterThanOrEqual(24);
    await action.click();
    await expect(page).toHaveURL(
      /\/events\/dlr-household-hazardous-waste-day-2026$/,
    );
  }
});

test('latest updates have relaxed row spacing and share heading weight with listing cards', async ({
  page,
}) => {
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const updates = page.getByRole('region', {
      name: 'What’s new in Woodbrook',
    });
    const title = await updates.locator('h3').first().evaluate(typography);
    expect(
      parseFloat(title.lineHeight) / parseFloat(title.size),
    ).toBeGreaterThanOrEqual(1.25);
    expect(title.weight).toBe('500');
    const panelPadding = await updates.evaluate((element) =>
      parseFloat(getComputedStyle(element).paddingLeft),
    );
    expect(panelPadding).toBeGreaterThanOrEqual(20);
    if (width > 760) {
      const spacing = await updates
        .locator('.home-update')
        .nth(1)
        .evaluate((element) => ({
          top: parseFloat(getComputedStyle(element).paddingTop),
          bottom: parseFloat(getComputedStyle(element).paddingBottom),
        }));
      expect(spacing.top).toBeGreaterThanOrEqual(20);
      expect(spacing.bottom).toBeGreaterThanOrEqual(20);
    }
    await page.goto('/projects');
    expect(
      await page.locator('.project-card h3').first().evaluate(typography),
    ).toEqual(title);
  }
});

test('updates without photography keep a compact fallback and give headlines more room', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const update = page
      .getByRole('region', { name: 'What’s new in Woodbrook' })
      .getByRole('article')
      .first();
    await expect(update.locator('.home-update-placeholder')).toHaveCount(1);
    const fallback = await update
      .locator('.home-update-placeholder')
      .boundingBox();
    expect(fallback!.width).toBeLessThanOrEqual(64);
    const title = await update.getByRole('heading').boundingBox();
    expect(title!.width).toBeGreaterThanOrEqual(width < 760 ? 220 : 450);
  }
});

test('card badges share casing, spacing and typography across home and listing pages', async ({
  page,
}) => {
  const badgeStyle = (element: Element) => {
    const style = getComputedStyle(element);
    return {
      size: style.fontSize,
      weight: style.fontWeight,
      lineHeight: style.lineHeight,
      casing: style.textTransform,
      tracking: style.letterSpacing,
      padding: style.padding,
      radius: style.borderRadius,
    };
  };
  await page.goto('/');
  const update = await page
    .locator('.home-update .tag')
    .first()
    .evaluate(badgeStyle);
  expect(update.casing).toBe('none');
  expect(update.weight).toBe('600');
  expect(
    await page.locator('.home-project-row .tag').first().evaluate(badgeStyle),
  ).toEqual(update);
  expect(
    await page.locator('.home-consultations .tag').evaluate(badgeStyle),
  ).toEqual(update);
  await page.goto('/projects');
  expect(
    await page.locator('.project-card .tag').first().evaluate(badgeStyle),
  ).toEqual(update);
});

test('consultation badges and the details action remain fully exposed inside the homepage panel', async ({
  page,
}) => {
  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const rejectCookies = page.getByRole('button', {
      name: 'Reject',
      exact: true,
    });
    if (await rejectCookies.isVisible()) await rejectCookies.click();
    const panel = page.getByRole('region', { name: 'Public consultations' });
    const badge = panel.locator('.tag');
    await badge.scrollIntoViewIfNeeded();
    expect(
      await badge.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const hit = document.elementFromPoint(
          rect.left + 2,
          rect.top + rect.height / 2,
        );
        return hit?.closest('article') === element.closest('article');
      }),
    ).toBe(true);
    const action = panel.getByRole('link', { name: /^View details:/ });
    await action.scrollIntoViewIfNeeded();
    expect(
      await action.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return (
          document
            .elementFromPoint(rect.left + 2, rect.top + rect.height / 2)
            ?.closest('a') === element
        );
      }),
    ).toBe(true);
    await action.click();
    await expect(page).toHaveURL(
      /\/surveys\/woodbrook-dart-gateway-consultation-2026$/,
    );
  }
});
