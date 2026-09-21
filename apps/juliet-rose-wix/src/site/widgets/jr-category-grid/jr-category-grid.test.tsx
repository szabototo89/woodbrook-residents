import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrCategoryGridElement from './jr-category-grid';

const TEST_TAG = 'jr-category-grid-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrCategoryGridElement);
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

test('jr-category-grid element renders category cards without attributes', () => {
  const element = mountGrid();

  expect(element.textContent).toContain('Find the right treatment for you');
  expect(element.textContent).toContain('Facials & skin');
  expect(element.querySelector('a[href="/treatments#massage"]')).not.toBeNull();
});

test('jr-category-grid element maps kebab-case attributes to widget props', () => {
  const element = mountGrid();

  act(() => {
    element.setAttribute('view-all-href', '/custom-treatments');
  });

  expect(element.querySelector('a[href="/custom-treatments"]')).not.toBeNull();
});
