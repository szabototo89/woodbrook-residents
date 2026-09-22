import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { TreatmentsPage } from './TreatmentsPage';

test('treatments page composes hero, catalog, and guidance', () => {
  const view = renderUi(<TreatmentsPage viewMode="Editor" />);

  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Treatments & prices',
  );
  expect(view.container.querySelector('section[id="massage"]')).not.toBeNull();
  expect(view.container.textContent).toContain('Not sure what to choose?');
  view.unmount();
});

test('treatments page shares booking and contact routes with child sections', () => {
  const view = renderUi(
    <TreatmentsPage
      viewMode="Editor"
      bookingBaseUrl="/appointments"
      contactUrl="/contact-us"
    />,
  );

  expect(
    view.container.querySelector(
      'a[href="/appointments?service=swedish-massage"]',
    ),
  ).not.toBeNull();
  expect(view.container.querySelector('a[href="/contact-us"]')).not.toBeNull();
  view.unmount();
});
