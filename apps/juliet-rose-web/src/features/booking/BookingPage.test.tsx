import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { BookingPage } from './BookingPage';

test('introduces the booking journey with the shared editorial header', () => {
  const markup = renderToStaticMarkup(
    <BookingPage initialTreatmentSlug="swedish-massage" />,
  );

  expect(markup).toContain('class="editorial-page-hero"');
  expect(markup).toContain('Request an appointment');
  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('Pick a preferred date');
  expect(markup).toContain('Await confirmation');
  expect(markup).toContain('lucide-calendar-days');
});
