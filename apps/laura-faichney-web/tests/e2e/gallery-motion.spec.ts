import { expect, test, routeGalleryFixture } from '../fixtures/gallery-test';

const SANITY_QUERY_URL =
  'https://uag6kepo.api.sanity.io/v2025-09-01/data/query/production';
const SANITY_CDN_HOST = 'https://cdn.sanity.io/images/uag6kepo/production/';

type CmsMotionCollection = {
  title: string;
  slug: string;
  photos: string[];
};

type CmsMotionGallery = {
  first: CmsMotionCollection;
  second: CmsMotionCollection;
};

let cmsMotionGallery: CmsMotionGallery | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function requiredRecord(
  value: unknown,
  label: string,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`Sanity CMS snapshot is missing ${label}.`);
  }
  return value;
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = record[key];
  if (typeof value !== 'string' || !value) {
    throw new Error(`Sanity CMS snapshot is missing ${label}.`);
  }
  return value;
}

function readCollection(value: unknown, label: string): CmsMotionCollection {
  const record = requiredRecord(value, label);
  const slugRecord = requiredRecord(record.slug, 'a collection slug');
  const photos: unknown = record.photos;
  if (!Array.isArray(photos) || photos.length < 2) {
    throw new Error(`Sanity CMS snapshot is missing ${label} photos.`);
  }
  return {
    title: requiredString(record, 'title', 'a collection title'),
    slug: requiredString(slugRecord, 'current', 'a collection slug'),
    photos: photos.map((photo) =>
      requiredString(
        requiredRecord(photo, 'a photo'),
        'alt',
        'a photo alt text',
      ),
    ),
  };
}

async function motionGallery(): Promise<CmsMotionGallery> {
  if (!cmsMotionGallery) {
    const query = `*[_type == "galleryCollection"] | order(order asc)[0...2]{title, slug, "photos": photos[]->{ "alt": imageAlt }}`;
    const response = await fetch(
      `${SANITY_QUERY_URL}?query=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
      throw new Error(
        `Sanity CMS snapshot failed with status ${response.status}.`,
      );
    }
    const body: unknown = await response.json();
    const collections: unknown = requiredRecord(
      body,
      'a result envelope',
    ).result;
    if (!Array.isArray(collections) || collections.length < 2) {
      throw new Error('Sanity CMS snapshot is missing two collections.');
    }
    cmsMotionGallery = {
      first: readCollection(collections[0], 'the first collection'),
      second: readCollection(collections[1], 'the second collection'),
    };
  }
  return cmsMotionGallery;
}

test('a live reduced-motion change stops shared-image travel immediately', async ({
  page,
}) => {
  const { first } = await motionGallery();
  const secondPhotoAlt = first.photos[1];
  if (!secondPhotoAlt) throw new Error('Collection photos are missing');
  await page.goto(`/gallery/${first.slug}`);
  await page.waitForLoadState('networkidle');
  await page.addStyleTag({
    content:
      '::view-transition-group(selected-artwork) { animation-duration: 3s; }',
  });
  await page
    .getByRole('button', {
      name: `View picture: ${secondPhotoAlt}`,
    })
    .click();
  const selected = page.locator('.collection-selected-picture img');
  await expect(selected).toHaveAttribute('alt', secondPhotoAlt);
  expect(await selected.getAttribute('src')).toContain(SANITY_CDN_HOST);
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
      name: `View picture: ${secondPhotoAlt}`,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('collection and picture selections carry exactly one image into its larger view', async ({
  page,
}) => {
  const { first } = await motionGallery();
  const secondPhotoAlt = first.photos[1];
  if (!secondPhotoAlt) throw new Error('Collection photos are missing');
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
    .getByRole('link', { name: `View collection: ${first.title}` })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`/gallery/${first.slug}`);
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  const source = await page
    .locator('html')
    .getAttribute('data-transition-source');
  expect(source).toContain(SANITY_CDN_HOST);
  const sourceAsset = source?.split('?')[0];
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  const destination = await page
    .locator('html')
    .getAttribute('data-transition-destination');
  expect(destination).toContain(SANITY_CDN_HOST);
  expect(destination?.split('?')[0]).toBe(sourceAsset);
  const artwork = page.locator('.collection-selected-picture');
  await expect(artwork).toBeFocused();
  await expect(artwork).toBeInViewport();
  const thumbnail = page.getByRole('button', {
    name: `View picture: ${secondPhotoAlt}`,
  });
  await thumbnail.focus();
  await page.keyboard.press('Enter');
  await expect(thumbnail).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  const travelled = await page
    .locator('html')
    .getAttribute('data-transition-source');
  expect(travelled).toContain(SANITY_CDN_HOST);
  const travelledTo = await page
    .locator('html')
    .getAttribute('data-transition-destination');
  expect(travelledTo).toContain(SANITY_CDN_HOST);
  expect(travelledTo?.split('?')[0]).toBe(travelled?.split('?')[0]);
  await expect(
    artwork.getByRole('img', { name: secondPhotoAlt }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  await page.getByRole('button', { name: 'Next picture', exact: true }).click();
  const wrappedPhotoAlt = first.photos[0];
  if (!wrappedPhotoAlt) throw new Error('Collection photos are missing');
  await expect(
    artwork.getByRole('img', { name: wrappedPhotoAlt }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute(
    'data-transition-ready',
    'true',
  );
  await expect(
    page.getByRole('button', { name: 'Next picture', exact: true }),
  ).toBeFocused();
  await expect(page).toHaveURL(`/gallery/${first.slug}`);
});

for (const fallback of ['unsupported', 'reduced'] as const) {
  test(`collection links and picture selection work with ${fallback} transitions`, async ({
    page,
  }) => {
    const { first } = await motionGallery();
    const secondPhotoAlt = first.photos[1];
    if (!secondPhotoAlt) throw new Error('Collection photos are missing');
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
      .getByRole('link', { name: `View collection: ${first.title}` })
      .click();
    await expect(page).toHaveURL(`/gallery/${first.slug}`);
    await page.waitForLoadState('networkidle');
    await page
      .getByRole('button', {
        name: `View picture: ${secondPhotoAlt}`,
      })
      .click();
    const selected = page
      .locator('.collection-selected-picture')
      .getByRole('img');
    await expect(selected).toHaveAttribute('alt', secondPhotoAlt);
    expect(await selected.getAttribute('src')).toContain(SANITY_CDN_HOST);
    await expect(
      page.getByRole('button', {
        name: `View picture: ${secondPhotoAlt}`,
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
  const { second } = await motionGallery();
  const deskPhotoAlt = second.photos[second.photos.length - 1];
  if (!deskPhotoAlt) throw new Error('Collection photos are missing');
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await routeGalleryFixture(context);
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
    .getByRole('link', { name: `View collection: ${second.title}` })
    .tap();
  await expect(page).toHaveURL(`/gallery/${second.slug}`);
  await page
    .getByRole('button', {
      name: `View picture: ${deskPhotoAlt}`,
    })
    .tap();
  await expect(
    page.locator('.collection-selected-picture').getByRole('img'),
  ).toHaveAttribute('alt', deskPhotoAlt);
  await expect(page.locator('.collection-selected-picture')).toBeInViewport();
  await context.close();
});

test('without JavaScript, services, artwork and collection links remain readable', async ({
  browser,
}) => {
  const { first } = await motionGallery();
  const context = await browser.newContext({ javaScriptEnabled: false });
  await routeGalleryFixture(context);
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
    .getByRole('link', { name: `View collection: ${first.title}` })
    .click();
  await expect(page).toHaveURL(`/gallery/${first.slug}`);
  await expect(
    page.locator('.collection-selected-picture').getByRole('img'),
  ).toBeVisible();
  await context.close();
});
