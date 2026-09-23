import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { SiteFooter } from './SiteFooter';

test('site footer renders the studio brand, footer navigation, and closing copy', () => {
  const markup = renderToStaticMarkup(<SiteFooter />);

  expect(markup).toContain('Juliet Rose');
  expect(markup).toContain('Beauty Studio');
  expect(markup).toContain('aria-label="Footer navigation"');
  for (const label of ['Home', 'Treatments', 'Gift Cards', 'Contact']) {
    expect(markup).toContain(label);
  }
  expect(markup).toContain('Relax and Revitalize');
  expect(markup).toContain('All rights reserved.');
});

test('site footer honours widget properties for links and brand', () => {
  const markup = renderToStaticMarkup(
    <SiteFooter
      brandTitle="Custom Studio"
      brandSubtitle="Custom tag"
      tagline="Custom tagline"
      copyright="Custom copyright"
      instagramUrl="https://example.com/studio"
    />,
  );

  expect(markup).toContain('Custom Studio');
  expect(markup).toContain('Custom tag');
  expect(markup).toContain('Custom tagline');
  expect(markup).toContain('Custom copyright');
  expect(markup).toContain('href="https://example.com/studio"');
});
