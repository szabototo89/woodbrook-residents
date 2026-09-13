import { createVerify, generateKeyPairSync } from 'node:crypto';

import { expect, test, vi } from 'vitest';

import {
  createJwtAssertion,
  requestAccessToken,
} from '../features/content/sheetsAuth.js';
import { base64UrlDecode } from '../features/content/sheetsCrypto.js';

const credentials = {
  spreadsheetId: 'sheet-id',
  serviceAccountEmail: 'reader@example.iam.gserviceaccount.com',
  serviceAccountPrivateKey: String(
    generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({
      type: 'pkcs8',
      format: 'pem',
    }),
  ),
};

function decodePayload(assertion: string) {
  const parts = assertion.split('.');
  return JSON.parse(Buffer.from(base64UrlDecode(parts[1] ?? '')).toString());
}

test('createJwtAssertion builds a verifiable service-account assertion', () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const privatePem = String(
    privateKey.export({ type: 'pkcs8', format: 'pem' }),
  );
  const assertion = createJwtAssertion(
    { ...credentials, serviceAccountPrivateKey: privatePem },
    1_757_800_000,
  );
  const payload = decodePayload(assertion);

  expect(payload.iss).toBe(credentials.serviceAccountEmail);
  expect(payload.scope).toBe(
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  );
  expect(payload.aud).toBe('https://oauth2.googleapis.com/token');
  expect(payload.exp - payload.iat).toBe(3600);

  const verifier = createVerify('RSA-SHA256');
  verifier.update(assertion.split('.').slice(0, 2).join('.'));
  expect(
    verifier.verify(
      publicKey,
      Buffer.from(base64UrlDecode(assertion.split('.')[2] ?? '')),
    ),
  ).toBe(true);
});

test('requestAccessToken exchanges a signed assertion for a token', async () => {
  const fetchToken = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ access_token: 'token-123' }),
  });

  const token = await requestAccessToken(
    fetchToken,
    credentials,
    1_757_800_000,
  );

  expect(token).toBe('token-123');
  expect(fetchToken).toHaveBeenCalledOnce();
  const [url, init] = fetchToken.mock.calls[0] ?? [];
  expect(url).toBe('https://oauth2.googleapis.com/token');
  expect(init.method).toBe('POST');
  expect(String(init.body)).toContain('grant_type=');
});

test('requestAccessToken requires service-account credentials', async () => {
  const fetchToken = vi.fn();

  await expect(
    requestAccessToken(fetchToken, { ...credentials, serviceAccountEmail: '' }),
  ).rejects.toThrow('GOOGLE_SERVICE_ACCOUNT_EMAIL is required.');
  await expect(
    requestAccessToken(fetchToken, {
      ...credentials,
      serviceAccountPrivateKey: '',
    }),
  ).rejects.toThrow('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required.');
  expect(fetchToken).not.toHaveBeenCalled();
});

test('requestAccessToken hides upstream failures behind the retry copy', async () => {
  await expect(
    requestAccessToken(
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');
  await expect(
    requestAccessToken(
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) }),
      credentials,
    ),
  ).rejects.toThrow('Content is temporarily unavailable.');
});
