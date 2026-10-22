import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 2, reducedMotion: 'reduce' });

test('repository MDX handoffs open with tables, checklists and rendered C4 diagrams', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Agent handoffs', exact: true }),
    ).toBeVisible();
    const cards = page.locator('.handoff-card');
    await expect(cards).toHaveCount(7);
    await expect(cards.first()).toContainText('Complete');
    await expect(cards.first()).toContainText(
      /Updated \d{1,2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2} UTC/,
    );
    await expect(page.getByText('7 handoffs', { exact: false })).toBeVisible();
    await expect(page.locator('.handoff-card h2').first()).toHaveText(
      'Sanity as the default Woodbrook source',
    );
    await page.evaluate(() => document.fonts.ready);
    if (process.env.HANDOFF_SCREENSHOT_DIR)
      await page.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/handoffs-${width}.png`,
        fullPage: true,
        scale: 'device',
      });
    await page.getByRole('link', { name: 'Browseable agent handoffs' }).click();
    await expect(page).toHaveURL(/#\/agent-handoffs$/);
    const metadata = page.locator('.handoff-metadata');
    await expect(metadata).toContainText('Worktree');
    await expect(metadata).toContainText('Coding agent');
    await expect(metadata).toContainText('opencode');
    await expect(metadata).toContainText('Session');
    await expect(metadata).toContainText(/ses_/);
    await expect(metadata).toContainText('session/handoffs-landing-ui');
    await expect(metadata.locator('time')).toHaveAttribute('datetime', /Z$/);
    const statusBounds = await metadata.locator('> div').nth(0).boundingBox();
    const agentBounds = await metadata.locator('> div').nth(1).boundingBox();
    const sessionBounds = await metadata.locator('> div').nth(2).boundingBox();
    expect(statusBounds!.y).toBe(agentBounds!.y);
    expect(agentBounds!.x).toBeGreaterThan(statusBounds!.x);
    if (width === 1440) {
      expect(sessionBounds!.y).toBe(statusBounds!.y);
      expect(sessionBounds!.x).toBeGreaterThan(agentBounds!.x);
    }
    expect((await metadata.boundingBox())!.height).toBeLessThan(
      width === 1440 ? 240 : 380,
    );
    await page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('button', { name: 'Appearance', exact: true })
      .click();
    await expect(page).toHaveURL(/#\/agent-handoffs$/);
    await expect(
      page.getByRole('heading', { name: 'Current state', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('table').first()).toContainText('Guidance');
    await expect(page.getByRole('checkbox').first()).toBeDisabled();
    const gallery = page.getByRole('region', { name: 'Appearance gallery' });
    await expect(
      gallery.getByRole('img', { name: 'Desktop handoff index' }),
    ).toBeVisible();
    await gallery.getByRole('button', { name: 'Show Mobile index' }).click();
    await expect(
      gallery.getByRole('img', { name: 'Mobile handoff index' }),
    ).toBeVisible();
    await expect(
      gallery.getByText(
        'Check that controls stack cleanly, the update chips fit, and status and update time remain readable at phone width.',
      ),
    ).toBeVisible();
    expect(
      await gallery
        .getByRole('img', { name: 'Mobile handoff index' })
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(
      gallery.getByRole('link', { name: 'Open full size' }),
    ).toHaveAttribute('href', /\.png$/);
    await gallery.getByRole('button', { name: 'Next image' }).click();
    await expect(
      gallery.getByRole('img', { name: 'Desktop PlantUML diagram viewer' }),
    ).toBeVisible();
    if (process.env.HANDOFF_SCREENSHOT_DIR)
      await gallery.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/gallery-${width}.png`,
        scale: 'device',
      });
    await expect(
      page.getByText(
        'Change: added a standalone handoff viewer outside the public website.',
        { exact: true },
      ),
    ).toBeVisible();
    for (const disclosure of await page
      .locator('.diagram-disclosure > summary')
      .all())
      await disclosure.click();
    await expect(
      page.getByRole('img', { name: /C4 architecture diagram/ }).first(),
    ).toBeVisible();
    const diagrams = page.locator('.handoff-diagram img');
    await expect(diagrams).toHaveCount(3);
    await expect(diagrams.last()).toBeVisible();
    for (const diagram of await diagrams.all()) {
      await expect(diagram).toHaveAttribute('src', /\.svg$/);
      await expect
        .poll(() =>
          diagram.evaluate((image: HTMLImageElement) => image.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    if (process.env.HANDOFF_SCREENSHOT_DIR)
      await page.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/document-${width}.png`,
        scale: 'device',
      });
    if (process.env.HANDOFF_SCREENSHOT_DIR) {
      await page
        .getByRole('heading', { name: 'C1 - System context' })
        .scrollIntoViewIfNeeded();
      await page
        .locator('.handoff-diagram')
        .first()
        .screenshot({
          path: `${process.env.HANDOFF_SCREENSHOT_DIR}/architecture-${width}.png`,
          scale: 'device',
        });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole('link', { name: 'All handoffs' }).click();
    await expect(
      page.getByRole('heading', { name: 'Agent handoffs', exact: true }),
    ).toBeVisible();
  }
});

test('unknown handoffs show a recovery link', async ({ page }) => {
  await page.goto('/#/missing-handoff');
  await expect(
    page.getByRole('heading', { name: 'Handoff not found' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'All handoffs' }).click();
  await expect(
    page.getByRole('heading', { name: 'Agent handoffs', exact: true }),
  ).toBeVisible();
});

test('the index searches, filters by update time and sorts', async ({
  page,
}) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search handoffs' });
  const cards = page.locator('.handoff-card');
  const count = page.locator('.handoffs-count');

  await search.fill('blocked');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('Clerk accounts');
  await expect(count).toHaveText('1 of 7 handoffs');

  await search.fill('rare-term');
  await expect(
    page.getByRole('heading', { name: 'No matching handoffs' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Show all handoffs' }).click();
  await expect(cards).toHaveCount(7);

  const range = page.getByRole('group', { name: 'Updated' });
  await range.getByRole('button', { name: '7 days' }).click();
  await expect(range.getByRole('button', { name: '7 days' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(count).toContainText('of 7 handoffs');
  await range.getByRole('button', { name: 'All' }).click();
  await expect(range.getByRole('button', { name: 'All' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  const sort = page.getByLabel('Sort');
  await sort.selectOption('oldest');
  await expect(cards.locator('h2').first()).toHaveText(
    'News publication order',
  );
  await sort.selectOption('title');
  await expect(cards.locator('h2').first()).toHaveText(
    'Browseable agent handoffs',
  );
  await sort.selectOption('newest');
  await expect(cards.locator('h2').first()).toHaveText(
    'Sanity as the default Woodbrook source',
  );
});

test('PlantUML diagrams fit the viewer and support zoom, pan and reset at desktop and phone widths', async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.goto('/#/agent-handoffs');
    const diagram = page.locator('.handoff-diagram').first();
    await diagram.getByText('View diagram', { exact: true }).click();
    const canvas = diagram.getByRole('region', { name: 'System context' });
    const image = diagram.getByRole('img');
    await expect(image).toBeVisible();
    await expect(
      diagram.getByRole('button', { name: 'Fit diagram' }),
    ).toBeVisible();
    const toolbar = (await diagram
      .getByRole('group', { name: 'System context controls' })
      .boundingBox())!;
    expect(toolbar.y + toolbar.height).toBeLessThanOrEqual(
      (await canvas.boundingBox())!.y,
    );
    await expect
      .poll(async () => {
        const frame = (await canvas.boundingBox())!;
        const bounds = (await image.boundingBox())!;
        return (
          bounds.width <= frame.width + 1 && bounds.height <= frame.height + 1
        );
      })
      .toBe(true);
    const fitted = (await image.boundingBox())!;
    await diagram.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await expect
      .poll(async () => (await image.boundingBox())!.width)
      .toBeGreaterThan(fitted.width * 1.1);
    const zoomed = (await image.boundingBox())!;
    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(async () => (await image.boundingBox())!.x)
      .not.toBe(zoomed.x);
    await diagram
      .getByRole('button', { name: 'Zoom out', exact: true })
      .click();
    await expect
      .poll(async () => (await image.boundingBox())!.width)
      .toBeLessThan(zoomed.width);
    await diagram.getByRole('button', { name: 'Fit diagram' }).click();
    await expect
      .poll(async () =>
        Math.abs((await image.boundingBox())!.width - fitted.width),
      )
      .toBeLessThan(1);
    await diagram.getByText('Diagram source', { exact: true }).click();
    await expect(diagram.locator('code')).toContainText('@startuml');
    await expect(
      diagram.getByRole('link', { name: 'Open full size' }),
    ).toHaveAttribute('href', /\.svg$/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});

test('all migrated C4 diagrams load locally and fit inside their viewer', async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4182/'))
      externalRequests.push(request.url());
  });
  for (const slug of ['agent-handoffs', 'clerk-authentication']) {
    await page.goto(`/#/${slug}`);
    for (const diagram of await page.locator('.handoff-diagram').all()) {
      await diagram.getByText('View diagram', { exact: true }).click();
      const image = diagram.getByRole('img');
      await expect
        .poll(() =>
          image.evaluate((element: HTMLImageElement) => element.naturalWidth),
        )
        .toBeGreaterThan(0);
      await expect
        .poll(async () => {
          const frame = (await diagram.getByRole('region').boundingBox())!;
          const bounds = (await image.boundingBox())!;
          return (
            bounds.width <= frame.width + 1 && bounds.height <= frame.height + 1
          );
        })
        .toBe(true);
    }
  }
  expect(externalRequests).toEqual([]);
});

test('phone gestures pinch to zoom and drag to navigate the diagram', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
    ...(process.env.HANDOFF_SCREENSHOT_DIR
      ? {
          recordVideo: {
            dir: 'test-results/diagram-video',
            size: { width: 390, height: 844 },
          },
        }
      : {}),
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    await page.goto('http://127.0.0.1:4182/#/agent-handoffs');
    const diagram = page.locator('.handoff-diagram').first();
    await diagram.getByText('View diagram', { exact: true }).click();
    const canvas = diagram.getByRole('region', { name: 'System context' });
    await canvas.scrollIntoViewIfNeeded();
    const image = diagram.getByRole('img');
    const before = (await image.boundingBox())!;
    const bounds = (await canvas.boundingBox())!;
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    const session = await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [
        { x: x - 25, y, id: 1 },
        { x: x + 25, y, id: 2 },
      ],
    });
    for (const distance of [35, 45, 55, 65]) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          { x: x - distance, y, id: 1 },
          { x: x + distance, y, id: 2 },
        ],
      });
    }
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect
      .poll(async () => (await image.boundingBox())!.width)
      .toBeGreaterThan(before.width * 1.5);
    const zoomed = (await image.boundingBox())!;
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y, id: 1 }],
    });
    for (const offset of [10, 20, 30, 40]) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + offset, y: y + offset, id: 1 }],
      });
    }
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect
      .poll(async () => (await image.boundingBox())!.x)
      .not.toBe(zoomed.x);
    await diagram.getByRole('button', { name: 'Fit diagram' }).tap();
    await expect
      .poll(async () =>
        Math.abs((await image.boundingBox())!.width - before.width),
      )
      .toBeLessThan(1);
  } finally {
    await context.close();
    if (video && process.env.HANDOFF_SCREENSHOT_DIR)
      await video.saveAs(
        `${process.env.HANDOFF_SCREENSHOT_DIR}/diagram-navigation.webm`,
      );
  }
});
