import { expect, test } from 'vitest';

import { createContentSource } from './contentSourceFactory';
import { GoogleSheetsContentSource } from './googleSheetsContentSource';
import { StrapiContentSource } from './strapiContentSource';

test('createContentSource selects Strapi explicitly', () => {
  expect(
    createContentSource({
      CONTENT_SOURCE: 'strapi',
      STRAPI_URL: 'https://cms.example.com',
    }),
  ).toBeInstanceOf(StrapiContentSource);
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

test('createContentSource rejects missing or unsupported source selection', () => {
  expect(() => createContentSource({})).toThrow(
    'CONTENT_SOURCE must be set to "strapi" or "google-sheets".',
  );
  expect(() => createContentSource({ CONTENT_SOURCE: 'filesystem' })).toThrow(
    'Unsupported CONTENT_SOURCE "filesystem".',
  );
});

test('createContentSource falls back to the local Strapi URL when none is configured', () => {
  expect(createContentSource({ CONTENT_SOURCE: 'strapi' })).toBeInstanceOf(
    StrapiContentSource,
  );
});

test('createContentSource falls back to built-in Google defaults for optional values', async () => {
  const source = createContentSource({ CONTENT_SOURCE: 'google-sheets' });

  expect(source).toBeInstanceOf(GoogleSheetsContentSource);
  await expect(source.loadSnapshot()).rejects.toThrow(
    'GOOGLE_SERVICE_ACCOUNT_EMAIL is required.',
  );
});
