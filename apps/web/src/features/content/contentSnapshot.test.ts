import { describe, expect, it, vi } from 'vitest';

import {
  createContentSnapshotLoader,
  loadContentSnapshot,
} from './contentSnapshot';
import type { ContentSource } from './contentSource';

describe('createContentSnapshotLoader', () => {
  it('loads and validates a source only once', async () => {
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

  it('can reload content outside a static build', async () => {
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
});
