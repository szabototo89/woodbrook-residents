import { expect, test } from 'vitest';

import { jrBookingJourneyExtension } from './jr-booking-journey.extension';

test('jr-booking-journey extension registers its tag with a valid widget name', () => {
  expect(jrBookingJourneyExtension.tagName).toBe('jr-booking-journey');
  expect(jrBookingJourneyExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrBookingJourneyExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-booking-journey extension points at the element, panel, and preset thumbnail', () => {
  expect(jrBookingJourneyExtension.element).toBe(
    './site/widgets/jr-booking-journey/jr-booking-journey.tsx',
  );
  expect(jrBookingJourneyExtension.settings).toBe(
    './site/widgets/jr-booking-journey/jr-booking-journey.panel.tsx',
  );
  expect(jrBookingJourneyExtension.presets.length).toBeGreaterThan(0);
  expect(jrBookingJourneyExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
