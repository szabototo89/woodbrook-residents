import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { BrandLogo } from './BrandLogo';

test('brand links home with the supplied signature image and an accessible name', () => {
  const html = renderToStaticMarkup(<BrandLogo />);

  expect(html).toContain('href="/"');
  expect(html).toContain('src="/brand/laura-faichney-signature.webp"');
  expect(html).toContain('alt="Laura Faichney — All Things Art"');
  expect(html).toContain('width="660"');
  expect(html).toContain('height="220"');
  expect(html).toContain('/brand/laura-faichney-signature-220.webp 220w');
  expect(html).toContain('/brand/laura-faichney-signature-320.webp 320w');
  expect(html).not.toContain('<small>');
});
