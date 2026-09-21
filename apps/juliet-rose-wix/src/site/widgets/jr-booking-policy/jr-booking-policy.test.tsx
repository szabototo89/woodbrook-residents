import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrBookingPolicyElement from './jr-booking-policy';

const TEST_TAG = 'jr-booking-policy-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrBookingPolicyElement);
}

function mountPolicy() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-booking-policy element renders the policy content without attributes', () => {
  const element = mountPolicy();

  expect(element.textContent).toContain('Booking policy');
  expect(
    element.querySelector('a[href="https://www.julietrosebeauty.com/"]'),
  ).not.toBeNull();
});

test('jr-booking-policy element maps kebab-case attributes to widget props', () => {
  const element = mountPolicy();

  act(() => {
    element.setAttribute('title', 'Custom policy title');
  });

  expect(element.textContent).toContain('Custom policy title');
});
