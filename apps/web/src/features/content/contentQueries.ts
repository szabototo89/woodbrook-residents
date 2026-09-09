import type { ContentSnapshot, HomeContent, SiteSetting } from './contentTypes';

export function getHomeContentFromSnapshot(
  snapshot: ContentSnapshot,
): HomeContent {
  return {
    availability: 'ready',
    siteSetting: snapshot.siteSetting,
    updates: snapshot.updates.slice(0, 3),
    projects: snapshot.projects.slice(0, 3),
    events: snapshot.events,
    surveys: snapshot.surveys,
  };
}

export function getCollection<T>(items: T[], limit = 25) {
  return items.slice(0, limit);
}

export function findBySlug<T extends { slug: string }>(
  items: T[],
  slug: string,
) {
  return items.find((item) => item.slug === slug);
}

export function getSiteSettingFromSnapshot(
  snapshot: ContentSnapshot,
): SiteSetting | undefined {
  return snapshot.siteSetting;
}
