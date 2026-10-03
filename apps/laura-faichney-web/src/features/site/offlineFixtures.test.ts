import { afterEach, expect, test, vi } from 'vitest';
import { LauraSanitySource } from '../../../scripts/lauraSanitySource';
import { loadLauraSnapshot } from '../../../scripts/lauraSnapshot';
import { fixtureResponse } from '../../../tests/fixtures/site-fixtures';

afterEach(() => vi.unstubAllGlobals());

test('captures all pages from local fixtures without a network fallback', async () => {
  const fetch = vi.fn(fixtureResponse);
  vi.stubGlobal('fetch', fetch);
  const snapshot = await loadLauraSnapshot(new LauraSanitySource());
  expect(fetch).toHaveBeenCalledTimes(4);
  expect(snapshot.home.hero.titleLines.join(' ')).toContain('Brighter');
  expect(snapshot.services.services).toHaveLength(5);
  expect(
    snapshot.gallery.collections.map((collection) => collection.slug),
  ).toContain('availability-examples');
  expect(snapshot.about.storyBody).not.toBe('');
});

test('unexpected remote requests fail instead of using the network', async () => {
  await expect(
    fixtureResponse('https://example.com/unexpected'),
  ).rejects.toThrow('No local fixture');
});
