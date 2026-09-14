import type { ContentSnapshot } from './contentTypes.js';

type FetchResponse = {
  ok: boolean;
  json(): Promise<unknown>;
};

export type FetchContent = (url: string) => Promise<FetchResponse>;

function isSnapshot(value: unknown): value is ContentSnapshot {
  if (!value || typeof value !== 'object') return false;
  return ['updates', 'projects', 'events', 'surveys', 'resources'].every(
    (key) => Array.isArray(Reflect.get(value, key)),
  );
}

export async function loadMobileContent(
  fetchContent: FetchContent = fetch,
  apiBaseUrl = __WOODBROOK_API_URL__,
) {
  const response = await fetchContent(
    `${apiBaseUrl.replace(/\/$/, '')}/api/mobile-content`,
  );
  if (!response.ok) throw new Error('Content is temporarily unavailable.');
  const content = await response.json();
  if (!isSnapshot(content))
    throw new Error('Content is temporarily unavailable.');
  return content;
}
