import { expect, test } from 'vitest';

import type { CommunityEvent } from '../content/contentTypes';
import { buildAddToCalendarConfig } from './addToCalendarConfig';

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

test('builds an add-to-calendar-button config with Dublin local time', () => {
  const config = buildAddToCalendarConfig(event);

  expect(config.name).toBe('Community clean-up, Woodbrook');
  // 08:00Z in October is 09:00 in Europe/Dublin (IST, UTC+1).
  expect(config.startDate).toBe('2026-10-17');
  expect(config.startTime).toBe('09:00');
  expect(config.endDate).toBe('2026-10-17');
  expect(config.endTime).toBe('11:30');
  expect(config.timeZone).toBe('Europe/Dublin');
});

test('offers platform-specific calendar options with a modal list', () => {
  const config = buildAddToCalendarConfig(event);

  // Desktop browsers get the generic iCal file entry: on desktop the Apple
  // choice is the same file download with a misleading label.
  expect(config.options).toEqual(['google', 'outlookcom', 'ms365', 'ical']);
  // iOS keeps the native Apple entry, which hands the event to Calendar.
  expect(config.optionsIOS).toEqual([
    'apple',
    'google',
    'outlookcom',
    'ms365',
    'ical',
  ]);
  // Android and other mobile devices have no Apple Calendar to hand off to.
  expect(config.optionsMobile).toEqual([
    'google',
    'outlookcom',
    'ms365',
    'ical',
  ]);
  expect(config.listStyle).toBe('modal');
  expect(config.trigger).toBe('click');
});

test('carries event identity, location, and source link', () => {
  const config = buildAddToCalendarConfig(event);

  expect(config.location).toBe('Woodbrook, Shankill');
  expect(config.uid).toBe('event-123@woodbrook-residents');
  expect(config.iCalFileName).toBe('community-clean-up');
  expect(config.description).toContain('Meet neighbours; bags provided.');
  expect(config.description).toContain('https://example.com/event');
  expect(config.icsUrl).toBe('https://example.com/event');
});

test('omits the end date when the event has no end time', () => {
  const config = buildAddToCalendarConfig({ ...event, endsAt: undefined });

  expect(config.startDate).toBe('2026-10-17');
  expect(config.endDate).toBeUndefined();
  expect(config.endTime).toBeUndefined();
});
