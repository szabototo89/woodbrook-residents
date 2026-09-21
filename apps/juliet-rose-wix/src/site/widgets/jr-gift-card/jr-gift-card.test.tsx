import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrGiftCardElement from './jr-gift-card';

const TEST_TAG = 'jr-gift-card-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrGiftCardElement);
}

function mountCard() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-gift-card element renders the gift content without attributes', () => {
  const element = mountCard();

  expect(element.textContent).toContain('The perfect gift');
  expect(element.querySelector('a[href="/gift-cards"]')).not.toBeNull();
});

test('jr-gift-card element maps kebab-case attributes to widget props', () => {
  const element = mountCard();

  act(() => {
    element.setAttribute('title', 'Custom gift title');
    element.setAttribute('card-url', 'https://example.com/gift');
  });

  expect(element.textContent).toContain('Custom gift title');
  expect(
    element.querySelector('a[href="https://example.com/gift"]'),
  ).not.toBeNull();
});
