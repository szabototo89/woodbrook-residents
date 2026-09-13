import {
  parseGoogleSheetsContent,
  sheetRanges,
} from '../../../../web/src/features/content/googleSheetsParsing.js';
import type { GoogleSheetsValues } from '../../../../web/src/features/content/googleSheetsParsing.js';
import { validateContentSnapshot } from '../../../../web/src/features/content/contentSource.js';

import type { ContentSnapshot } from './contentTypes.js';
import { requestAccessToken } from './sheetsAuth.js';
import type { SheetsCredentials, TokenFetch } from './sheetsAuth.js';

const sheetsApiBase = 'https://sheets.googleapis.com/v4/spreadsheets';
const defaultSpreadsheetId = '1X9N_0s7ZN7W6IC43nVegtottBdMbfz-rRKvClccPqgo';

export type BundledSheetsSource = {
  readonly spreadsheetId?: string;
  readonly serviceAccountEmail?: string;
  readonly serviceAccountPrivateKey?: string;
};

function withText(value: string | undefined, fallback: string): string {
  if (value === undefined || value === '') return fallback;
  return value;
}

export function resolveSheetsCredentials(
  source: BundledSheetsSource,
): SheetsCredentials {
  return {
    spreadsheetId: withText(source.spreadsheetId, defaultSpreadsheetId),
    serviceAccountEmail: withText(source.serviceAccountEmail, ''),
    serviceAccountPrivateKey: withText(source.serviceAccountPrivateKey, ''),
  };
}

export function bundledSheetsCredentials(): SheetsCredentials {
  return resolveSheetsCredentials({
    spreadsheetId:
      typeof __GOOGLE_SHEETS_SPREADSHEET_ID__ !== 'undefined'
        ? __GOOGLE_SHEETS_SPREADSHEET_ID__
        : undefined,
    serviceAccountEmail:
      typeof __GOOGLE_SERVICE_ACCOUNT_EMAIL__ !== 'undefined'
        ? __GOOGLE_SERVICE_ACCOUNT_EMAIL__
        : undefined,
    serviceAccountPrivateKey:
      typeof __GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY__ !== 'undefined'
        ? __GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY__
        : undefined,
  });
}

export function sheetsBatchUrl(spreadsheetId: string): string {
  const ranges = sheetRanges
    .map((range) => `ranges=${encodeURIComponent(range)}`)
    .join('&');
  return `${sheetsApiBase}/${encodeURIComponent(spreadsheetId)}/values:batchGet?${ranges}&majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER`;
}

function tabValues(entry: unknown): unknown[][] {
  if (!entry || typeof entry !== 'object') {
    throw new Error('Content is temporarily unavailable.');
  }
  const cells = Reflect.get(entry, 'values');
  if (cells === undefined) return [];
  if (!Array.isArray(cells)) {
    throw new Error('Content is temporarily unavailable.');
  }
  return cells.map((row) => (Array.isArray(row) ? row : []));
}

export function toSheetsValues(payload: unknown): GoogleSheetsValues {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Content is temporarily unavailable.');
  }
  const ranges = Reflect.get(payload, 'valueRanges');
  if (!Array.isArray(ranges) || ranges.length !== sheetRanges.length) {
    throw new Error('Content is temporarily unavailable.');
  }
  const [updates, events, projects, consultations, localInfo] = ranges;
  return {
    Updates: tabValues(updates),
    Events: tabValues(events),
    Projects: tabValues(projects),
    Consultations: tabValues(consultations),
    Local_Info: tabValues(localInfo),
  };
}

export async function loadSheetsSnapshot(
  httpFetch: TokenFetch = fetch,
  credentials: SheetsCredentials = bundledSheetsCredentials(),
): Promise<ContentSnapshot> {
  try {
    const token = await requestAccessToken(httpFetch, credentials);
    const response = await httpFetch(
      sheetsBatchUrl(credentials.spreadsheetId),
      {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error('Sheets values request failed.');
    return validateContentSnapshot(
      parseGoogleSheetsContent(toSheetsValues(await response.json())),
      'google-sheets',
    );
  } catch (error) {
    throw new Error('Content is temporarily unavailable.', { cause: error });
  }
}
