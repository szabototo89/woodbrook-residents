import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import worker from './worker';

// Controlled sample records. These describe no real local event or service.
const provenance = {
  sourceName: 'Test fixture',
  sourceUrl: 'https://example.test/source',
  sourceReviewedOn: '2026-10-29',
};
const record = {
  _id: 'sample',
  title: 'Sample content',
  slug: { current: 'sample' },
  summary: 'Sample summary',
  ...provenance,
};
const results = {
  siteSetting: {
    name: 'Sample hub',
    location: 'Sample location',
    tagline: 'Sample',
    introduction: 'Sample introduction',
    admin_notes: 'private-editor-note',
  },
  update: [
    {
      ...record,
      kind: 'news',
      body: 'Sample article',
      publishedOn: '2026-10-28',
      admin_notes: 'private-editor-note',
    },
  ],
  project: [
    {
      ...record,
      category: 'community',
      stage: 'active',
      details: 'Sample details',
      updatedOn: '2026-10-28',
    },
  ],
  event: [
    { ...record, startsAt: '2026-11-01T10:00:00Z', location: 'Sample hall' },
  ],
  survey: [{ ...record, stage: 'open', relatedProject: { _ref: 'sample' } }],
  resource: [
    {
      ...record,
      category: 'health',
      serviceType: 'Sample service',
      providerType: 'public-service',
      description: 'Sample resource',
      displayOrder: 1,
    },
  ],
};
const fetchAsset = vi.fn(async () => new Response('static asset'));
const environment = { ASSETS: { fetch: fetchAsset } };
const endpoint = 'https://example.test/api/mobile-content';

function stubSanity() {
  const fetchMock = vi.fn(
    async (input: string | URL | Request, _init?: RequestInit) => {
      void _init;
      const url = new URL(String(input));
      const type = url.searchParams
        .get('query')
        ?.match(/_type == "([^"]+)"/)?.[1];
      return Response.json({
        result:
          type && type in results ? Reflect.get(results, type) : undefined,
      });
    },
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test.each([undefined, '', '   ', 'sanity'])(
  'Worker serves a meaningful canonical Sanity snapshot for source %j',
  async (CONTENT_SOURCE) => {
    const upstream = stubSanity();
    const response = await worker.fetch(new Request(endpoint), {
      ...environment,
      CONTENT_SOURCE,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=60, stale-while-revalidate=300',
    );
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    const body = await response.json();
    expect(body).toMatchObject({
      siteSetting: { name: 'Sample hub' },
      updates: [
        { documentId: 'sample', slug: 'sample', body: 'Sample article' },
      ],
      projects: [{ stage: 'active', details: 'Sample details' }],
      events: [{ location: 'Sample hall' }],
      surveys: [{ relatedProjectId: 'sample' }],
      resources: [{ description: 'Sample resource' }],
    });
    expect(JSON.stringify(body)).not.toContain('private-editor-note');
    expect(Object.keys(body)).toEqual([
      'siteSetting',
      'updates',
      'projects',
      'events',
      'surveys',
      'resources',
    ]);
    expect(upstream).toHaveBeenCalledTimes(6);
    for (const [input] of upstream.mock.calls) {
      expect(String(input)).toContain(
        'https://ca34quae.api.sanity.io/v2025-09-01/data/query/production?',
      );
    }
  },
);

test('Worker uses server configuration and published-only queries even with a token', async () => {
  const upstream = stubSanity();
  const response = await worker.fetch(new Request(endpoint), {
    ...environment,
    SANITY_PROJECT_ID: ' custom123 ',
    SANITY_DATASET: ' preview ',
    SANITY_API_VERSION: ' 2026-01-01 ',
    SANITY_API_TOKEN: ' server-secret ',
  });
  expect(response.status).toBe(200);
  for (const [input, init] of upstream.mock.calls) {
    const url = new URL(String(input));
    expect(url.origin).toBe('https://custom123.api.sanity.io');
    expect(url.pathname).toBe('/v2026-01-01/data/query/preview');
    expect(url.searchParams.get('perspective')).toBe('published');
    expect(url.searchParams.get('query')).toContain(
      '!(_id in path("drafts.**"))',
    );
    expect(url.searchParams.get('query')).toContain(
      '!(_id in path("versions.**"))',
    );
    expect(new Headers(init?.headers).get('authorization')).toBe(
      'Bearer server-secret',
    );
  }
  expect(await response.text()).not.toContain('server-secret');
});

test('Worker honors public project aliases and a server-only local Sanity host', async () => {
  const upstream = stubSanity();
  expect(
    (
      await worker.fetch(new Request(endpoint), {
        ...environment,
        VITE_SANITY_PROJECT_ID: 'alias123',
        VITE_SANITY_DATASET: 'test',
        VITE_SANITY_API_VERSION: '2026-02-01',
        SANITY_API_HOST: 'http://127.0.0.1:1380/',
      })
    ).status,
  ).toBe(200);
  for (const [input] of upstream.mock.calls) {
    expect(String(input)).toContain(
      'http://127.0.0.1:1380/v2026-02-01/data/query/test?',
    );
  }
});

test.each(['google-sheets', 'filesystem'])(
  'Worker rejects unsupported source %s without upstream access',
  async (CONTENT_SOURCE) => {
    const upstream = stubSanity();
    const response = await worker.fetch(new Request(endpoint), {
      ...environment,
      CONTENT_SOURCE,
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Content is temporarily unavailable.',
    });
    expect(upstream).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Unsupported CONTENT_SOURCE "${CONTENT_SOURCE}".`,
      }),
    );
  },
);

test.each([
  'transport',
  'http',
  'json',
  'envelope',
  'validation',
  'duplicate',
  'relation',
])('Worker returns the public 503 for %s failure', async (failure) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request) => {
      if (failure === 'transport') throw new Error('private upstream detail');
      if (failure === 'http')
        return new Response('private upstream detail', { status: 401 });
      if (failure === 'json') return new Response('invalid json');
      if (failure === 'envelope') return Response.json({ private: 'detail' });
      const type = new URL(String(input)).searchParams
        .get('query')
        ?.match(/_type == "([^"]+)"/)?.[1];
      let result =
        type && type in results ? Reflect.get(results, type) : undefined;
      if (type === 'update' && failure === 'validation')
        result = [{ ...record, kind: 'invalid' }];
      if (type === 'update' && failure === 'duplicate')
        result = [...results.update, ...results.update];
      if (type === 'survey' && failure === 'relation')
        result = [
          { ...record, stage: 'open', relatedProject: { _ref: 'missing' } },
        ];
      return Response.json({ result });
    }),
  );
  const response = await worker.fetch(new Request(endpoint), environment);
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    error: 'Content is temporarily unavailable.',
  });
  expect(response.headers.get('access-control-allow-origin')).toBe('*');
  expect(response.headers.get('cache-control')).toBeNull();
  expect(console.error).toHaveBeenCalled();
});

test.each(['OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'])(
  'Worker preserves %s protocol without reading content',
  async (method) => {
    const upstream = stubSanity();
    const response = await worker.fetch(
      new Request(endpoint, { method }),
      environment,
    );
    expect(response.status).toBe(method === 'OPTIONS' ? 204 : 405);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    if (method === 'OPTIONS') {
      expect(response.headers.get('access-control-allow-methods')).toBe(
        'GET, OPTIONS',
      );
      expect(response.headers.get('access-control-max-age')).toBe('86400');
    } else expect(response.headers.get('allow')).toBe('GET');
    expect(await response.text()).toBe('');
    expect(upstream).not.toHaveBeenCalled();
  },
);

test('Worker delegates non-endpoint paths to the asset binding', async () => {
  const upstream = stubSanity();
  for (const path of [
    '/',
    '/projects/',
    '/api/mobile-content-extra',
    '/api/mobile-content/',
  ]) {
    const request = new Request(`https://example.test${path}`);
    const response = await worker.fetch(request, environment);
    expect(await response.text()).toBe('static asset');
    expect(fetchAsset).toHaveBeenLastCalledWith(request);
  }
  expect(upstream).not.toHaveBeenCalled();
});
