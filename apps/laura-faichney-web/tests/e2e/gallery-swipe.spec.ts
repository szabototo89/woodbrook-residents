import type { CDPSession, Page } from '@playwright/test';
import { expect, test } from '../fixtures/gallery-test';
import { browsableCollections, galleryCollections } from './galleryCms';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

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
  const frame = page.locator('.collection-selected-picture');
  await frame.scrollIntoViewIfNeeded();
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
    const picture = page.locator('.collection-selected-picture img');
    const first = collection.photos[0]!;
    const last = collection.photos[collection.photos.length - 1]!;
    await expect(picture).toHaveAttribute('alt', first);
    await gesture(page, session, -120);
    await expect(picture).toHaveAttribute('alt', collection.photos[1]!);
    if (reducedMotion === 'no-preference') {
      await expect(page.locator('html')).toHaveAttribute(
        'data-collection-transition',
        'none',
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
  const picture = page.locator('.collection-selected-picture img');
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
  const picture = page.locator('.collection-selected-picture img');
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
