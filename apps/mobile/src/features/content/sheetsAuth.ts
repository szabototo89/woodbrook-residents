import { sheetsApiScope } from '../../../../web/src/features/content/googleSheetsParsing.js';

import { base64UrlEncode, rs256Sign, utf8Bytes } from './sheetsCrypto.js';

export type SheetsCredentials = {
  readonly spreadsheetId: string;
  readonly serviceAccountEmail: string;
  readonly serviceAccountPrivateKey: string;
};

type TokenResponse = {
  readonly ok: boolean;
  json(): Promise<unknown>;
};

export type TokenFetch = (
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string },
) => Promise<TokenResponse>;

const tokenEndpoint = 'https://oauth2.googleapis.com/token';

export function createJwtAssertion(
  credentials: SheetsCredentials,
  issuedAtSeconds: number,
): string {
  const header = base64UrlEncode(
    utf8Bytes(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
  );
  const payload = base64UrlEncode(
    utf8Bytes(
      JSON.stringify({
        iss: credentials.serviceAccountEmail,
        scope: sheetsApiScope,
        aud: tokenEndpoint,
        iat: issuedAtSeconds,
        exp: issuedAtSeconds + 3600,
      }),
    ),
  );
  const signingInput = `${header}.${payload}`;
  return `${signingInput}.${rs256Sign(signingInput, credentials.serviceAccountPrivateKey)}`;
}

function readAccessToken(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Content is temporarily unavailable.');
  }
  const token = Reflect.get(payload, 'access_token');
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Content is temporarily unavailable.');
  }
  return token;
}

export async function requestAccessToken(
  fetchToken: TokenFetch = fetch,
  credentials: SheetsCredentials,
  issuedAtSeconds = Math.floor(Date.now() / 1000),
): Promise<string> {
  if (!credentials.serviceAccountEmail) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is required.');
  }
  if (!credentials.serviceAccountPrivateKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required.');
  }
  const response = await fetchToken(tokenEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${encodeURIComponent(createJwtAssertion(credentials, issuedAtSeconds))}`,
  });
  if (!response.ok) throw new Error('Content is temporarily unavailable.');
  return readAccessToken(await response.json());
}
