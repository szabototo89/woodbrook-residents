import type { ATCBInputConfig } from 'add-to-calendar-button';

import type { CommunityEvent } from '../content/contentTypes';

const CALENDAR_TIME_ZONE = 'Europe/Dublin';

// The Apple entry is only a native handoff on Apple devices. Everywhere else
// it is the same .ics file download as the generic iCal entry, so desktop and
// non-iOS mobile lists offer the honestly labelled iCal entry instead.
const DESKTOP_OPTIONS = ['google', 'outlookcom', 'ms365', 'ical'];
const IOS_OPTIONS = ['apple', 'google', 'outlookcom', 'ms365', 'ical'];
const MOBILE_OPTIONS = ['google', 'outlookcom', 'ms365', 'ical'];

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
  siteUrl: string,
): ATCBInputConfig {
  // The library only accepts an explicit ics file over https. On any other
  // origin the entry is omitted so the button falls back to dynamic
  // generation instead of failing validation outright.
  const icsFile = siteUrl.startsWith('https://')
    ? `${siteUrl}/ics/${event.slug}.ics`
    : undefined;

  return {
    name: event.title,
    description: `${event.summary}[br][br][url]${event.sourceUrl}|More information[/url]`,
    startDate: formatDatePart(event.startsAt),
    startTime: formatTimePart(event.startsAt),
    endDate: event.endsAt ? formatDatePart(event.endsAt) : undefined,
    endTime: event.endsAt ? formatTimePart(event.endsAt) : undefined,
    timeZone: CALENDAR_TIME_ZONE,
    location: event.location,
    options: DESKTOP_OPTIONS,
    optionsIOS: IOS_OPTIONS,
    optionsMobile: MOBILE_OPTIONS,
    icsFile,
    iCalFileName: event.slug,
    uid: `${event.documentId}@woodbrook-residents`,
    icsUrl: event.sourceUrl,
    listStyle: 'modal',
    trigger: 'click',
  };
}
