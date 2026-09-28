import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { BrandLogo } from './BrandLogo';

test('brand links home with the supplied signature image and an accessible name', () => {
  const html = renderToStaticMarkup(<BrandLogo />);

  expect(html).toContain('href="/"');
  expect(html).toContain('src="/brand/laura-faichney-signature.png"');
  expect(html).toContain('alt="Laura Faichney — All Things Art"');
  expect(html).toContain('width="2172"');
  expect(html).toContain('height="724"');
  expect(html).not.toContain('<small>');
});
