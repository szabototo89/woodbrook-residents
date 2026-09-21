import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrVisitUsElement from './jr-visit-us';

const TEST_TAG = 'jr-visit-us-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrVisitUsElement);
}

function mountVisit() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-visit-us element renders the contact content without attributes', () => {
  const element = mountVisit();

  expect(element.textContent).toContain('Juliet Rose beauty studio');
  expect(element.textContent).toContain('0852867059');
});

test('jr-visit-us element maps kebab-case attributes to widget props', () => {
  const element = mountVisit();

  act(() => {
    element.setAttribute('phone-label', '555 123 4567');
  });

  expect(element.textContent).toContain('555 123 4567');
});
