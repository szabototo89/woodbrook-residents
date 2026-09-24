import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { CATEGORY_CARDS } from '../../treatments/treatments';
import { CategoryGrid } from './CategoryGrid';

test('jr-category-grid renders every category card with researched links', () => {
  const view = renderUi(<CategoryGrid cards={CATEGORY_CARDS} />);

  expect(view.container.textContent).toContain('Our treatments');
  expect(view.container.textContent).toContain(
    'Find the right treatment for you',
  );
  const facials = view.container.querySelector(
    'a[href="/treatments#facials-and-skin"]',
  );
  expect(facials?.textContent).toContain('Facials & skin');
  expect(facials?.textContent).toContain(
    'From our signature facial to advanced skin treatments.',
  );
  expect(facials?.querySelector('img')?.getAttribute('src')).toBe(
    '/images/facial-mask.jpg',
  );
  expect(
    view.container.querySelector('a[href="/treatments"]')?.textContent,
  ).toContain('View all treatments');
  view.unmount();
});

test('jr-category-grid honours a custom view-all link', () => {
  const view = renderUi(
    <CategoryGrid
      cards={CATEGORY_CARDS.slice(0, 1)}
      viewAllLabel="Custom link"
      viewAllHref="/custom-treatments"
    />,
  );

  expect(
    view.container.querySelector('a[href="/custom-treatments"]')?.textContent,
  ).toContain('Custom link');
  view.unmount();
});

test('jr-category-grid view-all link matches design with arrow icon', () => {
  const view = renderUi(<CategoryGrid cards={CATEGORY_CARDS} />);

  const viewAll = view.container.querySelector('a[href="/treatments"]');
  expect(viewAll?.textContent).toContain('View all treatments');
  expect(viewAll?.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  view.unmount();
});
