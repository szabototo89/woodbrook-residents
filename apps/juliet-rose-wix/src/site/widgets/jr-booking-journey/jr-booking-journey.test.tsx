import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrBookingJourneyElement from './jr-booking-journey';

const TEST_TAG = 'jr-booking-journey-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrBookingJourneyElement);
}

function mountJourney() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-booking-journey element renders the mock flow without attributes', () => {
  const element = mountJourney();

  expect(element.textContent).toContain('Request an');
  expect(element.textContent).toContain('Choose a treatment');
  expect(element.textContent).toContain('Swedish massage');
});

test('jr-booking-journey element maps kebab-case attributes to widget props', () => {
  const element = mountJourney();

  act(() => {
    element.setAttribute('initial-service', 'microneedling');
  });

  expect(element.textContent).toContain('60 minutes · €130');
});
