import type { ContentSource } from './contentSource';
import { GoogleSheetsContentSource } from './googleSheetsContentSource';
import { StrapiContentSource } from './strapiContentSource';

const defaultSpreadsheetId = '1X9N_0s7ZN7W6IC43nVegtottBdMbfz-rRKvClccPqgo';

type ContentEnvironment = Partial<Record<string, string | undefined>>;

export function createContentSource(
  environment: ContentEnvironment = process.env,
): ContentSource {
  const configuredSource = environment.CONTENT_SOURCE?.trim();
  if (!configuredSource) {
    throw new Error(
      'CONTENT_SOURCE must be set to "strapi" or "google-sheets".',
    );
  }

  if (configuredSource !== 'strapi' && configuredSource !== 'google-sheets') {
    throw new Error(`Unsupported CONTENT_SOURCE "${configuredSource}".`);
  }

  if (configuredSource === 'google-sheets') {
    return new GoogleSheetsContentSource({
      spreadsheetId:
        environment.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() ||
        defaultSpreadsheetId,
      serviceAccountEmail:
        environment.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || '',
      serviceAccountPrivateKey:
        environment.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n') ||
        '',
    });
  }

  return new StrapiContentSource(
    environment.STRAPI_URL?.trim() || 'http://localhost:1337',
  );
}
