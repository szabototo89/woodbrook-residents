import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrFeaturedGridElement from './jr-featured-grid';

const TEST_TAG = 'jr-featured-grid-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrFeaturedGridElement);
}

function mountGrid() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-featured-grid element renders preview treatments without attributes', () => {
  const element = mountGrid();

  expect(element.textContent).toContain('Featured treatments');
  expect(element.textContent).toContain('Juliet Rose Signature Facial');
});

test('jr-featured-grid element maps kebab-case attributes to widget props', () => {
  const element = mountGrid();

  act(() => {
    element.setAttribute('featured-slugs', 'swedish-massage');
  });

  expect(element.textContent).toContain('Swedish massage');
  expect(element.textContent).not.toContain('Microneedling');
});
