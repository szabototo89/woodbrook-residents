import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrSiteHeaderElement from './jr-site-header';

const TEST_TAG = 'jr-site-header-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrSiteHeaderElement);
}

function mountHeader() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-site-header element renders the navigation without attributes', () => {
  const element = mountHeader();

  expect(element.textContent).toContain('Juliet Rose');
  expect(element.textContent).toContain('Treatments');
  expect(element.textContent).toContain('Book an appointment');
});

test('jr-site-header element maps kebab-case attributes to widget props', () => {
  const element = mountHeader();

  act(() => {
    element.setAttribute('booking-label', 'Reserve your visit');
  });

  expect(element.textContent).toContain('Reserve your visit');
});
