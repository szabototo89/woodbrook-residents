import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import TreatmentCardsElement from './jr-treatment-cards';

const TEST_TAG = 'jr-treatment-cards-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, TreatmentCardsElement);
}

function mountCards() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-treatment-cards element renders preview content without attributes', () => {
  const element = mountCards();

  expect(element.textContent).toContain('Find the right treatment for you');
  expect(element.textContent).toContain('Swedish massage');
  expect(element.textContent).toContain('Not sure what to choose?');
});

test('jr-treatment-cards element maps kebab-case attributes to widget props', () => {
  const element = mountCards();

  act(() => {
    element.setAttribute('display', 'catalog');
  });

  expect(element.querySelector('section[id="massage"]')).not.toBeNull();
  expect(element.querySelector('section[id="treatments"]')).toBeNull();
});
