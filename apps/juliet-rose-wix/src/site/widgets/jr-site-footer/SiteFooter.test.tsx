import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { SiteFooter } from './SiteFooter';

test('site footer renders the brand, navigation, social, and legal line', () => {
  const view = renderUi(<SiteFooter />);

  expect(view.container.textContent).toContain('Juliet Rose');
  expect(view.container.textContent).toContain('Beauty Studio');
  expect(
    view.container.querySelector('nav[aria-label="Footer navigation"]'),
  ).not.toBeNull();
  for (const label of ['Home', 'Treatments', 'Gift Cards', 'Contact']) {
    expect(view.container.textContent).toContain(label);
  }
  expect(
    view.container.querySelector('a[aria-label="Instagram"]'),
  ).not.toBeNull();
  expect(view.container.textContent).toContain('Relax and Revitalize');
  expect(view.container.textContent).toContain(
    '© 2026 Juliet Rose beauty studio. All rights reserved.',
  );
  view.unmount();
});

test('site footer honours widget properties for links and copy', () => {
  const view = renderUi(
    <SiteFooter
      treatmentsUrl="/custom-treatments"
      instagramUrl="https://example.com/studio"
      tagline="Custom tagline"
      copyright="Custom copyright"
    />,
  );

  expect(
    view.container.querySelector('a[href="/custom-treatments"]'),
  ).not.toBeNull();
  expect(
    view.container.querySelector('a[href="https://example.com/studio"]'),
  ).not.toBeNull();
  expect(view.container.textContent).toContain('Custom tagline');
  expect(view.container.textContent).toContain('Custom copyright');
  view.unmount();
});
