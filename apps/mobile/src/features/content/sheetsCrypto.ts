const range = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index);

export function utf8Bytes(text: string): Uint8Array {
  const bytes = Array.from(text).flatMap((character) => {
    const code = character.codePointAt(0) ?? 0;
    if (code < 0x80) return [code];
    if (code < 0x800) return [0xc0 | (code >> 6), 0x80 | (code & 0x3f)];
    if (code < 0x10000) {
      return [
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      ];
    }
    return [
      0xf0 | (code >> 18),
      0x80 | ((code >> 12) & 0x3f),
      0x80 | ((code >> 6) & 0x3f),
      0x80 | (code & 0x3f),
    ];
  });
  return Uint8Array.from(bytes);
}

const base64Alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Char(index: number): string {
  return base64Alphabet[index] ?? '';
}

export function base64UrlEncode(bytes: Uint8Array): string {
  const triplets = range(Math.ceil(bytes.length / 3)).map((group) => {
    const first = bytes[group * 3] ?? 0;
    const second = bytes[group * 3 + 1] ?? 0;
    const third = bytes[group * 3 + 2] ?? 0;
    const triplet = (first << 16) | (second << 8) | third;
    return (
      base64Char((triplet >> 18) & 0x3f) +
      base64Char((triplet >> 12) & 0x3f) +
      (group * 3 + 1 < bytes.length ? base64Char((triplet >> 6) & 0x3f) : '') +
      (group * 3 + 2 < bytes.length ? base64Char(triplet & 0x3f) : '')
    );
  });
  return triplets.join('').replace(/\+/g, '-').replace(/\//g, '_');
}

export function base64UrlDecode(text: string): Uint8Array {
  const clean = text.replace(/=+$/, '');
  if (clean.length % 4 === 1) throw new Error('Invalid base64url input.');
  const values = Array.from(clean, (character) => {
    const value = base64Alphabet.indexOf(
      character === '-' ? '+' : character === '_' ? '/' : character,
    );
    if (value < 0) throw new Error('Invalid base64url input.');
    return value;
  });
  const byteCount = Math.floor((values.length * 6) / 8);
  return Uint8Array.from(
    range(byteCount).map((index) => {
      const bit = index * 8;
      const position = Math.floor(bit / 6);
      const first = values[position] ?? 0;
      const second = values[position + 1] ?? 0;
      const combined = (first << 6) | second;
      return (combined >> (12 - (bit % 6) - 8)) & 0xff;
    }),
  );
}

const sha256Constants = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotateRight(value: number, bits: number) {
  return (value >>> bits) | (value << (32 - bits));
}

function shaSmallSigma(
  words: readonly number[],
  index: number,
  offset: number,
) {
  const word = words[index] ?? 0;
  if (offset === 0) {
    return rotateRight(word, 7) ^ rotateRight(word, 18) ^ (word >>> 3);
  }
  return rotateRight(word, 17) ^ rotateRight(word, 19) ^ (word >>> 10);
}

function shaSchedule(block: Uint8Array): readonly number[] {
  const view = new DataView(block.buffer);
  const firstWords: readonly number[] = range(16).map((index) =>
    view.getUint32(index * 4),
  );
  return range(48).reduce<readonly number[]>((words, round) => {
    const index = round + 16;
    const extended =
      ((words[index - 16] ?? 0) +
        shaSmallSigma(words, index - 15, 0) +
        (words[index - 7] ?? 0) +
        shaSmallSigma(words, index - 2, 1)) |
      0;
    return [...words, extended];
  }, firstWords);
}

function shaCompress(
  state: readonly number[],
  word: number,
  constant: number,
): readonly number[] {
  const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0] = state;
  const bigS1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
  const choice = (e & f) ^ (~e & g);
  const temp1 = (h + bigS1 + choice + constant + word) | 0;
  const bigS0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
  const majority = (a & b) ^ (a & c) ^ (b & c);
  const temp2 = (bigS0 + majority) | 0;
  return [(temp1 + temp2) | 0, a, b, c, (d + temp1) | 0, e, f, g];
}

function shaBlock(
  hash: readonly number[],
  schedule: readonly number[],
): readonly number[] {
  const compressed = range(64).reduce<readonly number[]>(
    (state, round) =>
      shaCompress(state, schedule[round] ?? 0, sha256Constants[round] ?? 0),
    hash,
  );
  return hash.map((word, index) => (word + (compressed[index] ?? 0)) | 0);
}

function shaPadded(message: Uint8Array): Uint8Array {
  const bitLength = message.length * 8;
  const paddedLength = (((message.length + 8) >> 6) + 1) << 6;
  const padded = new Uint8Array(paddedLength);
  padded.set(message);
  padded.set([0x80], message.length);
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 4, bitLength >>> 0);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
  return padded;
}

const initialShaHash: readonly number[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
];

export function sha256(message: Uint8Array): Uint8Array {
  const padded = shaPadded(message);
  const hash = range(padded.length / 64).reduce<readonly number[]>(
    (current, block) =>
      shaBlock(current, shaSchedule(padded.slice(block * 64, block * 64 + 64))),
    initialShaHash,
  );
  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  range(hash.length).map((index) =>
    digestView.setUint32(index * 4, (hash[index] ?? 0) >>> 0),
  );
  return digest;
}

type DerCursor = { readonly bytes: Uint8Array; readonly offset: number };

type SizedBlock = { readonly block: Uint8Array; readonly next: number };

function readLength(cursor: DerCursor): SizedBlock & { length: number } {
  const first = cursor.bytes[cursor.offset];
  if (first === undefined) throw new Error('Truncated private key.');
  if (first < 0x80) {
    return {
      block: new Uint8Array(),
      next: cursor.offset + 1,
      length: first,
    };
  }
  const count = first & 0x7f;
  if (count === 0 || count > 4) throw new Error('Invalid private key length.');
  const length = range(count).reduce((total, position) => {
    const byte = cursor.bytes[cursor.offset + 1 + position];
    if (byte === undefined) throw new Error('Truncated private key.');
    return total * 256 + byte;
  }, 0);
  return { block: new Uint8Array(), next: cursor.offset + 1 + count, length };
}

function readBlock(
  bytes: Uint8Array,
  offset: number,
  expectedTag: number,
): SizedBlock {
  const tag = bytes[offset];
  if (tag === undefined) throw new Error('Truncated private key.');
  if (tag !== expectedTag) throw new Error('Unexpected private key structure.');
  const sized = readLength({ bytes, offset: offset + 1 });
  const end = sized.next + sized.length;
  if (end > bytes.length) throw new Error('Truncated private key.');
  return { block: bytes.slice(sized.next, end), next: end };
}

function integerToBigInt(bytes: Uint8Array): bigint {
  return Array.from(bytes).reduce(
    (value, byte) => (value << BigInt(8)) + BigInt(byte),
    BigInt(0),
  );
}

export type RsaPrivateKey = {
  modulus: bigint;
  privateExponent: bigint;
};

export function parseServiceAccountKey(pem: string): RsaPrivateKey {
  const body = pem
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  try {
    const sequence = readBlock(base64UrlDecode(body), 0, 0x30).block;
    const versioned = readBlock(sequence, 0, 0x02);
    const algorithed = readBlock(sequence, versioned.next, 0x30);
    const inner = readBlock(sequence, algorithed.next, 0x04).block;
    const keyed = readBlock(inner, 0, 0x30).block;
    const versionSkipped = readBlock(keyed, 0, 0x02);
    const modulus = readBlock(keyed, versionSkipped.next, 0x02);
    const exponentSkipped = readBlock(keyed, modulus.next, 0x02);
    const privateExponent = readBlock(keyed, exponentSkipped.next, 0x02);
    return {
      modulus: integerToBigInt(modulus.block),
      privateExponent: integerToBigInt(privateExponent.block),
    };
  } catch (error) {
    throw new Error(
      `Invalid service-account private key: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

const sha256DigestInfoPrefix = Uint8Array.from([
  0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04,
  0x02, 0x01, 0x05, 0x00, 0x04, 0x20,
]);

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  const bits = Array.from(exponent.toString(2));
  return bits.reduce((result, bit) => {
    const squared = (result * result) % modulus;
    return bit === '1' ? (squared * (base % modulus)) % modulus : squared;
  }, BigInt(1));
}

function bigIntToBytes(value: bigint, length: number): Uint8Array {
  return Uint8Array.from(
    range(length).map((index) =>
      Number((value >> BigInt(8 * (length - 1 - index))) & BigInt(255)),
    ),
  );
}

export function rs256Sign(signingInput: string, privateKeyPem: string): string {
  const key = parseServiceAccountKey(privateKeyPem);
  const hash = sha256(utf8Bytes(signingInput));
  const modulusLength = Math.ceil(key.modulus.toString(2).length / 8);
  const paddingLength =
    modulusLength - sha256DigestInfoPrefix.length - hash.length - 3;
  if (paddingLength < 8) throw new Error('RSA modulus is too small.');
  const padded = Uint8Array.from([
    0x00,
    0x01,
    ...new Array<number>(paddingLength).fill(0xff),
    0x00,
    ...sha256DigestInfoPrefix,
    ...hash,
  ]);
  const signature = modPow(
    integerToBigInt(padded),
    key.privateExponent,
    key.modulus,
  );
  return base64UrlEncode(bigIntToBytes(signature, modulusLength));
}
