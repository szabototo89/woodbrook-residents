import type { ContentSource } from './contentSource';
import { validateContentSnapshot } from './contentSource';
import { createContentSource } from './contentSourceFactory';
import type { ContentSnapshot } from './contentTypes';

let cachedSource: ContentSource | undefined;
let cachedSnapshot: Promise<ContentSnapshot> | undefined;

export function createContentSnapshotLoader(source: ContentSource) {
  let snapshot: Promise<ContentSnapshot> | undefined;

  return () => {
    snapshot ??= source
      .loadSnapshot()
      .then((content) => validateContentSnapshot(content, source.name));
    return snapshot;
  };
}

export async function loadContentSnapshot(source: ContentSource) {
  return validateContentSnapshot(await source.loadSnapshot(), source.name);
}

export function getContentSnapshot(cache: boolean) {
  if (!cache) {
    return loadContentSnapshot(createContentSource());
  }

  cachedSource ??= createContentSource();
  cachedSnapshot ??= createContentSnapshotLoader(cachedSource)();

  return cachedSnapshot;
}

export function resetContentSnapshotForTests() {
  cachedSource = undefined;
  cachedSnapshot = undefined;
}
