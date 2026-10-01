import { beforeEach, expect, test, vi } from 'vitest';

import {
  artworkUrl,
  galleryCollectionPath,
  getGalleryCollection,
  LauraSanitySource,
  pageHeadFromSeo,
  resolveLauraSanityConfig,
  splitBalancedLines,
  splitTitleLines,
} from './lauraSanity';

const cmsImage = (id: string) => ({
  asset: { _ref: id },
  hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
});

const homeResult = {
  home: {
    hero: {
      eyebrow: 'Kicker',
      title: 'Bold Art\nBrighter Spaces',
      description: 'Hero description',
      image: cmsImage('image-hero-1374x1145-png'),
      imageAlt: 'Hero alt',
      ctaLabel: 'View My Work',
    },
    servicesHeading: 'Services heading',
    muralEyebrow: 'Mural tag',
    muralHeading: 'Mural heading',
    muralCopy: 'Mural copy',
    muralCtaLabel: 'Enquire',
    muralImage: cmsImage('image-mural-1254x1254-png'),
    muralImageAlt: 'Mural alt',
    galleryHeading: 'Gallery heading',
    aboutImage: cmsImage('image-about-1448x1086-webp'),
    aboutImageAlt: 'About alt',
    aboutHeading: 'About heading',
    aboutCopy: 'About copy',
    testimonialQuote: 'Lovely work!',
    testimonialAuthor: 'Ann',
    testimonialRole: 'Owner',
    seo: { title: 'Home SEO', description: 'Home description' },
  },
  settings: {
    contactEmail: 'laura@example.com',
    contactPhone: '123',
    contactMailtoSubject: 'Subject',
    contactEyebrow: 'Strip tag',
    contactHeading: 'Strip heading',
    contactCopy: 'Strip copy',
  },
  services: [
    {
      title: 'Second',
      slug: { current: 'second' },
      description: 'Second service',
      image: cmsImage('image-service2-1448x1086-webp'),
      imageAlt: 'Second alt',
      order: 2,
    },
    {
      title: 'First',
      slug: { current: 'first' },
      description: 'First service',
      image: cmsImage('image-service1-1448x1086-webp'),
      imageAlt: 'First alt',
      order: 1,
    },
  ],
  collections: [
    {
      title: 'Second collection',
      slug: { current: 'second-collection' },
      description: 'Second description',
      order: 2,
      photos: [
        {
          image: cmsImage('image-photo2-640x480-webp'),
          imageAlt: 'Second photo',
          order: 0,
        },
      ],
    },
    {
      title: 'First collection',
      slug: { current: 'first-collection' },
      description: 'First description',
      order: 1,
      photos: [
        {
          image: cmsImage('image-photo1-640x480-webp'),
          imageAlt: 'First photo',
          order: 0,
        },
      ],
    },
  ],
};

function mockSanity(result: unknown) {
  const calls: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: unknown) => {
      calls.push(String(url));
      return {
        ok: true,
        json: async () => ({ result }),
      };
    }),
  );
  return calls;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

test('resolves the Laura project and dataset by default', () => {
  expect(resolveLauraSanityConfig({})).toMatchObject({
    projectId: 'uag6kepo',
    dataset: 'production',
  });
});

test('prefers explicit env over defaults', () => {
  const config = resolveLauraSanityConfig({
    VITE_SANITY_PROJECT_ID: 'abc123',
    VITE_SANITY_DATASET: 'staging',
    VITE_SANITY_API_VERSION: '2025-01-01',
  });

  expect(config).toMatchObject({
    projectId: 'abc123',
    dataset: 'staging',
    apiVersion: '2025-01-01',
  });
});

test('loads the home page with ordered services and collections', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();

  expect(home.hero.titleLines).toEqual(['Bold Art', 'Brighter Spaces']);
  expect(home.services.map((service) => service.slug)).toEqual([
    'first',
    'second',
  ]);
  expect(home.collections.map((collection) => collection.slug)).toEqual([
    'first-collection',
    'second-collection',
  ]);
  expect(home.collections[0]?.photos.map((photo) => photo.alt)).toEqual([
    'First photo',
  ]);
  expect(home.settings.email).toBe('laura@example.com');
  expect(home.testimonial.author).toBe('Ann');
});

test('queries the Sanity API for the Laura project', async () => {
  const calls = mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  await source.loadHome();

  expect(calls).toHaveLength(1);
  expect(calls[0]).toContain(
    'https://uag6kepo.api.sanity.io/v2025-09-01/data/query/production',
  );
  expect(decodeURIComponent(calls[0] ?? '')).toContain('_id == "homePage"');
});

test('fails the build with a named message when home content is missing', async () => {
  mockSanity({
    home: null,
    settings: homeResult.settings,
    services: [],
    collections: [],
  });
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  await expect(source.loadHome()).rejects.toThrow(/Sanity homePage/);
});

test('fails the build when a service is missing its slug', async () => {
  mockSanity({
    ...homeResult,
    services: [
      {
        title: 'Broken',
        description: 'No slug',
        image: cmsImage('image-broken-1448x1086-webp'),
        imageAlt: 'Broken alt',
        order: 0,
      },
    ],
  });
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  await expect(source.loadHome()).rejects.toThrow(/service/);
});

test('fails the build when Sanity answers with an error status', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: false, status: 500 })),
  );
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  await expect(source.loadHome()).rejects.toThrow(/status 500/);
});

test('builds CDN artwork URLs with the requested width', () => {
  const url = artworkUrl(
    {
      projectId: 'uag6kepo',
      dataset: 'production',
      apiVersion: '2025-09-01',
    },
    {
      asset: {
        _ref: 'image-abc123-1374x1145-png',
      },
      hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
    },
    1374,
  );

  expect(url).toContain('https://cdn.sanity.io/images/uag6kepo/production/');
  expect(url).toContain('w=1374');
});

test('returns undefined for artwork without an asset reference', () => {
  expect(
    artworkUrl(
      {
        projectId: 'uag6kepo',
        dataset: 'production',
        apiVersion: '2025-09-01',
      },
      null,
      100,
    ),
  ).toBeUndefined();
});

test('splits multi-line titles on newlines', () => {
  expect(splitTitleLines('Bold Art\nBrighter Spaces')).toEqual([
    'Bold Art',
    'Brighter Spaces',
  ]);
  expect(splitTitleLines('Single line')).toEqual(['Single line']);
});

test('balances value headings across two lines like the current design', () => {
  expect(splitBalancedLines('Brighter Spaces')).toEqual(['Brighter', 'Spaces']);
  expect(splitBalancedLines('Creative & Bespoke')).toEqual([
    'Creative &',
    'Bespoke',
  ]);
  expect(splitBalancedLines('All Ages Welcome')).toEqual([
    'All Ages',
    'Welcome',
  ]);
  expect(splitBalancedLines('Local & Community Focused')).toEqual([
    'Local &',
    'Community Focused',
  ]);
  expect(splitBalancedLines('Solo')).toEqual(['Solo']);
});

test('uses CMS SEO with code fallbacks for head metadata', () => {
  const head = pageHeadFromSeo({
    seo: { title: 'Custom title', description: 'Custom description' },
    fallbackTitle: 'Fallback title',
    fallbackDescription: 'Fallback description',
    path: '/about',
  });

  expect(JSON.stringify(head)).toContain('Custom title');
  expect(JSON.stringify(head)).toContain('Custom description');

  const fallbackHead = pageHeadFromSeo({
    seo: {},
    fallbackTitle: 'Fallback title',
    fallbackDescription: 'Fallback description',
    path: '/about',
  });

  expect(JSON.stringify(fallbackHead)).toContain('Fallback title');
  expect(JSON.stringify(fallbackHead)).toContain('Fallback description');
});

test('builds gallery collection paths from slugs', () => {
  expect(galleryCollectionPath({ slug: 'colour-and-nature' })).toBe(
    '/gallery/colour-and-nature',
  );
});

test('finds gallery collections by slug in display order', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();
  const collection = getGalleryCollection(
    home.collections,
    'second-collection',
  );

  expect(collection?.title).toBe('Second collection');
  expect(collection?.description).toBe('Second description');
  expect(collection?.photos.map((photo) => photo.alt)).toEqual([
    'Second photo',
  ]);
});

test('rejects unknown and empty collection slugs', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();

  expect(getGalleryCollection(home.collections, 'missing')).toBeUndefined();
  expect(getGalleryCollection(home.collections, '')).toBeUndefined();
  expect(getGalleryCollection([], 'first-collection')).toBeUndefined();
});

test('serves full-aspect viewer artwork without thumbnail crops', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();
  const fullUrl = home.collections[0]?.photos[0]?.fullImage.url ?? '';

  expect(fullUrl).toContain('w=1280');
  expect(fullUrl).not.toContain('h=480');
});
