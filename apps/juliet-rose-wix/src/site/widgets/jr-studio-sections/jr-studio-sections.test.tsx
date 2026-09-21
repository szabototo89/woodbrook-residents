import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrStudioSectionsElement from './jr-studio-sections';

const TEST_TAG = 'jr-studio-sections-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrStudioSectionsElement);
}

function mountSections() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-studio-sections element renders gift, visit, and policy without attributes', () => {
  const element = mountSections();

  expect(element.textContent).toContain('The perfect gift');
  expect(element.textContent).toContain('Juliet Rose beauty studio');
  expect(element.textContent).toContain('Booking policy');
  expect(element.querySelector('a[href="/gift-cards"]')).not.toBeNull();
});

test('jr-studio-sections element maps kebab-case attributes to widget props', () => {
  const element = mountSections();

  act(() => {
    element.setAttribute('gift-title', 'Custom gift title');
    element.setAttribute('studio-image-url', 'https://example.com/studio.jpg');
  });

  expect(element.textContent).toContain('Custom gift title');
  expect(element.querySelector('img')?.getAttribute('src')).toBe(
    'https://example.com/studio.jpg',
  );
});
