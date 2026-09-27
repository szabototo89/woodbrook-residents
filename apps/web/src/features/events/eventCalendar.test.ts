import { expect, test } from 'vitest';

import type { CommunityEvent } from '../content/contentTypes';
import { buildEventCalendar, eventCalendarFileName } from './eventCalendar';

const event: CommunityEvent = {
  documentId: 'event-123',
  title: 'Community clean-up, Woodbrook',
  slug: 'community-clean-up',
  summary: 'Meet neighbours; bags provided.',
  startsAt: '2026-10-17T08:00:00.000Z',
  endsAt: '2026-10-17T10:30:00.000Z',
  location: 'Woodbrook, Shankill',
  bookingUrl: 'https://example.com/book',
  sourceUrl: 'https://example.com/event',
  sourceReviewedOn: '2026-09-05',
  featured: false,
};

test('builds a static calendar file with UTC dates and escaped text', () => {
  const calendar = buildEventCalendar(
    event,
    new Date('2026-09-06T12:34:56.000Z'),
  );

  expect(calendar).toContain('DTSTAMP:20260906T123456Z');
  expect(calendar).toContain('DTSTART:20261017T080000Z');
  expect(calendar).toContain('DTEND:20261017T103000Z');
  expect(calendar).toContain('SUMMARY:Community clean-up\\, Woodbrook');
  expect(calendar).toContain('Meet neighbours\\; bags provided.\\n');
  expect(calendar).toContain('LOCATION:Woodbrook\\, Shankill');
  expect(calendar).toContain('PRODID:-//Woodbrook Residents//Events//EN');
  expect(calendar).toContain('UID:event-123@woodbrook-residents');
  expect(calendar.endsWith('\r\n')).toBe(true);
});

test('omits the end date when the event has no end time', () => {
  const calendar = buildEventCalendar({ ...event, endsAt: undefined });

  expect(calendar).toContain('DTSTART:20261017T080000Z');
  expect(calendar).not.toContain('DTEND:');
});

test('names the static calendar file after the event slug', () => {
  expect(eventCalendarFileName(event)).toBe('community-clean-up.ics');
});
