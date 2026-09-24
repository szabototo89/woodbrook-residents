import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { FeaturedGrid } from './FeaturedGrid';
import { resolveFeatured } from '../../treatments/treatments';

const PREVIEW = [
  {
    slug: 'juliet-rose-signature-facial',
    name: 'Juliet Rose Signature Facial',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 9500,
  },
  {
    slug: 'swedish-massage',
    name: 'Swedish massage',
    category: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
  },
] as const;

const FEATURED = resolveFeatured(PREVIEW, [
  'juliet-rose-signature-facial',
  'swedish-massage',
]);

test('jr-featured-grid renders featured cards with meta and booking links', () => {
  const view = renderUi(<FeaturedGrid featured={FEATURED} />);

  expect(view.container.textContent).toContain('Popular choices');
  expect(view.container.textContent).toContain('Featured treatments');
  const card = view.container.querySelector(
    'a[href="/book?service=juliet-rose-signature-facial"]',
  );
  expect(card?.textContent).toContain('Juliet Rose Signature Facial');
  expect(card?.textContent).toContain('1 hour');
  expect(card?.textContent).toContain('€95');
  expect(card?.textContent).toContain('Book now');
  expect(card?.querySelector('img')?.getAttribute('alt')).toBe(
    'Juliet Rose Signature Facial treatment',
  );
  view.unmount();
});

test('jr-featured-grid skips imagery missing from the image map', () => {
  const view = renderUi(
    <FeaturedGrid
      featured={[
        {
          treatment: {
            slug: 'swedish-massage',
            name: 'Swedish massage',
            category: 'Massage',
            durationMinutes: 60,
            priceCents: 8000,
          },
          image: '',
          imageAlt: 'Swedish massage',
        },
      ]}
    />,
  );

  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.querySelector('img')).toBeNull();
  view.unmount();
});

test('jr-featured-grid view-all link matches design with arrow icon', () => {
  const view = renderUi(<FeaturedGrid featured={FEATURED} />);

  const viewAll = view.container.querySelector('a[href="/treatments"]');
  expect(viewAll?.textContent).toContain('View all treatments');
  expect(viewAll?.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  view.unmount();
});
