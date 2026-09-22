import { afterEach, expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import BookingPolicyFixture from './BookingPolicy.fixture';

afterEach(() => {
  window.location.hash = '';
});

test('booking policy fixture reveals the policy via :target', () => {
  const view = renderUi(BookingPolicyFixture);

  const section = view.container.querySelector('#booking-policy');
  expect(section).not.toBeNull();
  expect(document.querySelector(':target')?.id).toBe('booking-policy');
  expect(section?.textContent).toContain('Booking policy');
  view.unmount();
});
