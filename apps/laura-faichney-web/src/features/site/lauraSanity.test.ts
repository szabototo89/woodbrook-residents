import { beforeEach, expect, test, vi } from 'vitest';

import {
  artworkUrl,
  galleryPhotoPath,
  getGalleryPhoto,
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
  preview: [
    {
      title: 'Second preview',
      slug: { current: 'second-preview' },
      image: cmsImage('image-preview2-640x480-webp'),
      imageAlt: 'Second preview',
      featured: true,
      order: 2,
    },
    {
      title: 'First preview',
      slug: { current: 'first-preview' },
      description: 'First description',
      image: cmsImage('image-preview1-640x480-webp'),
      imageAlt: 'First preview',
      featured: true,
      order: 1,
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

test('loads the home page with ordered services and preview items', async () => {
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
  expect(home.galleryPreview.map((item) => item.alt)).toEqual([
    'First preview',
    'Second preview',
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
    preview: [],
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

test('builds gallery detail paths from slugs', () => {
  expect(galleryPhotoPath({ slug: 'pink-flowers' })).toBe(
    '/gallery/pink-flowers',
  );
});

test('finds gallery photos by slug with wrapped neighbours', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();
  const photo = getGalleryPhoto(home.galleryPreview, 'first-preview');

  expect(photo?.item.title).toBe('First preview');
  expect(photo?.item.description).toBe('First description');
  expect(photo?.index).toBe(0);
  expect(photo?.total).toBe(2);
  expect(photo?.previous.slug).toBe('second-preview');
  expect(photo?.next.slug).toBe('second-preview');
});

test('rejects unknown and empty gallery slugs', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();

  expect(getGalleryPhoto(home.galleryPreview, 'missing')).toBeUndefined();
  expect(getGalleryPhoto(home.galleryPreview, '')).toBeUndefined();
  expect(getGalleryPhoto([], 'first-preview')).toBeUndefined();
});

test('serves full-aspect detail artwork without thumbnail crops', async () => {
  mockSanity(homeResult);
  const source = new LauraSanitySource({
    projectId: 'uag6kepo',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });

  const home = await source.loadHome();
  const detailUrl = home.galleryPreview[0]?.detailImage.url ?? '';

  expect(detailUrl).toContain('w=1280');
  expect(detailUrl).not.toContain('h=480');
});
