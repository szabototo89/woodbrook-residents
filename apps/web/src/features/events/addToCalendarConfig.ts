import type { ATCBInputConfig } from 'add-to-calendar-button';

import type { CommunityEvent } from '../content/contentTypes';

const CALENDAR_TIME_ZONE = 'Europe/Dublin';

function formatDatePart(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: CALENDAR_TIME_ZONE,
  }).formatToParts(new Date(value));

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function formatTimePart(value: string) {
  const parts = new Intl.DateTimeFormat('en-IE', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: CALENDAR_TIME_ZONE,
  }).formatToParts(new Date(value));

  const hour = parts.find((part) => part.type === 'hour')?.value;
  const minute = parts.find((part) => part.type === 'minute')?.value;

  return `${hour}:${minute}`;
}

export function buildAddToCalendarConfig(
  event: CommunityEvent,
): ATCBInputConfig {
  return {
    name: event.title,
    description: `${event.summary}[br][br][url]${event.sourceUrl}|More information[/url]`,
    startDate: formatDatePart(event.startsAt),
    startTime: formatTimePart(event.startsAt),
    endDate: event.endsAt ? formatDatePart(event.endsAt) : undefined,
    endTime: event.endsAt ? formatTimePart(event.endsAt) : undefined,
    timeZone: CALENDAR_TIME_ZONE,
    location: event.location,
    options: ['apple', 'google', 'outlookcom', 'ms365', 'ical'],
    iCalFileName: event.slug,
    uid: `${event.documentId}@woodbrook-residents`,
    icsUrl: event.sourceUrl,
    listStyle: 'modal',
    trigger: 'click',
  };
}
