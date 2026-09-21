import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { BookingPolicy } from './BookingPolicy';

test('booking policy renders the default policy content', () => {
  const view = renderUi(<BookingPolicy />);

  const section = view.container.querySelector('section[id="booking-policy"]');
  expect(section?.getAttribute('aria-labelledby')).toBe('policy-heading');
  expect(section?.textContent).toContain('Before your appointment');
  expect(section?.textContent).toContain('Booking policy');
  expect(section?.textContent).toContain('at least 24 hours’ notice');
  expect(
    section?.querySelector('a[href="https://www.julietrosebeauty.com/"]')
      ?.textContent,
  ).toContain('Read the full policy');
  view.unmount();
});

test('booking policy honours widget properties', () => {
  const view = renderUi(
    <BookingPolicy
      title="Custom policy title"
      fullUrl="https://example.com/policy"
      fullLabel="Custom policy label"
    />,
  );

  expect(view.container.textContent).toContain('Custom policy title');
  expect(
    view.container.querySelector('a[href="https://example.com/policy"]')
      ?.textContent,
  ).toContain('Custom policy label');
  view.unmount();
});
