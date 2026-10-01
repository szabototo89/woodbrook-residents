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
  await frame.scrollIntoViewIfNeeded();
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
    await gesture(page, session, -120);
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
    await gesture(page, session, 120);
    await expect(picture).toHaveAttribute('alt', first);
    await gesture(page, session, 120);
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
    await gesture(page, session, -120);
    await expect(picture).toHaveAttribute('alt', first);
    await expect(page).toHaveURL(`/gallery/${collection.slug}`);
    await page.getByRole('button', { name: `View picture: ${last}` }).click();
    await expect(picture).toHaveAttribute('alt', last);
    await gesture(page, session, -120);
    await expect(page).toHaveURL(`/gallery/${next.slug}`);
    await expect(picture).toHaveAttribute('alt', next.photos[0]!);
    await gesture(page, session, 120);
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
  await gesture(page, session, -120);
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
  await gesture(page, session, -120);
  await expect(page).toHaveURL(`/gallery/${next.slug}`);
  await expect(picture).toHaveAttribute('alt', next.photos[0]!);
  await gesture(page, session, 120);
  await expect(page).toHaveURL(`/gallery/${collection.slug}`);
  await expect(picture).toHaveAttribute('alt', collection.photos[0]!);
  const first = collections[0]!;
  const last = collections[collections.length - 1]!;
  await page.goto(`/gallery/${first.slug}`);
  await gesture(page, session, 120);
  await expect(page).toHaveURL(`/gallery/${last.slug}`);
  await expect(picture).toHaveAttribute(
    'alt',
    last.photos[last.photos.length - 1]!,
  );
  await gesture(page, session, -120);
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
