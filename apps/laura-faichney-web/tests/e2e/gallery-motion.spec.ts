import { expect, test } from '@playwright/test';

test('a live reduced-motion change stops shared-image travel immediately', async ({
  page,
}) => {
  await page.goto('/gallery/colour-and-nature');
  await page.waitForLoadState('networkidle');
  await page.addStyleTag({
    content:
      '::view-transition-group(selected-artwork) { animation-duration: 3s; }',
  });
  await page
    .getByRole('button', {
      name: 'View picture: Fresh strawberries in rich pink and red tones',
    })
    .click();
  await expect(
    page.locator('.collection-selected-picture img'),
  ).toHaveAttribute('src', '/artwork/picsum-1080.webp');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(
          document.documentElement,
          '::view-transition-group(selected-artwork)',
        ).animationName,
    ),
  ).toBe('none');
  expect(
    await page
      .locator('.collection-selected-picture img')
      .evaluate((image) => getComputedStyle(image).viewTransitionName),
  ).toBe('none');
  await expect(
    page.getByRole('button', {
      name: 'View picture: Fresh strawberries in rich pink and red tones',
    }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('collection and picture selections carry exactly one image into its larger view', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = document.startViewTransition.bind(document);
    const namedImages = () =>
      Array.from(document.querySelectorAll('img'))
        .filter(
          (image) =>
            getComputedStyle(image).viewTransitionName === 'selected-artwork',
        )
        .map((image) => image.getAttribute('src'))
        .join(',');
    document.startViewTransition = (update) => {
      document.documentElement.dataset.transitionSource = namedImages();
      document.documentElement.dataset.transitionReady = 'pending';
      const transition = original(update);
      void transition.ready
        .then(() => {
          document.documentElement.dataset.transitionDestination =
            namedImages();
          document.documentElement.dataset.transitionReady = 'true';
        })
        .catch(() => {
          document.documentElement.dataset.transitionReady = 'failed';
        });
      return transition;
    };
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page
    .getByRole('link', { name: 'View collection: Colour & nature' })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/gallery/colour-and-nature');
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-source',
    '/artwork/picsum-106.webp',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-destination',
    '/artwork/picsum-106.webp',
  );
  const artwork = page.locator('.collection-selected-picture');
  await expect(artwork).toBeFocused();
  await expect(artwork).toBeInViewport();
  const thumbnail = page.getByRole('button', {
    name: 'View picture: Fresh strawberries in rich pink and red tones',
  });
  await thumbnail.focus();
  await page.keyboard.press('Enter');
  await expect(thumbnail).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-source',
    '/artwork/picsum-1080.webp',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-destination',
    '/artwork/picsum-1080.webp',
  );
  await expect(artwork).toBeFocused();
  await expect(artwork).toBeInViewport();
  await page.getByRole('button', { name: 'Next picture', exact: true }).click();
  await expect(artwork.getByRole('img')).toHaveAttribute(
    'src',
    '/artwork/picsum-106.webp',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  await expect(
    page.getByRole('button', { name: 'Next picture', exact: true }),
  ).toBeFocused();
  await expect(page).toHaveURL('/gallery/colour-and-nature');
});

for (const fallback of ['unsupported', 'reduced'] as const) {
  test(`collection links and picture selection work with ${fallback} transitions`, async ({
    page,
  }) => {
    if (fallback === 'reduced')
      await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((mode) => {
      if (mode === 'unsupported')
        Object.defineProperty(document, 'startViewTransition', {
          value: undefined,
        });
      else
        document.startViewTransition = () => {
          throw new Error('Reduced motion must not start a view transition');
        };
    }, fallback);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page
      .getByRole('link', { name: 'View collection: Colour & nature' })
      .click();
    await expect(page).toHaveURL('/gallery/colour-and-nature');
    await page
      .getByRole('button', {
        name: 'View picture: Fresh strawberries in rich pink and red tones',
      })
      .click();
    await expect(
      page.locator('.collection-selected-picture').getByRole('img'),
    ).toHaveAttribute('src', '/artwork/picsum-1080.webp');
    await expect(
      page.getByRole('button', {
        name: 'View picture: Fresh strawberries in rich pink and red tones',
      }),
    ).toHaveAttribute('aria-pressed', 'true');
    if (fallback === 'reduced')
      expect(
        await page
          .locator('.collection-selected-picture img')
          .evaluate((image) => getComputedStyle(image).viewTransitionName),
      ).toBe('none');
    expect(errors).toEqual([]);
  });
}

test('touch selects collections and pictures while the mobile nav indicator stays still', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Open menu' }).tap();
  const home = page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Home', exact: true });
  expect(
    await home.evaluate(
      (link) => getComputedStyle(link, '::after').transitionDuration,
    ),
  ).toBe('0s');
  await page.getByRole('button', { name: 'Close menu' }).tap();
  await page
    .getByRole('link', { name: 'View collection: Everyday inspiration' })
    .tap();
  await expect(page).toHaveURL('/gallery/everyday-inspiration');
  await page
    .getByRole('button', {
      name: 'View picture: A notebook, camera and laptop on a creative desk',
    })
    .tap();
  await expect(
    page.locator('.collection-selected-picture').getByRole('img'),
  ).toHaveAttribute('src', '/artwork/picsum-180.webp');
  await expect(page.locator('.collection-selected-picture')).toBeInViewport();
  await context.close();
});

test('without JavaScript, services, artwork and collection links remain readable', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  expect(
    await page
      .getByRole('link', { name: /Commissioned Paintings/ })
      .evaluate((link) => getComputedStyle(link).opacity),
  ).toBe('1');
  expect(
    await page
      .locator('.mural-art')
      .evaluate((art) => getComputedStyle(art).clipPath),
  ).toBe('none');
  await page
    .getByRole('link', { name: 'View collection: Colour & nature' })
    .click();
  await expect(page).toHaveURL('/gallery/colour-and-nature');
  await expect(
    page.locator('.collection-selected-picture').getByRole('img'),
  ).toBeVisible();
  await context.close();
});
