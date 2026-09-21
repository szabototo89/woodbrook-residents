import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrHero } from './JrHero';

test('jr-hero renders the default studio headline, copy, and calls to action', () => {
  const view = renderUi(<JrHero />);
  const heading = view.container.querySelector('h1');
  const image = view.container.querySelector('img');
  const bookingLink = view.container.querySelector('a[href="/book"]');
  const treatmentsLink = view.container.querySelector('a[href="/treatments"]');
  const policyLink = view.container.querySelector('a[href="#booking-policy"]');

  expect(heading?.textContent).toBe('Relax and Revitalize');
  expect(heading?.getAttribute('id')).toBe('hero-heading');
  expect(
    view.container.querySelector('section')?.getAttribute('aria-labelledby'),
  ).toBe('hero-heading');
  expect(view.container.textContent).toContain('Beauty · Wellbeing · You');
  expect(view.container.textContent).toContain(
    'Beauty treatments in Stillorgan, South Dublin.',
  );
  expect(view.container.textContent).toContain(
    'A wide range of beauty treatments and products,',
  );
  expect(view.container.textContent).toContain('all in one place.');
  expect(view.container.querySelector('p br')).not.toBeNull();
  expect(bookingLink?.textContent).toContain('Book an appointment');
  expect(bookingLink?.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  expect(treatmentsLink?.textContent).toContain('View treatments');
  expect(policyLink?.textContent).toContain('Booking policy');
  expect(policyLink?.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  expect(image?.getAttribute('src')).toBe('/images/facial-hero.jpg');
  expect(image?.getAttribute('srcset')).toBe(
    '/images/facial-hero-640.jpg 640w, /images/facial-hero.jpg 840w',
  );
  expect(image?.getAttribute('sizes')).toBe('(max-width: 700px) 100vw, 840px');
  expect(image?.getAttribute('alt')).toBe(
    'A relaxing facial treatment at Juliet Rose Beauty Studio',
  );
  expect(image?.getAttribute('width')).toBe('840');
  expect(image?.getAttribute('height')).toBe('420');
  expect(image?.getAttribute('fetchpriority')).toBe('high');
  view.unmount();
});

test('jr-hero honours widget properties for copy, links, and imagery', () => {
  const view = renderUi(
    <JrHero
      eyebrow="Custom eyebrow"
      title="Custom title"
      location="Custom location"
      copy="Custom copy lead,"
      copySecondLine="custom copy rest."
      bookingUrl="/custom-book"
      treatmentsUrl="/custom-treatments"
      policyUrl="#custom-policy"
      imageUrl="https://example.com/hero.jpg"
      imageAlt="Custom alt"
    />,
  );

  expect(view.container.textContent).toContain('Custom eyebrow');
  expect(view.container.querySelector('h1')?.textContent).toBe('Custom title');
  expect(view.container.textContent).toContain('Custom location');
  expect(view.container.textContent).toContain('Custom copy lead,');
  expect(view.container.textContent).toContain('custom copy rest.');
  expect(view.container.querySelector('a[href="/custom-book"]')).not.toBeNull();
  expect(
    view.container.querySelector('a[href="/custom-treatments"]'),
  ).not.toBeNull();
  expect(
    view.container.querySelector('a[href="#custom-policy"]'),
  ).not.toBeNull();
  expect(view.container.querySelector('img')?.getAttribute('src')).toBe(
    'https://example.com/hero.jpg',
  );
  expect(view.container.querySelector('img')?.getAttribute('alt')).toBe(
    'Custom alt',
  );
  view.unmount();
});
