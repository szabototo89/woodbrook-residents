import { expect, test } from 'vitest';

import { createContentSource } from './contentSourceFactory';
import { GoogleSheetsContentSource } from './googleSheetsContentSource';
import { SanityContentSource } from './sanityContentSource';

test('createContentSource defaults to Sanity when no source is configured', () => {
  expect(createContentSource({})).toBeInstanceOf(SanityContentSource);
  expect(createContentSource({ CONTENT_SOURCE: '' })).toBeInstanceOf(
    SanityContentSource,
  );
  expect(createContentSource({ CONTENT_SOURCE: '   ' })).toBeInstanceOf(
    SanityContentSource,
  );
});

test('createContentSource selects the configured Google spreadsheet', () => {
  expect(
    createContentSource({
      CONTENT_SOURCE: 'google-sheets',
      GOOGLE_SHEETS_SPREADSHEET_ID: 'sheet-id',
      GOOGLE_SERVICE_ACCOUNT_EMAIL: 'reader@example.test',
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: 'line-1\\nline-2',
    }),
  ).toBeInstanceOf(GoogleSheetsContentSource);
});

test('createContentSource rejects unsupported source selection', () => {
  expect(() => createContentSource({ CONTENT_SOURCE: 'filesystem' })).toThrow(
    'Unsupported CONTENT_SOURCE "filesystem".',
  );
  expect(() => createContentSource({ CONTENT_SOURCE: 'strapi' })).toThrow(
    'Unsupported CONTENT_SOURCE "strapi".',
  );
});

test('createContentSource falls back to built-in Google defaults for optional values', async () => {
  const source = createContentSource({ CONTENT_SOURCE: 'google-sheets' });

  expect(source).toBeInstanceOf(GoogleSheetsContentSource);
  await expect(source.loadSnapshot()).rejects.toThrow(
    'GOOGLE_SERVICE_ACCOUNT_EMAIL is required.',
  );
});

test('createContentSource selects Sanity with Woodbrook project defaults', () => {
  const source = createContentSource({ CONTENT_SOURCE: 'sanity' });

  expect(source).toBeInstanceOf(SanityContentSource);
  expect(source.name).toBe('sanity');
});

test('createContentSource selects Sanity with explicit configuration', () => {
  expect(
    createContentSource({
      CONTENT_SOURCE: 'sanity',
      SANITY_PROJECT_ID: 'ca34quae',
      SANITY_DATASET: 'production',
      SANITY_API_VERSION: '2025-09-01',
    }),
  ).toBeInstanceOf(SanityContentSource);
});

test('createContentSource forwards a custom Sanity API host', async () => {
  const { vi } = await import('vitest');
  const seen: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      seen.push(url);
      if (decodeURIComponent(url).includes('_type == "siteSetting"')) {
        return new Response(JSON.stringify({ result: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ result: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
  );
  try {
    const source = createContentSource({
      SANITY_API_HOST: 'http://127.0.0.1:1380',
    });
    await source.loadSnapshot();
    expect(seen.length).toBeGreaterThanOrEqual(6);
    expect(seen.every((url) => url.startsWith('http://127.0.0.1:1380/'))).toBe(
      true,
    );
  } finally {
    vi.unstubAllGlobals();
  }
});
