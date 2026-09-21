import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrHeroElement from './jr-hero';

const TEST_TAG = 'jr-hero-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrHeroElement);
}

function mountHero() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-hero element renders default studio copy without attributes', () => {
  const element = mountHero();

  expect(element.textContent).toContain('Relax and Revitalize');
  expect(element.textContent).toContain(
    'Beauty treatments in Stillorgan, South Dublin.',
  );
  expect(element.querySelector('a[href="/book"]')?.textContent).toContain(
    'Book an appointment',
  );
});

test('jr-hero element maps kebab-case attributes to widget props', () => {
  const element = mountHero();

  act(() => {
    element.setAttribute('title', 'Custom title');
    element.setAttribute('booking-url', '/custom-book');
  });

  expect(element.querySelector('h1')?.textContent).toBe('Custom title');
  expect(element.querySelector('a[href="/custom-book"]')).not.toBeNull();
});
