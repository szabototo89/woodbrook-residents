import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import JrSiteFooterElement from './jr-site-footer';

const TEST_TAG = 'jr-site-footer-test';

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, JrSiteFooterElement);
}

function mountFooter() {
  const element = document.createElement(TEST_TAG);
  act(() => {
    document.body.appendChild(element);
  });
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('jr-site-footer element renders the footer content without attributes', () => {
  const element = mountFooter();

  expect(element.textContent).toContain('Juliet Rose');
  expect(element.textContent).toContain('Relax and Revitalize');
  expect(element.textContent).toContain('All rights reserved.');
});

test('jr-site-footer element maps kebab-case attributes to widget props', () => {
  const element = mountFooter();

  act(() => {
    element.setAttribute('tagline', 'Custom footer tagline');
  });

  expect(element.textContent).toContain('Custom footer tagline');
});
