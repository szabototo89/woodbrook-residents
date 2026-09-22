import { act } from 'react';
import { afterEach, expect, test } from 'vitest';

import GiftCardPageElement from './jr-gift-card-page/jr-gift-card-page';
import HomePageElement from './jr-home-page/jr-home-page';
import StudioSectionsElement from './jr-studio-sections/jr-studio-sections';
import TreatmentHeroElement from './jr-treatment-hero/jr-treatment-hero';
import TreatmentsPageElement from './jr-treatments-page/jr-treatments-page';

const elements = [
  ['jr-treatment-hero-test', TreatmentHeroElement],
  ['jr-gift-card-page-test', GiftCardPageElement],
  ['jr-studio-sections-test', StudioSectionsElement],
  ['jr-home-page-test', HomePageElement],
  ['jr-treatments-page-test', TreatmentsPageElement],
] as const;

for (const [tagName, Element] of elements) {
  if (!customElements.get(tagName)) customElements.define(tagName, Element);
}

function mount(tagName: string) {
  const element = document.createElement(tagName);
  act(() => document.body.appendChild(element));
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('missing page-level components are exposed as custom elements', () => {
  expect(mount('jr-treatment-hero-test').textContent).toContain(
    'Treatments & prices',
  );
  expect(mount('jr-gift-card-page-test').textContent).toContain(
    'Give the gift of time to unwind',
  );
});

test('aggregate custom elements expose complete reusable building blocks', () => {
  expect(
    mount('jr-studio-sections-test').querySelector('#booking-policy'),
  ).not.toBe(null);
  expect(mount('jr-home-page-test').querySelector('#featured')).not.toBe(null);
  expect(
    mount('jr-treatments-page-test').querySelector('section[id="massage"]'),
  ).not.toBeNull();
});

test('aggregate custom elements map kebab-case route attributes', () => {
  const home = mount('jr-home-page-test');
  act(() => {
    home.setAttribute('booking-base-url', '/appointments');
    home.setAttribute('gift-card-url', '/give');
  });

  expect(home.querySelector('a[href="/appointments"]')).not.toBeNull();
  expect(home.querySelector('a[href="/give"]')).not.toBeNull();
});
