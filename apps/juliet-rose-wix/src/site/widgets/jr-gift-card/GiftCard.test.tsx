import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { GiftCard } from './GiftCard';

test('gift card renders the default gift content', () => {
  const view = renderUi(<GiftCard />);

  const section = view.container.querySelector('section[id="gift-cards"]');
  expect(section?.getAttribute('aria-labelledby')).toBe('gift-heading');
  expect(section?.textContent).toContain('Gift cards');
  expect(section?.textContent).toContain('The perfect gift');
  expect(section?.textContent).toContain(
    'Treat someone special to a Juliet Rose gift card.',
  );
  expect(section?.textContent).toContain(
    'Available for any treatment or amount.',
  );
  expect(
    section?.querySelector('a[href="/gift-cards"]')?.textContent,
  ).toContain('Buy a gift card');
  view.unmount();
});

test('gift card honours widget properties', () => {
  const view = renderUi(
    <GiftCard title="Custom gift title" cardUrl="https://example.com/gift" />,
  );

  expect(view.container.textContent).toContain('Custom gift title');
  expect(
    view.container.querySelector('a[href="https://example.com/gift"]'),
  ).not.toBeNull();
  view.unmount();
});
