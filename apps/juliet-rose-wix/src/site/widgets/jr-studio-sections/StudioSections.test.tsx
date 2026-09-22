import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { StudioSections } from './StudioSections';

test('studio sections compose the gift, visit, and policy sections', () => {
  const view = renderUi(<StudioSections />);

  expect(view.container.querySelector('#gift-cards')).not.toBeNull();
  expect(view.container.querySelector('#contact')).not.toBeNull();
  expect(view.container.querySelector('#booking-policy')).not.toBeNull();
  expect(view.container.textContent).toContain('The perfect gift');
  expect(view.container.textContent).toContain('Juliet Rose beauty studio');
  expect(view.container.textContent).toContain('Booking policy');
  view.unmount();
});

test('studio sections pass shared editor properties to their child sections', () => {
  const view = renderUi(
    <StudioSections
      giftCardUrl="/custom-gift"
      phoneHref="tel:+3531000000"
      emailHref="mailto:hello@example.com"
      policyUrl="/terms"
    />,
  );

  expect(view.container.querySelector('a[href="/custom-gift"]')).not.toBeNull();
  expect(
    view.container.querySelector('a[href="tel:+3531000000"]'),
  ).not.toBeNull();
  expect(
    view.container.querySelector('a[href="mailto:hello@example.com"]'),
  ).not.toBeNull();
  expect(view.container.querySelector('a[href="/terms"]')).not.toBeNull();
  view.unmount();
});
