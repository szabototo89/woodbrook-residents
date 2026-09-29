import { afterEach, expect, test, vi } from 'vitest';

import { SanityContentSource } from './sanityContentSource';

afterEach(() => vi.unstubAllGlobals());

function sanityResponse(result: unknown) {
  return new Response(JSON.stringify({ result }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('SanityContentSource loads every canonical collection into one snapshot', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes('/data/query/')) {
      if (url.includes('%22siteSetting%22') || url.includes('siteSetting')) {
        const decoded = decodeURIComponent(url);
        if (decoded.includes('siteSetting') && !decoded.includes('update')) {
          return sanityResponse(null);
        }
      }
      return sanityResponse([]);
    }
    return sanityResponse([]);
  });
  vi.stubGlobal('fetch', fetchMock);

  const snapshot = await new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
  }).loadSnapshot();

  expect(snapshot).toEqual({
    siteSetting: undefined,
    updates: [],
    projects: [],
    events: [],
    surveys: [],
    resources: [],
  });
  expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(6);
  const urls = fetchMock.mock.calls.map(([input]) => String(input));
  expect(urls.some((url) => url.includes('ca34quae'))).toBe(true);
  expect(urls.some((url) => url.includes('/production'))).toBe(true);
});

test('SanityContentSource normalizes slugs, images, and project relations', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = decodeURIComponent(String(input));
    if (url.includes('_type == "siteSetting"')) {
      return sanityResponse({
        name: 'Woodbrook',
        location: 'Shankill, Dublin',
        tagline: 'Resident hub',
        introduction: 'Welcome',
      });
    }
    if (url.includes('_type == "update"')) {
      return sanityResponse([
        {
          _id: 'update-1',
          title: 'Path works',
          slug: { current: 'path-works' },
          kind: 'transport',
          summary: 'Summary',
          body: 'Body',
          publishedOn: '2026-09-10',
          sourceName: 'Council',
          sourceUrl: 'https://example.com/path',
          sourceReviewedOn: '2026-09-10',
          featured: true,
        },
      ]);
    }
    if (url.includes('_type == "project"')) {
      return sanityResponse([
        {
          _id: 'project-1',
          title: 'Greenway',
          slug: { current: 'greenway' },
          category: 'transport',
          stage: 'active',
          summary: 'Summary',
          details: 'Details',
          updatedOn: '2026-09-09',
          sourceName: 'Council',
          sourceUrl: 'https://example.com/greenway',
          sourceReviewedOn: '2026-09-09',
          featured: false,
        },
      ]);
    }
    if (url.includes('_type == "survey"')) {
      return sanityResponse([
        {
          _id: 'survey-1',
          title: 'Have your say',
          slug: { current: 'have-your-say' },
          stage: 'open',
          summary: 'Summary',
          sourceName: 'Council',
          sourceUrl: 'https://example.com/survey',
          sourceReviewedOn: '2026-09-09',
          relatedProject: { _ref: 'project-1' },
        },
      ]);
    }
    if (url.includes('_type == "resource"')) {
      return sanityResponse([
        {
          _id: 'resource-1',
          title: 'Clinic',
          slug: { current: 'clinic' },
          category: 'health',
          serviceType: 'GP',
          providerType: 'public-service',
          description: 'Local clinic',
          displayOrder: 1,
          sourceName: 'HSE',
          sourceUrl: 'https://example.com/clinic',
          sourceReviewedOn: '2026-09-09',
          details: [],
          collectionDates: [],
        },
      ]);
    }
    return sanityResponse([]);
  });
  vi.stubGlobal('fetch', fetchMock);

  const source = new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
  });
  expect(source.name).toBe('sanity');

  const snapshot = await source.loadSnapshot();

  expect(snapshot.siteSetting?.name).toBe('Woodbrook');
  expect(snapshot.updates[0]?.slug).toBe('path-works');
  expect(snapshot.updates[0]?.documentId).toBe('update-1');
  expect(snapshot.surveys[0]?.relatedProjectId).toBe('project-1');
  expect(snapshot.resources[0]?.displayOrder).toBe(1);
});

test('SanityContentSource identifies the failed Sanity query', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status: 401 })),
  );

  await expect(
    new SanityContentSource({
      projectId: 'ca34quae',
      dataset: 'production',
      apiVersion: '2025-09-01',
    }).loadSnapshot(),
  ).rejects.toThrow(/Sanity request.*failed/);
});

test('SanityContentSource builds image URLs, strips drafts, and maps full fields', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = decodeURIComponent(String(input));
    if (url.includes('_type == "siteSetting"')) {
      return sanityResponse({
        name: 'Woodbrook',
        location: 'Shankill',
        tagline: 'Hub',
        introduction: 'Intro',
        contactEmail: 'hello@example.com',
      });
    }
    if (url.includes('_type == "update"')) {
      return sanityResponse([
        {
          _id: 'drafts.update-9',
          title: 'Update with image',
          slug: 'plain-slug',
          kind: 'news',
          summary: 'Summary',
          body: 'Body',
          publishedOn: '2026-09-10',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/update',
          sourceReviewedOn: '2026-09-10',
          image: {
            asset: {
              _ref: 'image-abc123-800x600-jpg',
            },
            alt: 'Alt text',
            credit: 'Photographer',
            creditUrl: 'https://example.com/photo',
          },
          featured: true,
        },
      ]);
    }
    if (url.includes('_type == "project"')) {
      return sanityResponse([
        {
          _id: 'project-9',
          title: 'Project with image',
          slug: { current: 'project-image' },
          category: 'parks',
          stage: 'proposed',
          summary: 'Summary',
          details: 'Details',
          updatedOn: '2026-09-09',
          nextStep: 'Next milestone',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/project',
          sourceReviewedOn: '2026-09-09',
          image: {
            asset: { _ref: 'image-def456-1200x800-jpg' },
            alt: 'Project alt',
          },
          featured: false,
        },
      ]);
    }
    if (url.includes('_type == "event"')) {
      return sanityResponse([
        {
          _id: 'event-9',
          title: 'Full event',
          slug: { current: 'full-event' },
          summary: 'Summary',
          startsAt: '2026-10-01T10:00:00Z',
          endsAt: '2026-10-01T12:00:00Z',
          location: 'Community hall',
          bookingUrl: 'https://example.com/book',
          sourceUrl: 'https://example.com/event',
          sourceReviewedOn: '2026-09-09',
          featured: true,
        },
      ]);
    }
    if (url.includes('_type == "survey"')) {
      return sanityResponse([
        {
          _id: 'survey-9',
          title: 'Full survey',
          slug: 'survey-string-slug',
          stage: 'open',
          summary: 'Summary',
          opensOn: '2026-09-01',
          closesOn: '2026-10-01',
          responseUrl: 'https://example.com/respond',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/survey',
          sourceReviewedOn: '2026-09-09',
          relatedProject: 'project-9',
        },
      ]);
    }
    if (url.includes('_type == "resource"')) {
      return sanityResponse([
        {
          _id: 'resource-9',
          title: 'Full resource',
          slug: { current: 'full-resource' },
          category: 'waste',
          serviceType: 'Collection',
          providerType: 'public-service',
          description: 'Description',
          url: 'https://example.com/provider',
          phone: '01 1234567',
          email: 'info@example.com',
          outOfHours: true,
          featured: true,
          details: [
            { label: 'Address', value: 'Main Street', showOnCard: true },
            { label: 'Hours', value: '9-5' },
          ],
          collectionDates: [
            { date: '2026-10-06', stream: 'recycling' },
            { date: '2026-10-13', stream: 'waste-compost' },
          ],
          documentUrl: 'https://example.com/schedule.pdf',
          documentLabel: 'Schedule PDF',
          displayOrder: 5,
          sourceName: 'Council',
          sourceUrl: 'https://example.com/resource',
          sourceReviewedOn: '2026-09-09',
        },
      ]);
    }
    return sanityResponse([]);
  });
  vi.stubGlobal('fetch', fetchMock);

  const snapshot = await new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
  }).loadSnapshot();

  expect(snapshot.siteSetting?.contactEmail).toBe('hello@example.com');
  expect(snapshot.updates[0]?.documentId).toBe('update-9');
  expect(snapshot.updates[0]?.slug).toBe('plain-slug');
  expect(snapshot.updates[0]?.imagePath).toContain(
    'https://cdn.sanity.io/images/ca34quae/production/',
  );
  expect(snapshot.updates[0]?.imageAlt).toBe('Alt text');
  expect(snapshot.updates[0]?.imageCredit).toBe('Photographer');
  expect(snapshot.updates[0]?.imageCreditUrl).toBe('https://example.com/photo');
  expect(snapshot.projects[0]?.nextStep).toBe('Next milestone');
  expect(snapshot.projects[0]?.imageAlt).toBe('Project alt');
  expect(snapshot.events[0]?.endsAt).toBe('2026-10-01T12:00:00Z');
  expect(snapshot.events[0]?.bookingUrl).toBe('https://example.com/book');
  expect(snapshot.surveys[0]?.slug).toBe('survey-string-slug');
  expect(snapshot.surveys[0]?.opensOn).toBe('2026-09-01');
  expect(snapshot.surveys[0]?.relatedProjectId).toBe('project-9');
  expect(snapshot.resources[0]?.details).toHaveLength(2);
  expect(snapshot.resources[0]?.details[0]).toMatchObject({
    id: 0,
    label: 'Address',
    showOnCard: true,
  });
  expect(snapshot.resources[0]?.collectionDates).toHaveLength(2);
  expect(snapshot.resources[0]?.documentUrl).toBe(
    'https://example.com/schedule.pdf',
  );
  expect(snapshot.resources[0]?.outOfHours).toBe(true);
});

test('SanityContentSource sends the API token and supports the CDN host', async () => {
  const seen: Array<{ url: string; auth?: string }> = [];
  const fetchMock = vi.fn(
    async (input: string | URL | Request, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      seen.push({
        url: String(input),
        auth: headers.get('Authorization') ?? undefined,
      });
      const url = decodeURIComponent(String(input));
      if (url.includes('_type == "siteSetting"')) {
        return sanityResponse(null);
      }
      return sanityResponse([]);
    },
  );
  vi.stubGlobal('fetch', fetchMock);

  await new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
    token: 'secret-token',
    useCdn: true,
  }).loadSnapshot();

  expect(seen.length).toBeGreaterThanOrEqual(6);
  expect(seen.every((entry) => entry.auth === 'Bearer secret-token')).toBe(
    true,
  );
  expect(seen.every((entry) => entry.url.includes('apicdn.sanity.io'))).toBe(
    true,
  );
});

test('SanityContentSource wraps network failures with the query label', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('network down');
    }),
  );

  await expect(
    new SanityContentSource({
      projectId: 'ca34quae',
      dataset: 'production',
      apiVersion: '2025-09-01',
    }).loadSnapshot(),
  ).rejects.toThrow(/Sanity request to .* failed: network down/);
});

test('SanityContentSource ignores imageless and unrelated records without crashing', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = decodeURIComponent(String(input));
    if (url.includes('_type == "siteSetting"')) {
      return sanityResponse(null);
    }
    if (url.includes('_type == "update"')) {
      return sanityResponse([
        {
          _id: 'update-no-image',
          title: 'No image',
          slug: {},
          kind: 'news',
          summary: 'Summary',
          body: 'Body',
          publishedOn: '2026-09-10',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/update',
          sourceReviewedOn: '2026-09-10',
          image: { alt: 'Alt without asset' },
        },
      ]);
    }
    if (url.includes('_type == "survey"')) {
      return sanityResponse([
        {
          _id: 'survey-no-relation',
          title: 'No relation',
          slug: { current: 'no-relation' },
          stage: 'closed',
          summary: 'Summary',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/survey',
          sourceReviewedOn: '2026-09-09',
          relatedProject: { _id: 'project-expanded' },
        },
      ]);
    }
    if (url.includes('_type == "resource"')) {
      return sanityResponse('not-a-list');
    }
    return sanityResponse([]);
  });
  vi.stubGlobal('fetch', fetchMock);

  const snapshot = await new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
  }).loadSnapshot();

  expect(snapshot.updates[0]?.slug).toBe('');
  expect(snapshot.updates[0]?.imagePath).toBeUndefined();
  expect(snapshot.updates[0]?.imageAlt).toBe('Alt without asset');
  expect(snapshot.surveys[0]?.relatedProjectId).toBe('project-expanded');
  expect(snapshot.resources).toEqual([]);
});

test('SanityContentSource covers slug, image, and relation edge cases', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = decodeURIComponent(String(input));
    if (url.includes('_type == "siteSetting"')) {
      return sanityResponse({
        name: 123,
        location: null,
        tagline: 'Hub',
        introduction: 'Intro',
      });
    }
    if (url.includes('_type == "update"')) {
      return sanityResponse([
        {
          _id: 'edge-update',
          title: 'Edge',
          slug: null,
          kind: 'news',
          summary: 'Summary',
          body: 'Body',
          publishedOn: '2026-09-10',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/edge',
          sourceReviewedOn: '2026-09-10',
          image: { asset: { _ref: 'not-a-valid-ref' } },
        },
        {
          _id: 'edge-update-2',
          title: 'Edge 2',
          slug: 42,
          kind: 'news',
          summary: 'Summary',
          body: 'Body',
          publishedOn: '2026-09-10',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/edge2',
          sourceReviewedOn: '2026-09-10',
          image: 'not-an-object',
        },
      ]);
    }
    if (url.includes('_type == "survey"')) {
      return sanityResponse([
        {
          _id: 'edge-survey-1',
          title: 'No relation key',
          slug: { current: 'no-relation-key' },
          stage: 'closed',
          summary: 'Summary',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/s1',
          sourceReviewedOn: '2026-09-09',
        },
        {
          _id: 'edge-survey-2',
          title: 'Null relation',
          slug: { current: 'null-relation' },
          stage: 'closed',
          summary: 'Summary',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/s2',
          sourceReviewedOn: '2026-09-09',
          relatedProject: null,
        },
        {
          _id: 'edge-survey-3',
          title: 'Empty relation',
          slug: { current: 'empty-relation' },
          stage: 'closed',
          summary: 'Summary',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/s3',
          sourceReviewedOn: '2026-09-09',
          relatedProject: {},
        },
      ]);
    }
    return sanityResponse([]);
  });
  vi.stubGlobal('fetch', fetchMock);

  const snapshot = await new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
  }).loadSnapshot();

  expect(snapshot.siteSetting?.name).toBe('');
  expect(snapshot.updates).toHaveLength(2);
  expect(snapshot.updates[0]?.slug).toBe('');
  expect(snapshot.updates[1]?.slug).toBe('');
  expect(snapshot.surveys).toHaveLength(3);
  expect(snapshot.surveys[0]?.relatedProjectId).toBeUndefined();
  expect(snapshot.surveys[1]?.relatedProjectId).toBeUndefined();
  expect(snapshot.surveys[2]?.relatedProjectId).toBeUndefined();
});

test('SanityContentSource covers empty, wrong-type, and non-error rejections', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = decodeURIComponent(String(input));
    if (url.includes('_type == "siteSetting"')) {
      return sanityResponse({
        name: 'Woodbrook',
        location: 'Shankill',
        tagline: 42,
        introduction: null,
        contactEmail: 42,
      });
    }
    if (url.includes('_type == "update"')) {
      return sanityResponse([
        {
          title: 'Empty optionals',
          slug: { current: '' },
          kind: 'news',
          summary: 'Summary',
          body: 'Body',
          publishedOn: '2026-09-10',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/e',
          sourceReviewedOn: '2026-09-10',
          image: null,
          featured: 'yes',
        },
      ]);
    }
    if (url.includes('_type == "project"')) {
      return sanityResponse([
        {
          _id: 'p-empty',
          title: 'P',
          slug: { current: 'p' },
          category: 'parks',
          stage: 'proposed',
          summary: 'S',
          details: 'D',
          updatedOn: '2026-09-09',
          nextStep: '',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/p',
          sourceReviewedOn: '2026-09-09',
        },
      ]);
    }
    if (url.includes('_type == "event"')) {
      return sanityResponse([
        {
          _id: 'e-empty',
          title: 'E',
          slug: { current: 'e' },
          summary: 'S',
          startsAt: '2026-10-01T10:00:00Z',
          endsAt: '',
          location: 'Hall',
          bookingUrl: '',
          sourceUrl: 'https://example.com/ev',
          sourceReviewedOn: '2026-09-09',
        },
      ]);
    }
    if (url.includes('_type == "survey"')) {
      return sanityResponse([
        {
          _id: 's-empty',
          title: 'S',
          slug: { current: 's' },
          stage: 'closed',
          summary: 'Sum',
          opensOn: '',
          closesOn: '',
          responseUrl: '',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/sv',
          sourceReviewedOn: '2026-09-09',
        },
      ]);
    }
    if (url.includes('_type == "resource"')) {
      return sanityResponse([
        {
          _id: 'r-empty',
          title: 'R',
          slug: { current: 'r' },
          category: 'health',
          serviceType: 'GP',
          providerType: 'public-service',
          description: 'Desc',
          url: '',
          phone: '',
          email: '',
          displayOrder: 'first',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/r',
          sourceReviewedOn: '2026-09-09',
          details: 'not-a-list',
          collectionDates: null,
        },
      ]);
    }
    return sanityResponse([]);
  });
  vi.stubGlobal('fetch', fetchMock);

  const snapshot = await new SanityContentSource({
    projectId: 'ca34quae',
    dataset: 'production',
    apiVersion: '2025-09-01',
  }).loadSnapshot();

  expect(snapshot.siteSetting?.tagline).toBe('');
  expect(snapshot.siteSetting?.contactEmail).toBeUndefined();
  expect(snapshot.updates[0]?.documentId).toBe('missing-id');
  expect(snapshot.updates[0]?.featured).toBe(false);
  expect(snapshot.projects[0]?.nextStep).toBeUndefined();
  expect(snapshot.events[0]?.endsAt).toBeUndefined();
  expect(snapshot.surveys[0]?.opensOn).toBeUndefined();
  expect(snapshot.resources[0]?.displayOrder).toBe(100);
  expect(snapshot.resources[0]?.details).toEqual([]);
  expect(snapshot.resources[0]?.collectionDates).toEqual([]);

  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw 'plain string failure';
    }),
  );
  await expect(
    new SanityContentSource({
      projectId: 'ca34quae',
      dataset: 'production',
      apiVersion: '2025-09-01',
    }).loadSnapshot(),
  ).rejects.toThrow(/Sanity request to .* failed: plain string failure/);
});
