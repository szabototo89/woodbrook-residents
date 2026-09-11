import { expect, test } from 'vitest';

import { createGoogleMapsUrl } from '../../components/GoogleMapsLink';
import type { CommunityEvent } from '../content/contentTypes';
import {
  buildEventCalendar,
  createEventCalendarDataUri,
} from './eventCalendar';

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
};

test('event calendar actions creates an importable calendar event with UTC dates and escaped text', () => {
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

test('event calendar actions omits the end date when the event has no end time', () => {
  const calendar = buildEventCalendar({ ...event, endsAt: undefined });

  expect(calendar).toContain('DTSTART:20261017T080000Z');
  expect(calendar).not.toContain('DTEND:');
});

test('event calendar actions exposes the event as a calendar data URI', () => {
  const dataUri = createEventCalendarDataUri(event);

  expect(dataUri).toMatch(/^data:text\/calendar;charset=utf-8,/);
  expect(decodeURIComponent(dataUri)).toContain(
    'SUMMARY:Community clean-up\\, Woodbrook',
  );
});

test('event calendar actions builds a Google Maps search URL for the event location', () => {
  expect(createGoogleMapsUrl(event.location)).toBe(
    'https://www.google.com/maps/search/?api=1&query=Woodbrook%2C+Shankill',
  );
});
