import { getUpcomingEvents } from '../events/homeEvent';
import type { ContentSnapshot, HomeContent, SiteSetting } from './contentTypes';

export function getHomeContentFromSnapshot(
  snapshot: ContentSnapshot,
  now: string | Date = new Date(),
): HomeContent {
  const updates = getUpdatesFromSnapshot(snapshot);
  const nowTimestamp = new Date(now).getTime();
  const featuredUpdate = updates.find(
    (update) =>
      update.featured &&
      Date.parse(update.publishedOn) <= nowTimestamp &&
      (!update.featuredUntil ||
        Date.parse(update.featuredUntil) > nowTimestamp),
  );
  return {
    availability: 'ready',
    siteSetting: snapshot.siteSetting,
    featuredUpdate,
    updates: updates
      .filter((update) => update.documentId !== featuredUpdate?.documentId)
      .slice(0, featuredUpdate ? 2 : 3),
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
