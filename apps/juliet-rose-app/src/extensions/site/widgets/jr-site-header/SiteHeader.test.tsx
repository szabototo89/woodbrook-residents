import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { SiteHeader, toActiveNavigationItem } from './SiteHeader';

test('site header renders the studio brand, top-bar navigation, and booking action', () => {
  const markup = renderToStaticMarkup(<SiteHeader />);

  expect(markup).toContain('Juliet Rose');
  expect(markup).toContain('Beauty Studio');
  expect(markup).toContain('aria-label="Main navigation"');
  for (const label of ['Home', 'Treatments', 'Gift Cards', 'Contact']) {
    expect(markup).toContain(label);
  }
  expect(markup).toContain('href="/book"');
  expect(markup).toContain('Book an appointment');
  expect(markup).toContain('aria-label="Mobile navigation"');
});

test('site header marks the current page in both navigation menus', () => {
  const markup = renderToStaticMarkup(
    <SiteHeader activeNavigationItem="/treatments" />,
  );

  const currentLinks = markup.match(/aria-current="page"/g) ?? [];
  expect(currentLinks).toHaveLength(2);
});

test('site header honours widget properties for links and brand', () => {
  const markup = renderToStaticMarkup(
    <SiteHeader
      brandTitle="Custom Studio"
      brandSubtitle="Custom tag"
      bookingUrl="/custom-book"
      treatmentsUrl="/custom-treatments"
    />,
  );

  expect(markup).toContain('Custom Studio');
  expect(markup).toContain('Custom tag');
  expect(markup).toContain('href="/custom-book"');
  expect(markup).toContain('href="/custom-treatments"');
});

test('toActiveNavigationItem maps studio routes to navigation state', () => {
  expect(toActiveNavigationItem('/')).toBe('/');
  expect(toActiveNavigationItem('/treatments')).toBe('/treatments');
  expect(toActiveNavigationItem('/gift-cards')).toBe('/gift-cards');
  expect(toActiveNavigationItem('/book')).toBeUndefined();
});
