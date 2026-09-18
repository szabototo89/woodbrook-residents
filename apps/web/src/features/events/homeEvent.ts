import type { CommunityEvent } from '../content/contentTypes';

function toTime(value: string | Date): number {
  return new Date(value).getTime();
}

export function getUpcomingEvents(
  events: CommunityEvent[],
  now: string | Date = new Date(),
): CommunityEvent[] {
  const nowTime = toTime(now);

  return [...events]
    .filter((event) => toTime(event.startsAt) >= nowTime)
    .sort((left, right) => left.startsAt.localeCompare(right.startsAt));
}

export function selectHomeEvent(
  events: CommunityEvent[],
  now: string | Date = new Date(),
): CommunityEvent | undefined {
  const upcoming = getUpcomingEvents(events, now);
  const featured = upcoming.filter((event) => event.featured);

  return (featured.length > 0 ? featured : upcoming)[0];
}
