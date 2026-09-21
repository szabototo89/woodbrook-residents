import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrTreatmentGuidanceElement from './jr-treatment-guidance';

const TEST_TAG = 'jr-treatment-guidance-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrTreatmentGuidanceElement);
}

function mountGuidance() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-treatment-guidance element renders the call to action without attributes', () => {
  const element = mountGuidance();

  expect(element.textContent).toContain('Not sure what to choose?');
  expect(element.querySelector('a[href="/#contact"]')).not.toBeNull();
});

test('jr-treatment-guidance element maps kebab-case attributes to widget props', () => {
  const element = mountGuidance();

  act(() => {
    element.setAttribute('contact-url', '/custom-contact');
  });

  expect(element.querySelector('a[href="/custom-contact"]')).not.toBeNull();
});
