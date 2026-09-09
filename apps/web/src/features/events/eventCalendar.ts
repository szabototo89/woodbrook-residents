import type { CommunityEvent } from '../content/contentTypes';

function formatCalendarDate(value: string | Date) {
  return new Date(value)
    .toISOString()
    .replaceAll('-', '')
    .replaceAll(':', '')
    .replace(/\.\d{3}/, '');
}

function escapeCalendarText(value: string) {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('\r\n', '\\n')
    .replaceAll('\n', '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;');
}

export function buildEventCalendar(
  event: CommunityEvent,
  createdAt: string | Date = `${event.sourceReviewedOn}T00:00:00.000Z`,
) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Woodbrook Residents//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.documentId}@woodbrook-residents`,
    `DTSTAMP:${formatCalendarDate(createdAt)}`,
    `DTSTART:${formatCalendarDate(event.startsAt)}`,
  ];

  if (event.endsAt) {
    lines.push(`DTEND:${formatCalendarDate(event.endsAt)}`);
  }

  lines.push(
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(`${event.summary}\nMore information: ${event.sourceUrl}`)}`,
    `LOCATION:${escapeCalendarText(event.location)}`,
    `URL:${event.sourceUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  );

  return `${lines.join('\r\n')}\r\n`;
}

export function createEventCalendarDataUri(event: CommunityEvent) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildEventCalendar(event))}`;
}

export function createGoogleMapsUrl(location: string) {
  const search = new URLSearchParams({ api: '1', query: location });
  return `https://www.google.com/maps/search/?${search.toString()}`;
}
