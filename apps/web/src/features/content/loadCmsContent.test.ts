import { describe, expect, it } from 'vitest';

import { loadCmsContent } from './loadCmsContent';

describe('loadCmsContent', () => {
  it('returns the loaded CMS content', async () => {
    await expect(
      loadCmsContent(async () => ['published'], [], true),
    ).resolves.toEqual(['published']);
  });

  it('uses the unavailable fallback for a dynamic server build', async () => {
    await expect(
      loadCmsContent(
        async () => {
          throw new Error('offline');
        },
        { availability: 'unavailable' },
        false,
      ),
    ).resolves.toEqual({ availability: 'unavailable' });
  });

  it('fails a static build when required CMS content cannot load', async () => {
    await expect(
      loadCmsContent(
        async () => {
          throw new Error('offline');
        },
        undefined,
        true,
      ),
    ).rejects.toThrow(
      'Static site build could not load required content from Strapi.',
    );
  });
});
