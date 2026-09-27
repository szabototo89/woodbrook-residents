import { expect, test } from 'vitest';

import type { CommunityEvent } from '../content/contentTypes';
import { buildAddToCalendarConfig } from './addToCalendarConfig';

const SITE_URL = 'https://woodbrook.shankill.workers.dev';
const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const SAFARI_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const CHROME_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.200 Mobile/15E148 Safari/604.1';

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

test('hides the library branding in the calendar list', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  expect(config.hideBranding).toBe(true);
});

test('themes the calendar list with Woodbrook tokens', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  expect(config.styleLight).toContain('--list-background: #fffefa');
  expect(config.styleLight).toContain('--list-text: #162e2a');
  expect(config.styleLight).toContain('--list-hover-background: #e5ece6');
  expect(config.styleLight).toContain('--list-hover-text: #173d35');
});

test('labels the file entry in plain language', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  expect(config.customLabels).toMatchObject({
    ical: 'Download calendar file (.ics)',
  });
});

test('phrases the calendar list as guided choices', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  expect(config.customLabels).toMatchObject({
    'label.addtocalendar': 'Choose where to save Community clean-up, Woodbrook',
    apple: 'Save to Apple Calendar',
    google: 'Save to Google Calendar',
    ms365: 'Save to Microsoft 365',
    outlookcom: 'Save to Outlook',
  });
});
test('builds an add-to-calendar-button config with Dublin local time', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  expect(config.name).toBe('Community clean-up, Woodbrook');
  // 08:00Z in October is 09:00 in Europe/Dublin (IST, UTC+1).
  expect(config.startDate).toBe('2026-10-17');
  expect(config.startTime).toBe('09:00');
  expect(config.endDate).toBe('2026-10-17');
  expect(config.endTime).toBe('11:30');
  expect(config.timeZone).toBe('Europe/Dublin');
});

test('offers platform-specific calendar options with a modal list', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

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

test('keeps the native Apple entry in iOS Safari', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, SAFARI_IOS_UA);

  expect(config.optionsIOS).toContain('apple');
});

test('hides Apple and iCal entries in non-Safari browsers on iOS', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, CHROME_IOS_UA);

  // Chrome and Firefox on iOS must use Safari's engine, where the Apple/iCal
  // file flow degrades to an open-in-Safari warning — and the library swaps
  // a lone iCal entry back to Apple on iOS — so both entries are hidden.
  expect(config.optionsIOS).toEqual(['google', 'outlookcom', 'ms365']);
});

test('carries event identity, location, and source link', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  expect(config.location).toBe('Woodbrook, Shankill');
  expect(config.uid).toBe('event-123@woodbrook-residents');
  expect(config.iCalFileName).toBe('community-clean-up');
  expect(config.description).toContain('Meet neighbours; bags provided.');
  expect(config.description).toContain('https://example.com/event');
  expect(config.icsUrl).toBe('https://example.com/event');
});

test('points Apple and iCal entries at a hosted static calendar file', () => {
  const config = buildAddToCalendarConfig(event, SITE_URL, DESKTOP_UA);

  // A hosted file lets iOS hand the event to Calendar directly instead of
  // showing the library's open-in-Safari warning (notably in Chrome on iOS).
  expect(config.icsFile).toBe(
    'https://woodbrook.shankill.workers.dev/ics/community-clean-up.ics',
  );
});

test('omits the static calendar file on non-https origins', () => {
  const config = buildAddToCalendarConfig(
    event,
    'http://localhost:3000',
    DESKTOP_UA,
  );

  expect(config.icsFile).toBeUndefined();
});

test('omits the end date when the event has no end time', () => {
  const config = buildAddToCalendarConfig(
    { ...event, endsAt: undefined },
    SITE_URL,
    DESKTOP_UA,
  );

  expect(config.startDate).toBe('2026-10-17');
  expect(config.endDate).toBeUndefined();
  expect(config.endTime).toBeUndefined();
});
