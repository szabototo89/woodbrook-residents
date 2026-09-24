import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { act } from 'react';
import { expect, test } from 'vitest';

import { blanketRootAnchorColor } from '../../../test-utils/cssCascade';
import { renderUi } from '../../../test-utils/renderUi';
import { SiteHeader, toActiveNavigationItem } from './SiteHeader';

const workingDirectory = process.cwd();
const cssPath = resolve(
  basename(workingDirectory) === 'juliet-rose-wix'
    ? workingDirectory
    : resolve(workingDirectory, 'apps/juliet-rose-wix'),
  'src/site/widgets/jr-site-header/jr-site-header.module.css',
);
const headerCss = readFileSync(cssPath, 'utf8');

test('site header renders the studio brand, navigation, and booking link', () => {
  const view = renderUi(<SiteHeader />);

  expect(view.container.textContent).toContain('Juliet Rose');
  expect(view.container.textContent).toContain('Beauty Studio');
  expect(
    view.container.querySelector('nav[aria-label="Main navigation"]'),
  ).not.toBeNull();
  for (const label of ['Home', 'Treatments', 'Gift Cards', 'Contact']) {
    expect(view.container.textContent).toContain(label);
  }
  const bookingLink = view.container.querySelector('a[href="/book"]');
  expect(bookingLink?.textContent).toContain('Book an appointment');
  expect(bookingLink?.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  view.unmount();
});

test('site header marks the current page in both navigation menus', () => {
  const view = renderUi(<SiteHeader activeNavigationItem="/treatments" />);

  const treatmentsLinks = Array.from(
    view.container.querySelectorAll('a'),
  ).filter((link) => link.textContent === 'Treatments');
  expect(treatmentsLinks.length).toBe(2);
  for (const link of treatmentsLinks) {
    expect(link.getAttribute('aria-current')).toBe('page');
  }
  view.unmount();
});

test('site header opens and closes the mobile navigation accessibly', () => {
  const view = renderUi(<SiteHeader />);
  const menuButton = view.container.querySelector('button');
  const mobileNav = view.container.querySelector(
    'nav[aria-label="Mobile navigation"]',
  );

  expect(menuButton?.getAttribute('aria-label')).toBe('Open menu');
  expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
  expect(mobileNav?.hasAttribute('hidden')).toBe(true);

  act(() => {
    menuButton?.click();
  });

  expect(menuButton?.getAttribute('aria-label')).toBe('Close menu');
  expect(menuButton?.getAttribute('aria-expanded')).toBe('true');
  expect(mobileNav?.hasAttribute('hidden')).toBe(false);

  act(() => {
    menuButton?.click();
  });

  expect(menuButton?.getAttribute('aria-label')).toBe('Open menu');
  expect(mobileNav?.hasAttribute('hidden')).toBe(true);
  view.unmount();
});

test('site header honours widget properties for links and brand', () => {
  const view = renderUi(
    <SiteHeader
      brandTitle="Custom Studio"
      brandSubtitle="Custom tag"
      bookingUrl="/custom-book"
      treatmentsUrl="/custom-treatments"
    />,
  );

  expect(view.container.textContent).toContain('Custom Studio');
  expect(view.container.textContent).toContain('Custom tag');
  expect(view.container.querySelector('a[href="/custom-book"]')).not.toBeNull();
  expect(
    view.container.querySelector('a[href="/custom-treatments"]'),
  ).not.toBeNull();
  view.unmount();
});

test('toActiveNavigationItem maps studio routes to navigation state', () => {
  expect(toActiveNavigationItem('/')).toBe('/');
  expect(toActiveNavigationItem('/treatments')).toBe('/treatments');
  expect(toActiveNavigationItem('/gift-cards')).toBe('/gift-cards');
  expect(toActiveNavigationItem('/book')).toBeUndefined();
});

test('header booking buttons keep white text over the anchor reset', () => {
  // A blanket `.root a` color rule (0,1,1) would beat `.primaryButton`
  // (0,1,0) and turn the booking button text dark, as reported. The reset
  // must stay scoped to plain navigation links so the white button wins.
  expect(headerCss).toMatch(/\.primaryButton\s*\{[^}]*color:\s*white/);
  expect(blanketRootAnchorColor(headerCss)).toBeNull();
});

test('header brand keeps the rose studio color over the anchor reset', () => {
  // Same root cause as the button text: a blanket `.root a` color rule
  // would also beat `.brand` and turn the studio name dark.
  expect(headerCss).toMatch(/\.brand\s*\{[^}]*color:\s*var\(--jr-rose\)/);
  expect(blanketRootAnchorColor(headerCss)).toBeNull();
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
