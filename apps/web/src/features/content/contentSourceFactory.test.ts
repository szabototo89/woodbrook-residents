import { describe, expect, it } from 'vitest';

import { createContentSource } from './contentSourceFactory';
import { GoogleSheetsContentSource } from './googleSheetsContentSource';
import { StrapiContentSource } from './strapiContentSource';

describe('createContentSource', () => {
  it('selects Strapi explicitly', () => {
    expect(
      createContentSource({
        CONTENT_SOURCE: 'strapi',
        STRAPI_URL: 'https://cms.example.com',
      }),
    ).toBeInstanceOf(StrapiContentSource);
  });

  it('selects the configured Google spreadsheet', () => {
    expect(
      createContentSource({
        CONTENT_SOURCE: 'google-sheets',
        GOOGLE_SHEETS_SPREADSHEET_ID: 'sheet-id',
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'reader@example.test',
        GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: 'line-1\\nline-2',
      }),
    ).toBeInstanceOf(GoogleSheetsContentSource);
  });

  it('rejects missing or unsupported source selection', () => {
    expect(() => createContentSource({})).toThrow(
      'CONTENT_SOURCE must be set to "strapi" or "google-sheets".',
    );
    expect(() => createContentSource({ CONTENT_SOURCE: 'filesystem' })).toThrow(
      'Unsupported CONTENT_SOURCE "filesystem".',
    );
  });
});
