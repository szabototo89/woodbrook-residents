import { afterEach, expect, test, vi } from 'vitest';

import { StrapiContentSource } from './strapiContentSource';

afterEach(() => vi.unstubAllGlobals());

test('StrapiContentSource loads every canonical collection into one snapshot', async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    return new Response(
      JSON.stringify(
        url.endsWith('/api/site-setting') ? { data: null } : { data: [] },
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  });
  vi.stubGlobal('fetch', fetchMock);

  await expect(
    new StrapiContentSource('https://cms.example.com').loadSnapshot(),
  ).resolves.toEqual({
    siteSetting: undefined,
    updates: [],
    projects: [],
    events: [],
    surveys: [],
    resources: [],
  });
  expect(fetchMock).toHaveBeenCalledTimes(6);
  expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual(
    expect.arrayContaining([
      'https://cms.example.com/api/site-setting',
      expect.stringContaining('/api/updates?'),
      expect.stringContaining('/api/projects?'),
      expect.stringContaining('/api/events?'),
      expect.stringContaining('/api/surveys?'),
      expect.stringContaining('/api/resources?'),
    ]),
  );
});

test('StrapiContentSource identifies the failed Strapi path and status', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status: 503 })),
  );

  await expect(
    new StrapiContentSource('https://cms.example.com').loadSnapshot(),
  ).rejects.toThrow('Strapi request to site-setting failed with status 503.');
});
