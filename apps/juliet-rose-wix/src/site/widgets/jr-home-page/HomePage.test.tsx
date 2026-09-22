import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { HomePage } from './HomePage';

test('home page composes the complete Studio-ready homepage block', () => {
  const view = renderUi(<HomePage viewMode="Editor" />);

  expect(view.container.querySelector('h1')?.textContent).toContain(
    'Relax and Revitalize',
  );
  expect(view.container.querySelector('#treatments')).not.toBeNull();
  expect(view.container.querySelector('#featured')).not.toBeNull();
  expect(view.container.querySelector('#gift-cards')).not.toBeNull();
  expect(view.container.querySelector('#contact')).not.toBeNull();
  expect(view.container.querySelector('#booking-policy')).not.toBeNull();
  view.unmount();
});

test('home page shares route settings across its child sections', () => {
  const view = renderUi(
    <HomePage
      viewMode="Editor"
      bookingBaseUrl="/appointments"
      treatmentsUrl="/services"
      giftCardUrl="/give"
    />,
  );

  expect(
    view.container.querySelector('a[href="/appointments"]'),
  ).not.toBeNull();
  expect(view.container.querySelector('a[href="/services"]')).not.toBeNull();
  expect(view.container.querySelector('a[href="/give"]')).not.toBeNull();
  expect(
    view.container.querySelector(
      'a[href="/appointments?service=juliet-rose-signature-facial"]',
    ),
  ).not.toBeNull();
  view.unmount();
});
