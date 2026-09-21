import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrHero } from './JrHero';

test('jr-hero renders the default studio headline, copy, and calls to action', () => {
  const view = renderUi(<JrHero />);

  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Relax and Revitalize',
  );
  expect(view.container.textContent).toContain(
    'Beauty treatments in Stillorgan, South Dublin.',
  );
  expect(
    view.container.querySelector('a[href="/book"]')?.textContent,
  ).toContain('Book an appointment');
  expect(
    view.container.querySelector('a[href="/treatments"]')?.textContent,
  ).toContain('View treatments');
  expect(view.container.querySelector('img')?.getAttribute('alt')).toBe(
    'A relaxing facial treatment at Juliet Rose Beauty Studio',
  );
  view.unmount();
});

test('jr-hero honours widget properties for copy, links, and imagery', () => {
  const view = renderUi(
    <JrHero
      eyebrow="Custom eyebrow"
      title="Custom title"
      location="Custom location"
      copy="Custom copy"
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
  expect(view.container.textContent).toContain('Custom copy');
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
