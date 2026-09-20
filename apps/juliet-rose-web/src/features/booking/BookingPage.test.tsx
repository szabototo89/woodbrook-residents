import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { BookingPage } from './BookingPage';

test('introduces the booking journey with the shared editorial header', () => {
  const markup = renderToStaticMarkup(
    <BookingPage initialTreatmentSlug="swedish-massage" />,
  );

  expect(markup).toContain('class="editorial-page-hero"');
  expect(markup).toContain('class="booking-hero-title-line">Request an</span>');
  expect(markup).toContain(
    'class="booking-hero-title-line">appointment</span>',
  );
  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('Professional &amp; friendly care');
  expect(markup).toContain('Relaxing environment');
  expect(markup).toContain('Tailored to your needs');
  expect(markup).toContain('Your booking');
  expect(markup).toContain('lucide-calendar-days');
});

test('renders the booking calendar for the provided today snapshot', () => {
  const markup = renderToStaticMarkup(
    <BookingPage
      initialTreatmentSlug="swedish-massage"
      today={new Date(2026, 9, 15)}
    />,
  );

  expect(markup).toContain('>October 2026</span>');
});
