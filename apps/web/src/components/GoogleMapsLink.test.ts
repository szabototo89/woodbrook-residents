import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { GoogleMapsLink } from './GoogleMapsLink';

test('GoogleMapsLink renders an accessible link to the Google Maps search', () => {
  const markup = renderToStaticMarkup(
    createElement(GoogleMapsLink, { location: 'Woodbrook, Shankill' }),
  );

  expect(markup).toContain(
    'href="https://www.google.com/maps/search/?api=1&amp;query=Woodbrook%2C+Shankill"',
  );
  expect(markup).toContain(
    'aria-label="Open Woodbrook, Shankill in Google Maps"',
  );
  expect(markup).toContain('Woodbrook, Shankill');
});
