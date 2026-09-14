import { GoogleAuth } from 'google-auth-library';

import type { ContentSource } from './contentSource';
import {
  parseGoogleSheetsContent,
  sheetRanges,
  sheetsApiScope,
} from './googleSheetsParsing';

export { parseGoogleSheetsContent } from './googleSheetsParsing';
export type { GoogleSheetsValues } from './googleSheetsParsing';

type GoogleSheetsConfig = {
  spreadsheetId: string;
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
};

type BatchGetResponse = {
  valueRanges?: Array<{ range?: string; values?: unknown[][] }>;
};

export class GoogleSheetsContentSource implements ContentSource {
  readonly name = 'google-sheets';

  constructor(private readonly config: GoogleSheetsConfig) {}

  async loadSnapshot() {
    if (!this.config.serviceAccountEmail) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is required.');
    }
    if (!this.config.serviceAccountPrivateKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required.');
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: this.config.serviceAccountEmail,
        private_key: this.config.serviceAccountPrivateKey,
      },
      scopes: [sheetsApiScope],
    });
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values:batchGet`;
    const requestUrl = sheetRanges.reduce((url, range) => {
      url.searchParams.append('ranges', range);
      return url;
    }, new URL(baseUrl));
    requestUrl.searchParams.set('majorDimension', 'ROWS');
    requestUrl.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
    requestUrl.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');

    const response = await auth.request<BatchGetResponse>({
      url: requestUrl.toString(),
    });
    const values = response.data.valueRanges ?? [];
    if (values.length !== sheetRanges.length) {
      throw new Error(
        `Google Sheets returned ${values.length} ranges; expected ${sheetRanges.length}.`,
      );
    }

    const valuesFor = (index: number) => values[index]?.values ?? [];

    return parseGoogleSheetsContent({
      Updates: valuesFor(0),
      Events: valuesFor(1),
      Projects: valuesFor(2),
      Consultations: valuesFor(3),
      Local_Info: valuesFor(4),
    });
  }
}
