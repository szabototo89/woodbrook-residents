import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test } from 'vitest';

import { siteWidgetExtensions } from './extensions';

const thumbnailDirectory = resolve(process.cwd(), '../juliet-rose-app/public');

function thumbnailName(thumbnailUrl: string): string {
  const name = thumbnailUrl.split('/').at(-1);
  if (!name) {
    throw new Error(`Invalid thumbnail URL: ${thumbnailUrl}`);
  }
  return name;
}

function pngDimensions(contents: Buffer): Readonly<{
  width: number;
  height: number;
}> {
  expect(contents.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  return {
    width: contents.readUInt32BE(16),
    height: contents.readUInt32BE(20),
  };
}

test('every widget preset has a full-width, distinct selector preview', () => {
  const hashes = new Set<string>();

  for (const extension of siteWidgetExtensions) {
    const thumbnailUrl = extension.presets[0]?.thumbnailUrl;
    expect(thumbnailUrl, extension.name).toBeDefined();

    const contents = readFileSync(
      resolve(thumbnailDirectory, thumbnailName(thumbnailUrl ?? '')),
    );
    const dimensions = pngDimensions(contents);

    expect(dimensions, extension.name).toEqual({ width: 1000, height: 400 });
    expect(contents.byteLength, extension.name).toBeGreaterThan(20_000);
    hashes.add(createHash('sha256').update(contents).digest('hex'));
  }

  expect(hashes.size).toBe(siteWidgetExtensions.length);
});
