import { beforeEach, expect, test, vi } from 'vitest';

import { createContentSource } from './contentSourceFactory';
import {
  createContentSnapshotLoader,
  getContentSnapshot,
  loadContentSnapshot,
  resetContentSnapshotForTests,
} from './contentSnapshot';
import type { ContentSource } from './contentSource';

vi.mock('./contentSourceFactory', () => ({
  createContentSource: vi.fn(),
}));

const emptySnapshot = {
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

const stubSource = (
  loadSnapshot: () => Promise<typeof emptySnapshot>,
): ContentSource => ({
  name: 'strapi',
  loadSnapshot,
});

beforeEach(() => {
  resetContentSnapshotForTests();
  vi.mocked(createContentSource).mockReset();
});

test('createContentSnapshotLoader loads and validates a source only once', async () => {
  const loadSnapshot = vi.fn().mockResolvedValue({
    updates: [],
    projects: [],
    events: [],
    surveys: [],
    resources: [],
  });
  const source: ContentSource = { name: 'strapi', loadSnapshot };
  const load = createContentSnapshotLoader(source);

  const [first, second] = await Promise.all([load(), load()]);

  expect(first).toBe(second);
  expect(loadSnapshot).toHaveBeenCalledTimes(1);
});

test('createContentSnapshotLoader can reload content outside a static build', async () => {
  const loadSnapshot = vi.fn().mockResolvedValue({
    updates: [],
    projects: [],
    events: [],
    surveys: [],
    resources: [],
  });
  const source: ContentSource = { name: 'strapi', loadSnapshot };

  await loadContentSnapshot(source);
  await loadContentSnapshot(source);

  expect(loadSnapshot).toHaveBeenCalledTimes(2);
});

test('getContentSnapshot loads fresh content on every call without caching', async () => {
  const loadSnapshot = vi.fn().mockResolvedValue({ ...emptySnapshot });
  vi.mocked(createContentSource).mockReturnValue(stubSource(loadSnapshot));

  const first = await getContentSnapshot(false);
  const second = await getContentSnapshot(false);

  expect(first).toEqual(emptySnapshot);
  expect(second).toEqual(emptySnapshot);
  expect(createContentSource).toHaveBeenCalledTimes(2);
  expect(loadSnapshot).toHaveBeenCalledTimes(2);
});

test('getContentSnapshot shares one cached load across calls until reset', async () => {
  const loadSnapshot = vi.fn().mockResolvedValue({ ...emptySnapshot });
  vi.mocked(createContentSource).mockReturnValue(stubSource(loadSnapshot));

  const first = await getContentSnapshot(true);
  const second = await getContentSnapshot(true);

  expect(first).toBe(second);
  expect(createContentSource).toHaveBeenCalledTimes(1);
  expect(loadSnapshot).toHaveBeenCalledTimes(1);

  resetContentSnapshotForTests();
  await getContentSnapshot(true);

  expect(createContentSource).toHaveBeenCalledTimes(2);
  expect(loadSnapshot).toHaveBeenCalledTimes(2);
});
