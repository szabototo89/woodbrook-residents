import type { ATCBInputConfig } from 'add-to-calendar-button';

import type { CommunityEvent } from '../content/contentTypes';

const CALENDAR_TIME_ZONE = 'Europe/Dublin';

// Woodbrook theme for the calendar-choice modal, mapped onto the
// library's default-style variables (paper background, ink text, forest
// accents, site shadow and radius).
const CALENDAR_STYLE_LIGHT = [
  '--list-background: #fffefa',
  '--list-text: #162e2a',
  '--list-border-color: rgba(22, 46, 42, 0.14)',
  '--list-hover-background: #e5ece6',
  '--list-hover-text: #173d35',
  '--list-border-radius: 14px',
  '--list-close-background: #e5ece6',
  '--list-close-text: #4f615d',
  '--list-shadow: 0 18px 44px rgba(27, 46, 40, 0.1), 0 2px 6px -2px rgba(27, 46, 40, 0.08)',
  '--list-modal-shadow: 0 18px 44px rgba(27, 46, 40, 0.16), 0 2px 12px -2px rgba(27, 46, 40, 0.14)',
  '--accent-color: #173d35',
].join('; ');

// The Apple entry is only a native handoff on Apple devices. Everywhere else
// it is the same .ics file download as the generic iCal entry, so desktop and
// non-iOS mobile lists offer the honestly labelled iCal entry instead.
const DESKTOP_OPTIONS = ['google', 'outlookcom', 'ms365', 'ical'];
const IOS_OPTIONS = ['apple', 'google', 'outlookcom', 'ms365', 'ical'];
const MOBILE_OPTIONS = ['google', 'outlookcom', 'ms365', 'ical'];
// Chrome and Firefox on iOS get neither the Apple nor the iCal entry: the
// file flow degrades to an open-in-Safari warning there, and the library
// swaps a lone iCal entry back to Apple on iOS.
const IOS_NON_SAFARI_OPTIONS = ['google', 'outlookcom', 'ms365'];

function isIOSNonSafariBrowser(userAgent: string) {
  return /iPhone|iPad|iPod/i.test(userAgent) && /CriOS|FxiOS/i.test(userAgent);
}

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
  userAgent: string,
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
    optionsIOS: isIOSNonSafariBrowser(userAgent)
      ? IOS_NON_SAFARI_OPTIONS
      : IOS_OPTIONS,
    optionsMobile: MOBILE_OPTIONS,
    icsFile,
    iCalFileName: event.slug,
    uid: `${event.documentId}@woodbrook-residents`,
    icsUrl: event.sourceUrl,
    listStyle: 'modal',
    trigger: 'click',
    hideBranding: true,
    styleLight: CALENDAR_STYLE_LIGHT,
    customLabels: {
      'label.addtocalendar': `Choose where to save ${event.title}`,
      apple: 'Save to Apple Calendar',
      google: 'Save to Google Calendar',
      ms365: 'Save to Microsoft 365',
      outlookcom: 'Save to Outlook',
      ical: 'Download calendar file (.ics)',
    },
  };
}
