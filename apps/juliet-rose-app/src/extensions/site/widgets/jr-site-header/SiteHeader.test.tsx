import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { SiteHeader, toActiveNavigationItem } from './SiteHeader';

const headerCss = readFileSync(
  new URL('./site-header.module.css', import.meta.url),
  'utf8',
);

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

test('mobile menu booking button keeps white text on the rose background', () => {
  // Reported: the Book an appointment button in the open menu rendered
  // dark text on rose. The menu button rule pins the white text at
  // (0,2,0) so host-page anchor styles cannot override the base button.
  const menuButtonRule = headerCss.match(
    /\.mobileNav\s+\.primaryButton\s*\{[^}]*\}/,
  );
  expect(menuButtonRule?.[0]).toMatch(/color:\s*(white|#fff\b)/);
});

test('mobile header brand keeps Beauty Studio beside Juliet Rose on one line', () => {
  // Reported: on mobile the brand wrapped into three lines
  // (Juliet Rose / BEAUTY / STUDIO). The mobile lockup is horizontal:
  // the subtitle sits beside the title and never wraps.
  const mobileBlock = headerCss.slice(
    headerCss.indexOf('@media (max-width: 900px)'),
  );
  const brandRule = mobileBlock.match(/\.brand\s*\{[^}]*\}/);
  expect(brandRule?.[0]).toMatch(/flex-direction:\s*row/);
  const subtitleRule = mobileBlock.match(/\.brand\s+small\s*\{[^}]*\}/);
  expect(subtitleRule?.[0]).toMatch(/white-space:\s*nowrap/);
});
