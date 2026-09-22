import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { GiftCardPage } from './GiftCardPage';

test('gift card page provides the complete gift-card handoff', () => {
  const view = renderUi(<GiftCardPage />);

  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Give the gift of time to unwind',
  );
  expect(view.container.querySelectorAll('ol li')).toHaveLength(3);
  expect(
    view.container.querySelector(
      'a[href="https://www.julietrosebeauty.com/gift-card"]',
    )?.textContent,
  ).toContain('Continue to gift card checkout');
  expect(view.container.querySelector('a[href="tel:+353852867059"]')).not.toBe(
    null,
  );
  view.unmount();
});

test('gift card page honours checkout and contact properties', () => {
  const view = renderUi(
    <GiftCardPage
      checkoutUrl="https://example.com/gift"
      phoneHref="tel:+3531000000"
      phoneLabel="01 000 0000"
      emailHref="mailto:hello@example.com"
      emailLabel="hello@example.com"
    />,
  );

  expect(
    view.container.querySelector('a[href="https://example.com/gift"]'),
  ).not.toBeNull();
  expect(view.container.textContent).toContain('01 000 0000');
  expect(view.container.textContent).toContain('hello@example.com');
  view.unmount();
});
