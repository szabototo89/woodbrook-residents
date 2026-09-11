import { expect, test } from 'vitest';

import { loadContent } from './loadContent';

test('loadContent returns content from the selected source', async () => {
  await expect(
    loadContent(async () => ['published'], [], true),
  ).resolves.toEqual(['published']);
});

test('loadContent uses the unavailable fallback for a dynamic server build', async () => {
  await expect(
    loadContent(
      async () => {
        throw new Error('offline');
      },
      { availability: 'unavailable' },
      false,
    ),
  ).resolves.toEqual({ availability: 'unavailable' });
});

test('loadContent fails a static build when required content cannot load', async () => {
  await expect(
    loadContent(
      async () => {
        throw new Error('offline');
      },
      undefined,
      true,
    ),
  ).rejects.toThrow('Static site build could not load required content.');
});
