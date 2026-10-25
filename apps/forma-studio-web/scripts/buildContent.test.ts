import { expect, test, vi } from 'vitest';
import fixture from '../tests/fixtureContent';
import { loadBuildContent } from './buildContent';

test('build content stops before emitting a snapshot when Sanity is unavailable', async () => {
  await expect(
    loadBuildContent({}, vi.fn().mockRejectedValue(new Error('offline'))),
  ).rejects.toThrow('Forma content');
});
test('build content requires valid published content and strips unknown metadata', async () => {
  const content = await loadBuildContent(
    {},
    vi.fn().mockResolvedValue(Response.json({ result: fixture })),
  );
  expect(content.home.hero.title[0]).toBe('Websites that help');
});
