import type { ContentSource } from './contentSource';
import { validateContentSnapshot } from './contentSource';
import { createContentSource } from './contentSourceFactory';
import type { ContentSnapshot } from './contentTypes';

const sourceHolder: { current?: ContentSource } = {};
const snapshotHolder: { current?: Promise<ContentSnapshot> } = {};

export function createContentSnapshotLoader(source: ContentSource) {
  const holder: { current?: Promise<ContentSnapshot> } = {};

  return () => {
    holder.current ??= source
      .loadSnapshot()
      .then((content) => validateContentSnapshot(content, source.name));
    return holder.current;
  };
}

export async function loadContentSnapshot(source: ContentSource) {
  return validateContentSnapshot(await source.loadSnapshot(), source.name);
}

export function getContentSnapshot(cache: boolean) {
  if (!cache) {
    return loadContentSnapshot(createContentSource());
  }

  sourceHolder.current ??= createContentSource();
  snapshotHolder.current ??= createContentSnapshotLoader(
    sourceHolder.current,
  )();

  return snapshotHolder.current;
}

export function resetContentSnapshotForTests() {
  sourceHolder.current = undefined;
  snapshotHolder.current = undefined;
}
