import { createVerify, generateKeyPairSync } from 'node:crypto';

import { expect, test } from 'vitest';

import {
  base64UrlDecode,
  base64UrlEncode,
  parseServiceAccountKey,
  rs256Sign,
  sha256,
  utf8Bytes,
} from '../features/content/sheetsCrypto.js';

test('sha256 matches the known digest for abc', () => {
  const digest = Array.from(sha256(utf8Bytes('abc')))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  expect(digest).toBe(
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
});

test('utf8Bytes and base64url helpers round-trip text', () => {
  const original = 'Woodbrook — Shankill ✓';
  const encoded = base64UrlEncode(utf8Bytes(original));

  expect(encoded).not.toContain('+');
  expect(encoded).not.toContain('/');
  expect(encoded).not.toContain('=');
  expect(Buffer.from(base64UrlDecode(encoded))).toEqual(
    Buffer.from(original, 'utf8'),
  );
});

test('base64url encoding handles every padding length', () => {
  const vectors: Array<[string, string]> = [
    ['', ''],
    ['f', 'Zg'],
    ['fo', 'Zm8'],
    ['foo', 'Zm9v'],
    ['foob', 'Zm9vYg'],
  ];

  vectors.map(([plain, encoded]) => {
    expect(base64UrlEncode(utf8Bytes(plain))).toBe(encoded);
    expect(Buffer.from(base64UrlDecode(encoded))).toEqual(
      Buffer.from(plain, 'utf8'),
    );
  });
});

test('base64url helpers handle url-safe bytes and reject invalid input', () => {
  const raw = Uint8Array.from([0xfb, 0xff, 0xfe, 0x03]);
  const encoded = base64UrlEncode(raw);

  expect(encoded).toContain('-');
  expect(encoded).toContain('_');
  expect(base64UrlDecode(encoded)).toEqual(raw);
  expect(() => base64UrlDecode('a')).toThrow('Invalid base64url input.');
  expect(() => base64UrlDecode('!!!')).toThrow('Invalid base64url input.');
});

test('utf8Bytes encodes two-byte, surrogate-pair, and lone surrogates', () => {
  expect(Array.from(utf8Bytes('é'))).toEqual([0xc3, 0xa9]);
  expect(
    Buffer.from(base64UrlDecode(base64UrlEncode(utf8Bytes('🎉')))),
  ).toEqual(Buffer.from('🎉', 'utf8'));
  expect(utf8Bytes('\uD800').length).toBeGreaterThan(0);
});

function serviceAccountPemFromDer(der: Buffer): string {
  return `-----BEGIN PRIVATE KEY-----\n${der.toString('base64')}\n-----END PRIVATE KEY-----`;
}

function serviceAccountDerFromPem(pem: string): Buffer {
  return Buffer.from(
    pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, ''),
    'base64',
  );
}

test('parseServiceAccountKey reports truncated and mistagged keys', () => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 1024 });
  const validPem = String(privateKey.export({ type: 'pkcs8', format: 'pem' }));
  const validDer = serviceAccountDerFromPem(validPem);

  expect(() => parseServiceAccountKey('')).toThrow('private key');
  expect(() =>
    parseServiceAccountKey(serviceAccountPemFromDer(validDer.subarray(0, 10))),
  ).toThrow('Truncated private key.');
  expect(() =>
    parseServiceAccountKey(
      serviceAccountPemFromDer(
        Buffer.concat([Buffer.from([0x31]), validDer.subarray(1)]),
      ),
    ),
  ).toThrow('Unexpected private key structure.');
  expect(() =>
    parseServiceAccountKey(
      serviceAccountPemFromDer(
        Buffer.concat([
          validDer.subarray(0, 1),
          Buffer.from([0x85]),
          validDer.subarray(2),
        ]),
      ),
    ),
  ).toThrow('private key');
  expect(() => parseServiceAccountKey('MA==')).toThrow(
    'Truncated private key.',
  );
  expect(() =>
    parseServiceAccountKey(serviceAccountPemFromDer(validDer.subarray(0, 3))),
  ).toThrow('Truncated private key.');
  expect(() =>
    parseServiceAccountKey(
      serviceAccountPemFromDer(
        Buffer.concat([
          validDer.subarray(0, 1),
          Buffer.from([0x80]),
          validDer.subarray(2),
        ]),
      ),
    ),
  ).toThrow('Invalid private key length.');
});

test('rs256Sign produces a signature verifiable by a standard RSA verifier', () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const signingInput = 'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0';

  const signature = rs256Sign(signingInput, String(privatePem));
  const verifier = createVerify('RSA-SHA256');
  verifier.update(signingInput);

  expect(
    verifier.verify(publicKey, Buffer.from(base64UrlDecode(signature))),
  ).toBe(true);
});

test('parseServiceAccountKey rejects a malformed private key', () => {
  expect(() =>
    parseServiceAccountKey(
      '-----BEGIN PRIVATE KEY-----\nnope\n-----END PRIVATE KEY-----',
    ),
  ).toThrow('private key');
});
