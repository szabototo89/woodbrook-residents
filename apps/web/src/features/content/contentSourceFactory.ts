import type { ContentSource } from './contentSource';
import { GoogleSheetsContentSource } from './googleSheetsContentSource';
import { SanityContentSource } from './sanityContentSource';

const defaultSpreadsheetId = '1X9N_0s7ZN7W6IC43nVegtottBdMbfz-rRKvClccPqgo';
const defaultSanityProjectId = 'ca34quae';
const defaultSanityDataset = 'production';
const defaultSanityApiVersion = '2025-09-01';

type ContentEnvironment = Partial<Record<string, string | undefined>>;

function readEnv(environment: ContentEnvironment, ...names: string[]): string {
  const found = names
    .map((name) => environment[name]?.trim())
    .find((value) => value);
  return found ?? '';
}

export function createContentSource(
  environment: ContentEnvironment = process.env,
): ContentSource {
  const configuredSource = environment.CONTENT_SOURCE?.trim() || '';

  if (!configuredSource || configuredSource === 'google-sheets') {
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

  if (configuredSource === 'sanity') {
    const projectId =
      readEnv(environment, 'SANITY_PROJECT_ID', 'VITE_SANITY_PROJECT_ID') ||
      defaultSanityProjectId;
    const dataset =
      readEnv(environment, 'SANITY_DATASET', 'VITE_SANITY_DATASET') ||
      defaultSanityDataset;
    const apiVersion =
      readEnv(environment, 'SANITY_API_VERSION', 'VITE_SANITY_API_VERSION') ||
      defaultSanityApiVersion;
    const token =
      readEnv(environment, 'SANITY_API_TOKEN', 'VITE_SANITY_API_TOKEN') ||
      undefined;
    const apiHost = readEnv(environment, 'SANITY_API_HOST') || undefined;

    return new SanityContentSource({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
      apiHost,
    });
  }

  throw new Error(`Unsupported CONTENT_SOURCE "${configuredSource}".`);
}
