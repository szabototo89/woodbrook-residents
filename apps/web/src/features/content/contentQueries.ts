import { getUpcomingEvents } from '../events/homeEvent';
import type { ContentSnapshot, HomeContent, SiteSetting } from './contentTypes';

export function getHomeContentFromSnapshot(
  snapshot: ContentSnapshot,
  now: string | Date = new Date(),
): HomeContent {
  return {
    availability: 'ready',
    siteSetting: snapshot.siteSetting,
    updates: getUpdatesFromSnapshot(snapshot).slice(0, 3),
    projects: snapshot.projects.slice(0, 3),
    events: getUpcomingEvents(snapshot.events, now),
    surveys: snapshot.surveys,
  };
}

export function getUpdatesFromSnapshot(snapshot: ContentSnapshot) {
  return [...snapshot.updates].sort(
    (left, right) =>
      Date.parse(right.publishedOn) - Date.parse(left.publishedOn),
  );
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
