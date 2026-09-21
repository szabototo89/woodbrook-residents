import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrTreatmentCatalogElement from './jr-treatment-catalog';

const TEST_TAG = 'jr-treatment-catalog-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrTreatmentCatalogElement);
}

function mountCatalog() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-treatment-catalog element renders preview sections without attributes', () => {
  const element = mountCatalog();

  expect(element.querySelector('section[id="massage"]')).not.toBeNull();
  expect(element.textContent).toContain('Swedish massage');
});

test('jr-treatment-catalog element maps kebab-case attributes to widget props', () => {
  const element = mountCatalog();

  act(() => {
    element.setAttribute('booking-base-url', '/custom-book');
  });

  expect(
    element
      .querySelector('a[aria-label="Book Swedish massage"]')
      ?.getAttribute('href'),
  ).toBe('/custom-book?service=swedish-massage');
});
