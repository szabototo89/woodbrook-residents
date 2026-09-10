import type { CommunityEvent } from '../content/contentTypes';

const DUBLIN_TIME_ZONE = 'Europe/Dublin';
const MILLISECONDS_PER_DAY = 86_400_000;

export type EventTimelinePeriod =
  'this-week' | 'next-week' | 'later' | 'earlier';

export type EventTimelineGroup = {
  id: EventTimelinePeriod;
  title: string;
  dateRange: string;
  events: CommunityEvent[];
};

function getDublinDayNumber(value: string | Date) {
  const parts = new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: DUBLIN_TIME_ZONE,
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return (
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
    ) / MILLISECONDS_PER_DAY
  );
}

function startOfWeek(dayNumber: number) {
  const dayOfWeek = new Date(dayNumber * MILLISECONDS_PER_DAY).getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;

  return dayNumber - daysSinceMonday;
}

function formatDay(dayNumber: number, includeMonth = true) {
  return new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    ...(includeMonth ? { month: 'short' as const } : {}),
    timeZone: 'UTC',
  }).format(new Date(dayNumber * MILLISECONDS_PER_DAY));
}

function formatWeekRange(startDay: number) {
  const endDay = startDay + 6;
  const startMonth = new Date(startDay * MILLISECONDS_PER_DAY).getUTCMonth();
  const endMonth = new Date(endDay * MILLISECONDS_PER_DAY).getUTCMonth();

  return `${formatDay(startDay, startMonth !== endMonth)}–${formatDay(endDay)}`;
}

export function groupEventsByTimeline(
  events: CommunityEvent[],
  now: string | Date = new Date(),
): EventTimelineGroup[] {
  const thisWeekStarts = startOfWeek(getDublinDayNumber(now));
  const nextWeekStarts = thisWeekStarts + 7;
  const laterStarts = nextWeekStarts + 7;
  const groups: EventTimelineGroup[] = [
    {
      id: 'this-week',
      title: 'This week',
      dateRange: formatWeekRange(thisWeekStarts),
      events: [],
    },
    {
      id: 'next-week',
      title: 'Next week',
      dateRange: formatWeekRange(nextWeekStarts),
      events: [],
    },
    {
      id: 'later',
      title: 'Later',
      dateRange: `From ${formatDay(laterStarts)}`,
      events: [],
    },
    {
      id: 'earlier',
      title: 'Earlier dates',
      dateRange: `Before ${formatDay(thisWeekStarts)}`,
      events: [],
    },
  ];

  for (const event of events) {
    const eventDay = getDublinDayNumber(event.startsAt);
    const groupIndex =
      eventDay < thisWeekStarts
        ? 3
        : eventDay < nextWeekStarts
          ? 0
          : eventDay < laterStarts
            ? 1
            : 2;
    groups[groupIndex].events.push(event);
  }

  return groups.filter((group) => group.events.length > 0);
}
