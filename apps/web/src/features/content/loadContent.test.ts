import { describe, expect, it } from 'vitest';

import { loadContent } from './loadContent';

describe('loadContent', () => {
  it('returns content from the selected source', async () => {
    await expect(
      loadContent(async () => ['published'], [], true),
    ).resolves.toEqual(['published']);
  });

  it('uses the unavailable fallback for a dynamic server build', async () => {
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

  it('fails a static build when required content cannot load', async () => {
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
});
