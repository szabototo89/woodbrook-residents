import { devices, webkit, type CDPSession, type Page } from '@playwright/test';
import { expect, test, routeGalleryFixture } from '../fixtures/gallery-test';
import { browsableCollections, galleryCollections } from './galleryCms';

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

for (const width of [320, 390, 430]) {
  test(`the picture follows an angled finger drag before release at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const [collection] = await browsableCollections();
    if (!collection) throw new Error('Browsable collection is missing');
    await page.goto(`/gallery/${collection.slug}`);
    const picture = page.locator(
      '.collection-selected-picture img[aria-hidden="false"]',
    );
    await picture.scrollIntoViewIfNeeded();
    await expect(picture).toHaveAttribute('alt', collection.photos[0]!);
    const image = await picture.elementHandle();
    const before = await image?.boundingBox();
    if (!before || !image) throw new Error('Picture is missing');
    const session = await page.context().newCDPSession(page);
    const x = before.x + before.width / 2 + 60;
    const y = before.y + before.height / 2;
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y, id: 0 }],
    });
    for (let step = 1; step <= 6; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          { x: x - (step / 6) * before.width * 0.6, y: y + step * 3, id: 0 },
        ],
      });
      await page.waitForTimeout(20);
    }
    await expect
      .poll(async () => (await image.boundingBox())?.x ?? before.x)
      .toBeLessThan(before.x - 60);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect(picture).toHaveAttribute('alt', collection.photos[1]!);
  });
}

async function gesture(
  page: Page,
  session: CDPSession,
  dx: number,
  dy = 0,
  fingers = 1,
  options: { scrollIntoView?: boolean } = {},
) {
  await page.waitForFunction(
    () => !document.documentElement.matches(':active-view-transition'),
  );
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  const frame = page.locator('.collection-carousel');
  if (options.scrollIntoView !== false) await frame.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => {
      const viewport = await frame.boundingBox();
      const selected = await page
        .locator('.collection-selected-picture img[aria-hidden="false"]')
        .boundingBox();
      return viewport && selected
        ? Math.abs(viewport.x - selected.x)
        : Infinity;
    })
    .toBeLessThan(1);
  const bounds = await frame.boundingBox();
  if (!bounds) throw new Error('Picture viewer is missing');
  const x = bounds.x + bounds.width / 2 - dx / 2;
  const y = bounds.y + bounds.height / 2 - dy / 2;
  const points = (progress: number) =>
    Array.from({ length: fingers }, (_, id) => ({
      x: x + dx * progress + id * 20,
      y: y + dy * progress + id * 20,
      id,
    }));
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: points(0),
  });
  for (let step = 1; step <= 5; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: points(step / 5),
    });
  }
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
}

async function swipePicture(
  page: Page,
  session: CDPSession,
  direction: 'next' | 'previous',
  options: { scrollIntoView?: boolean } = {},
) {
  const bounds = await page.locator('.collection-carousel').boundingBox();
  if (!bounds) throw new Error('Picture viewer is missing');
  // Cross the snap midpoint even if protocol delivery slows under parallel load.
  await gesture(
    page,
    session,
    bounds.width * 0.6 * (direction === 'next' ? -1 : 1),
    0,
    1,
    options,
  );
}

for (const reducedMotion of [
  'reduce',
  'no-preference',
  'unsupported',
] as const) {
  test(`phone swipes browse pictures and cross collection boundaries with ${reducedMotion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: reducedMotion === 'reduce' ? 'reduce' : 'no-preference',
    });
    await page.addInitScript((motion) => {
      if (motion === 'unsupported') {
        Object.defineProperty(document, 'startViewTransition', {
          value: undefined,
        });
        return;
      }
      const original = document.startViewTransition.bind(document);
      document.startViewTransition = (update) => {
        if (motion === 'reduce')
          throw new Error('Reduced motion must skip transitions');
        const transition = original(update);
        void transition.ready.then(() => {
          const main = document.querySelector('main');
          document.documentElement.dataset.collectionTransition = main
            ? getComputedStyle(main).viewTransitionName
            : '';
        });
        return transition;
      };
    }, reducedMotion);
    const [collection] = await browsableCollections();
    if (!collection) throw new Error('Browsable collection is missing');
    const collections = await galleryCollections();
    const index = collections.findIndex(
      (item) => item.slug === collection.slug,
    );
    const previous =
      collections[(index - 1 + collections.length) % collections.length]!;
    const next = collections[(index + 1) % collections.length]!;
    await page.goto(`/gallery/${collection.slug}`);
    const session = await page.context().newCDPSession(page);
    const picture = page.locator(
      '.collection-selected-picture img[aria-hidden="false"]',
    );
    const first = collection.photos[0]!;
    const last = collection.photos[collection.photos.length - 1]!;
    await expect(picture).toHaveAttribute('alt', first);
    await swipePicture(page, session, 'next');
    await expect(picture).toHaveAttribute('alt', collection.photos[1]!);
    if (reducedMotion === 'no-preference') {
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-collection-transition',
      );
    }
    await expect(
      page.getByRole('button', {
        name: `View picture: ${collection.photos[1]}`,
      }),
    ).toHaveAttribute('aria-pressed', 'true');
    await swipePicture(page, session, 'previous');
    await expect(picture).toHaveAttribute('alt', first);
    await swipePicture(page, session, 'previous');
    await expect(page).toHaveURL(`/gallery/${previous.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      previous.title,
    );
    await expect(picture).toHaveAttribute(
      'alt',
      previous.photos[previous.photos.length - 1]!,
    );
    if (reducedMotion === 'no-preference') {
      await expect(page.locator('html')).toHaveAttribute(
        'data-collection-transition',
        'collection-page',
      );
    }
    await swipePicture(page, session, 'next');
    await expect(picture).toHaveAttribute('alt', first);
    await expect(page).toHaveURL(`/gallery/${collection.slug}`);
    await page.getByRole('button', { name: `View picture: ${last}` }).click();
    await expect(picture).toHaveAttribute('alt', last);
    await swipePicture(page, session, 'next');
    await expect(page).toHaveURL(`/gallery/${next.slug}`);
    await expect(picture).toHaveAttribute('alt', next.photos[0]!);
    await swipePicture(page, session, 'previous');
    await expect(page).toHaveURL(`/gallery/${collection.slug}`);
    await expect(picture).toHaveAttribute('alt', last);
    await page.reload();
    await expect(picture).toHaveAttribute('alt', first);
  });
}

test('taps, short drags, vertical scrolling and two-finger gestures keep the selected picture', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const [collection] = await browsableCollections();
  if (!collection) throw new Error('Browsable collection is missing');
  await page.goto(`/gallery/${collection.slug}`);
  const session = await page.context().newCDPSession(page);
  const picture = page.locator(
    '.collection-selected-picture img[aria-hidden="false"]',
  );
  const first = collection.photos[0]!;
  await expect(picture).toHaveAttribute('alt', first);
  for (const [dx, dy, fingers] of [
    [0, 0, 1],
    [-20, 0, 1],
    [-60, -100, 1],
    [-120, 0, 2],
  ]) {
    await gesture(page, session, dx!, dy!, fingers!);
    await expect(picture).toHaveAttribute('alt', first);
  }
  await page.locator('.collection-selected-picture').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await gesture(page, session, 0, -120);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(before);
  await expect(picture).toHaveAttribute('alt', first);
  // Let native scroll inertia stop before starting a new horizontal gesture.
  await page.waitForTimeout(300);
  // A cancelled scroll or multi-touch gesture must not block the next swipe.
  await swipePicture(page, session, 'next');
  await expect(picture).toHaveAttribute('alt', collection.photos[1]!);
});

test('single-picture collections swipe to adjacent collections and the gallery wraps at both ends', async ({
  page,
}) => {
  const collections = await galleryCollections();
  const collection = collections.find(
    (collection) => collection.photos.length === 1,
  );
  if (!collection) throw new Error('Single-picture collection is missing');
  await page.goto(`/gallery/${collection.slug}`);
  const session = await page.context().newCDPSession(page);
  const picture = page.locator(
    '.collection-selected-picture img[aria-hidden="false"]',
  );
  await expect(
    page.getByRole('navigation', { name: 'Picture navigation' }),
  ).toHaveCount(0);
  const index = collections.findIndex((item) => item.slug === collection.slug);
  const next = collections[(index + 1) % collections.length]!;
  await swipePicture(page, session, 'next');
  await expect(page).toHaveURL(`/gallery/${next.slug}`);
  await expect(picture).toHaveAttribute('alt', next.photos[0]!);
  await swipePicture(page, session, 'previous');
  await expect(page).toHaveURL(`/gallery/${collection.slug}`);
  await expect(picture).toHaveAttribute('alt', collection.photos[0]!);
  const first = collections[0]!;
  const last = collections[collections.length - 1]!;
  await page.goto(`/gallery/${first.slug}`);
  await swipePicture(page, session, 'previous');
  await expect(page).toHaveURL(`/gallery/${last.slug}`);
  await expect(picture).toHaveAttribute(
    'alt',
    last.photos[last.photos.length - 1]!,
  );
  await swipePicture(page, session, 'next');
  await expect(page).toHaveURL(`/gallery/${first.slug}`);
  await expect(picture).toHaveAttribute('alt', first.photos[0]!);
});

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`mobile WebKit synthetic touch events drag pictures and enter adjacent collections with ${reducedMotion} motion`, async ({
    baseURL,
  }) => {
    const browser = await webkit.launch();
    const context = await browser.newContext({
      ...devices['iPhone 13'],
      baseURL,
      reducedMotion,
    });
    await routeGalleryFixture(context);
    try {
      const page = await context.newPage();
      const [collection] = await browsableCollections();
      if (!collection) throw new Error('Browsable collection is missing');
      const collections = await galleryCollections();
      const next =
        collections[
          (collections.findIndex((item) => item.slug === collection.slug) + 1) %
            collections.length
        ]!;
      await page.goto(`/gallery/${collection.slug}`);
      await page.waitForLoadState('networkidle');
      const picture = page.locator(
        '.collection-selected-picture img[aria-hidden="false"]',
      );
      const swipe = async (direction: 'left' | 'right') => {
        await page.waitForFunction(
          () => !document.documentElement.matches(':active-view-transition'),
        );
        await picture.scrollIntoViewIfNeeded();
        const movement = await picture.evaluate(async (image, direction) => {
          const bounds = image.getBoundingClientRect();
          const startX =
            bounds.x +
            bounds.width / 2 +
            (direction === 'left' ? bounds.width * 0.3 : -bounds.width * 0.3);
          const startY = bounds.y + bounds.height / 2;
          const dispatch = (type: string, step: number) => {
            const touch = {
              identifier: 0,
              target: image,
              clientX:
                startX +
                ((direction === 'left' ? -1 : 1) * bounds.width * 0.6 * step) /
                  6,
              clientY: startY + step * 2,
            };
            // WebKit exposes Touch but does not allow constructing it.
            const event = new Event(type, { bubbles: true, cancelable: true });
            Object.assign(event, {
              touches: type === 'touchend' ? [] : [touch],
              targetTouches: type === 'touchend' ? [] : [touch],
              changedTouches: [touch],
            });
            image.dispatchEvent(event);
          };
          dispatch('touchstart', 0);
          for (let step = 1; step <= 6; step++) {
            dispatch('touchmove', step);
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          const distance = Math.abs(image.getBoundingClientRect().x - bounds.x);
          dispatch('touchend', 6);
          return distance;
        }, direction);
        expect(movement).toBeGreaterThan(60);
      };
      await expect(picture).toHaveAttribute('alt', collection.photos[0]!);
      await swipe('left');
      await expect(picture).toHaveAttribute('alt', collection.photos[1]!);
      const last = collection.photos.at(-1)!;
      await page.getByRole('button', { name: `View picture: ${last}` }).click();
      await swipe('left');
      await expect(page).toHaveURL(`/gallery/${next.slug}`);
      await expect(picture).toHaveAttribute('alt', next.photos[0]!);
      await swipe('right');
      await expect(page).toHaveURL(`/gallery/${collection.slug}`);
      await expect(picture).toHaveAttribute('alt', last);
    } finally {
      await context.unrouteAll({ behavior: 'ignoreErrors' });
      await context.close();
      await browser.close();
    }
  });
}

test('adjacent collections update within 400ms of release without waiting for a slow CMS request', async ({
  page,
}) => {
  const collections = await galleryCollections();
  const collection = collections.find((item) => item.photos.length === 1);
  if (!collection) throw new Error('Single-picture collection is missing');
  const index = collections.findIndex((item) => item.slug === collection.slug);
  const next = collections[(index + 1) % collections.length]!;
  const previous =
    collections[(index - 1 + collections.length) % collections.length]!;
  await page.goto(`/gallery/${collection.slug}`);
  await page.waitForLoadState('networkidle');
  // Reading the artwork for half a minute must not bring back the network delay.
  await page.clock.install();
  await page.clock.fastForward(31_000);
  // Adjacent collections should already be ready before the visitor releases a swipe.
  await page
    .context()
    .route('https://uag6kepo.api.sanity.io/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fallback();
    });
  const session = await page.context().newCDPSession(page);
  for (const [target, direction] of [
    [next, 'next'],
    [collection, 'previous'],
    [previous, 'previous'],
  ] as const) {
    await page.evaluate((title) => {
      let released = 0;
      document.documentElement.removeAttribute('data-switch-delay');
      document.addEventListener(
        'touchend',
        () => {
          released = performance.now();
        },
        { once: true, capture: true },
      );
      const observer = new MutationObserver(() => {
        if (released && document.querySelector('h1')?.textContent === title) {
          document.documentElement.dataset.switchDelay = String(
            performance.now() - released,
          );
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    }, target.title);
    await swipePicture(page, session, direction);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      target.title,
    );
    await expect(page).toHaveURL(`/gallery/${target.slug}`);
    const delay = await page.locator('html').getAttribute('data-switch-delay');
    expect(delay).not.toBeNull();
    expect(Number(delay)).toBeLessThan(400);
  }
});

for (const motion of ['no-preference', 'reduce', 'unsupported'] as const) {
  test(`swiping pictures and adjacent collections preserves the text, scroll and focus with ${motion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference',
    });
    if (motion === 'unsupported') {
      await page.addInitScript(() =>
        Object.defineProperty(document, 'startViewTransition', {
          value: undefined,
        }),
      );
    }
    const [collection] = await browsableCollections();
    if (!collection) throw new Error('Browsable collection is missing');
    const collections = await galleryCollections();
    const index = collections.findIndex(
      (item) => item.slug === collection.slug,
    );
    const next = collections[(index + 1) % collections.length]!;
    const previous =
      collections[(index - 1 + collections.length) % collections.length]!;
    await page.goto(`/gallery/${collection.slug}`);
    await page.waitForLoadState('networkidle');
    const back = page.getByRole('link', {
      name: 'Back to gallery',
      exact: true,
    });
    await back.evaluate((link) => {
      if (link instanceof HTMLElement) link.focus({ preventScroll: true });
    });
    await page.evaluate(() =>
      window.scrollTo({ top: 60, behavior: 'instant' }),
    );
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(60);
    const session = await page.context().newCDPSession(page);
    const steps = [
      ...collection.photos
        .slice(1)
        .map(() => ({ target: collection, direction: 'next' as const })),
      { target: next, direction: 'next' as const },
      { target: collection, direction: 'previous' as const },
      ...collection.photos
        .slice(1)
        .map(() => ({ target: collection, direction: 'previous' as const })),
      { target: previous, direction: 'previous' as const },
    ];
    for (const { target, direction } of steps) {
      await swipePicture(page, session, direction, { scrollIntoView: false });
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toHaveText(target.title);
      await expect(page).toHaveURL(`/gallery/${target.slug}`);
      await page.waitForFunction(
        () => !document.documentElement.matches(':active-view-transition'),
      );
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      await expect(heading).toBeInViewport();
      await expect(
        page.locator('.collection-introduction > p').last(),
      ).toBeInViewport();
      await expect(back).toBeFocused();
      await expect(
        page.locator('.collection-selected-picture'),
      ).not.toBeFocused();
    }
  });
}

test('the focused detail picture has no focus border while navigation controls keep theirs', async ({
  page,
}) => {
  const [collection] = await browsableCollections();
  if (!collection) throw new Error('Browsable collection is missing');
  await page.goto(`/gallery/${collection.slug}`);
  await page.keyboard.press('Tab');
  const picture = page.locator('.collection-selected-picture');
  await picture.focus();
  await expect(picture).toBeFocused();
  expect(
    await picture.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('none');
  expect(
    await picture.evaluate(
      (element) => getComputedStyle(element).borderTopWidth,
    ),
  ).toBe('0px');
  const next = page.getByRole('button', { name: 'Next picture', exact: true });
  await next.focus();
  await expect(next).toBeFocused();
  expect(
    await next.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid');
  expect(
    await next.evaluate((element) => getComputedStyle(element).outlineWidth),
  ).toBe('3px');
});
