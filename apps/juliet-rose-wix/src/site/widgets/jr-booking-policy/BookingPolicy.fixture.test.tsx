import { afterEach, expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import BookingPolicyFixture from './BookingPolicy.fixture';

afterEach(() => {
  window.location.hash = '';
});

test('booking policy fixture renders the policy visibly without touching the URL hash', () => {
  const view = renderUi(BookingPolicyFixture);

  const section = view.container.querySelector<HTMLElement>('#booking-policy');
  expect(section).not.toBeNull();
  expect(section?.textContent).toContain('Booking policy');
  expect(section ? getComputedStyle(section).display : 'none').toBe('grid');
  expect(window.location.hash).toBe('');
  view.unmount();
});
