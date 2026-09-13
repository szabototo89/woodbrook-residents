import { generateKeyPairSync } from 'node:crypto';

import { expect, test, vi } from 'vitest';

import {
  bundledSheetsCredentials,
  loadSheetsSnapshot,
  resolveSheetsCredentials,
  toSheetsValues,
} from '../features/content/sheetsContentSource.js';

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

const credentials = {
  spreadsheetId: 'sheet-id',
  serviceAccountEmail: 'reader@example.iam.gserviceaccount.com',
  serviceAccountPrivateKey: String(
    privateKey.export({ type: 'pkcs8', format: 'pem' }),
  ),
};

const updateRow = [
  'record_id',
  'slug',
  'publish',
  'title',
  'category',
  'summary',
  'published_on',
  'source_name',
  'source_url',
  'source_checked_on',
];

const projectRow = [
  'record_id',
  'slug',
  'publish',
  'title',
  'category',
  'status',
  'summary',
  'reviewed_on',
  'next_step',
  'source_name',
  'source_url',
];

const eventRow = [
  'record_id',
  'slug',
  'publish',
  'title',
  'summary',
  'category',
  'status',
  'all_day',
  'timezone',
  'start_at',
  'location_name',
  'source_name',
  'source_url',
  'source_checked_on',
];

const consultationRow = [
  'record_id',
  'slug',
  'publish',
  'title',
  'category',
  'status',
  'summary',
  'opens_on',
  'closes_on',
  'source_name',
  'source_url',
  'source_checked_on',
];

const localInfoRow = [
  'record_id',
  'slug',
  'publish',
  'name',
  'category',
  'type_label',
  'entity_type',
  'description',
  'out_of_hours',
  'emergency_only',
  'source_name',
  'source_url',
  'source_checked_on',
];

const valueRanges = [
  {
    values: [
      updateRow,
      [
        'update-1',
        'bus-route-update',
        'TRUE',
        'Bus route update',
        'Transport',
        'The route has changed.',
        '2026-09-01',
        'Official source',
        'https://example.com/update',
        '2026-09-02',
      ],
    ],
  },
  {
    values: [
      eventRow,
      [
        'event-1',
        'residents-meeting',
        'TRUE',
        'Residents meeting',
        'A confirmed meeting.',
        'Community',
        'Scheduled',
        'FALSE',
        'Europe/Dublin',
        '2026-10-01T18:00:00',
        'Shankill Library',
        'Council',
        'https://example.com/event',
        '2026-09-10',
      ],
    ],
  },
  {
    values: [
      projectRow,
      [
        'project-1',
        'green-space',
        'TRUE',
        'Green space project',
        'Parks',
        'Active',
        'Work is under way.',
        '2026-08-20',
        'Review the next update.',
        'Council',
        'https://example.com/project',
      ],
    ],
  },
  {
    values: [
      consultationRow,
      [
        'survey-1',
        'transport-consultation',
        'TRUE',
        'Transport consultation',
        'Transport',
        'Open',
        'Have your say.',
        '2026-09-01',
        '2026-10-15',
        'Council',
        'https://example.com/survey',
        '2026-09-10',
      ],
    ],
  },
  {
    values: [
      localInfoRow,
      [
        'resource-1',
        'local-health-service',
        'TRUE',
        'Local health service',
        'Health',
        'Health centre',
        'Public service',
        'Nearby health information.',
        'TRUE',
        'FALSE',
        'HSE',
        'https://example.com/health',
        '2026-09-09',
      ],
    ],
  },
];

function sheetsHttp(
  responses: Array<{ ok: boolean; json: () => Promise<unknown> }>,
) {
  const calls: Array<{ url: string; init: unknown }> = [];
  const queue = [...responses];
  const fetchContent = vi.fn((url: string, init: unknown) => {
    calls.push({ url, init });
    const next = queue.shift();
    return Promise.resolve(
      next ?? { ok: false, json: () => Promise.resolve(null) },
    );
  });
  return { fetchContent, calls };
}

test('sheets snapshot loads live content without a web endpoint', async () => {
  const { fetchContent, calls } = sheetsHttp([
    { ok: true, json: () => Promise.resolve({ access_token: 'token-1' }) },
    { ok: true, json: () => Promise.resolve({ valueRanges }) },
  ]);

  const snapshot = await loadSheetsSnapshot(fetchContent, credentials);

  expect(snapshot.updates.map((update) => update.slug)).toEqual([
    'bus-route-update',
  ]);
  expect(snapshot.events.map((event) => event.slug)).toEqual([
    'residents-meeting',
  ]);
  expect(snapshot.projects.map((project) => project.slug)).toEqual([
    'green-space',
  ]);
  expect(snapshot.surveys.map((survey) => survey.slug)).toEqual([
    'transport-consultation',
  ]);
  expect(snapshot.resources.map((resource) => resource.slug)).toEqual([
    'local-health-service',
  ]);
  expect(calls[0]?.url).toBe('https://oauth2.googleapis.com/token');
  expect(calls[1]?.url).toContain(
    'https://sheets.googleapis.com/v4/spreadsheets/sheet-id/values:batchGet?',
  );
  expect(calls[1]?.url).toContain(encodeURIComponent('Updates!A:Q'));
});

test('sheets snapshot reports failures as temporarily unavailable', async () => {
  const tokenOk = {
    ok: true,
    json: () => Promise.resolve({ access_token: 'token-1' }),
  };

  await expect(
    loadSheetsSnapshot(
      sheetsHttp([{ ok: false, json: () => Promise.resolve(null) }])
        .fetchContent,
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');

  await expect(
    loadSheetsSnapshot(
      sheetsHttp([tokenOk, { ok: false, json: () => Promise.resolve(null) }])
        .fetchContent,
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');

  await expect(
    loadSheetsSnapshot(
      sheetsHttp([
        tokenOk,
        { ok: true, json: () => Promise.resolve({ valueRanges: [] }) },
      ]).fetchContent,
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');

  await expect(
    loadSheetsSnapshot(
      sheetsHttp([
        tokenOk,
        {
          ok: true,
          json: () =>
            Promise.resolve({
              valueRanges: valueRanges.map((tab, index) =>
                index === 0
                  ? { values: [updateRow, ['broken', 'broken', 'TRUE']] }
                  : tab,
              ),
            }),
        },
      ]).fetchContent,
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');

  await expect(
    loadSheetsSnapshot(
      vi.fn().mockRejectedValue(new Error('offline')),
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');
});

test('sheets snapshot rejects invalid row payloads', async () => {
  const { fetchContent } = sheetsHttp([
    { ok: true, json: () => Promise.resolve({ access_token: 'token-1' }) },
    { ok: true, json: () => Promise.resolve({ valueRanges: 'nope' }) },
  ]);

  await expect(loadSheetsSnapshot(fetchContent, credentials)).rejects.toThrow(
    'Content is temporarily unavailable.',
  );
  expect(() => toSheetsValues(null)).toThrow(
    'Content is temporarily unavailable.',
  );
  expect(() =>
    toSheetsValues({ valueRanges: [null, null, null, null, null] }),
  ).toThrow('Content is temporarily unavailable.');
  expect(toSheetsValues({ valueRanges: [{}, {}, {}, {}, {}] })).toEqual({
    Updates: [],
    Events: [],
    Projects: [],
    Consultations: [],
    Local_Info: [],
  });
  expect(() =>
    toSheetsValues({
      valueRanges: [{ values: 'nope' }, {}, {}, {}, {}],
    }),
  ).toThrow('Content is temporarily unavailable.');
  expect(
    toSheetsValues({
      valueRanges: [{ values: [['publish'], 'scalar'] }, {}, {}, {}, {}],
    }),
  ).toEqual({
    Updates: [['publish'], []],
    Events: [],
    Projects: [],
    Consultations: [],
    Local_Info: [],
  });
  await expect(
    loadSheetsSnapshot(
      sheetsHttp([
        { ok: true, json: () => Promise.resolve({ access_token: 'token-1' }) },
        {
          ok: true,
          json: () =>
            Promise.resolve({
              valueRanges: [
                { values: [['publish'], 'scalar'] },
                {},
                {},
                {},
                {},
              ],
            }),
        },
      ]).fetchContent,
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');
});

test('sheets credentials resolve explicit values before build-time fallbacks', () => {
  expect(
    resolveSheetsCredentials({
      spreadsheetId: 'explicit-id',
      serviceAccountEmail: 'explicit@example.com',
      serviceAccountPrivateKey: 'explicit-key',
    }),
  ).toEqual({
    spreadsheetId: 'explicit-id',
    serviceAccountEmail: 'explicit@example.com',
    serviceAccountPrivateKey: 'explicit-key',
  });
  expect(resolveSheetsCredentials({})).toEqual({
    spreadsheetId: '1X9N_0s7ZN7W6IC43nVegtottBdMbfz-rRKvClccPqgo',
    serviceAccountEmail: '',
    serviceAccountPrivateKey: '',
  });
  expect(resolveSheetsCredentials({ spreadsheetId: '' })).toEqual(
    resolveSheetsCredentials({}),
  );
});

test('bundled sheets credentials prefer build-time defines', () => {
  Reflect.set(globalThis, '__GOOGLE_SHEETS_SPREADSHEET_ID__', 'defined-id');
  Reflect.set(
    globalThis,
    '__GOOGLE_SERVICE_ACCOUNT_EMAIL__',
    'defined@example.com',
  );
  Reflect.set(
    globalThis,
    '__GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY__',
    'defined-key',
  );

  expect(bundledSheetsCredentials()).toEqual({
    spreadsheetId: 'defined-id',
    serviceAccountEmail: 'defined@example.com',
    serviceAccountPrivateKey: 'defined-key',
  });

  Reflect.deleteProperty(globalThis, '__GOOGLE_SHEETS_SPREADSHEET_ID__');
  Reflect.deleteProperty(globalThis, '__GOOGLE_SERVICE_ACCOUNT_EMAIL__');
  Reflect.deleteProperty(globalThis, '__GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY__');

  expect(bundledSheetsCredentials()).toEqual(resolveSheetsCredentials({}));
});
