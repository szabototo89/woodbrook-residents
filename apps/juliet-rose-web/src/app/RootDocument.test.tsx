// @vitest-environment happy-dom

import { act } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { expect, test, vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
  HeadContent: () => null,
  Scripts: () => null,
  useRouterState: (options: {
    select: (state: { location: { pathname: string } }) => string;
  }) => options.select({ location: { pathname: '/treatments' } }),
}));

import { toActiveNavigationItem } from '../components/SiteHeader';
import { click, renderUi } from '../test-utils/renderUi';
import { RootDocument } from './RootDocument';

type ShellProps = {
  children?: ReactNode;
  suppressHydrationWarning?: boolean;
  lang?: string;
};

function isShellElement(node: object): node is ReactElement<ShellProps> {
  return 'type' in node && 'props' in node;
}

function findByType(
  node: ReactNode,
  type: string,
): ReactElement<ShellProps> | undefined {
  if (
    node === null ||
    node === undefined ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
  ) {
    return undefined;
  }
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByType(child, type);
      if (found) return found;
    }
    return undefined;
  }
  if (typeof node === 'object' && isShellElement(node)) {
    if (node.type === type) return node;
    return findByType(node.props.children, type);
  }
  return undefined;
}

test('suppresses body hydration warnings from browser-extension attributes', () => {
  const tree = RootDocument({ children: <div>test child</div> });

  const body = findByType(tree, 'body');

  expect(body?.props.suppressHydrationWarning).toBe(true);
});

test('keeps rendering the page shell with its children', () => {
  const tree = RootDocument({ children: <div>test child</div> });
  const markupChildren = JSON.stringify(tree);

  expect(markupChildren).toContain('test child');
  expect(findByType(tree, 'html')?.props.lang).toBe('en-IE');
});

test('maps paths to the active header navigation item', () => {
  expect(toActiveNavigationItem('/')).toBe('/');
  expect(toActiveNavigationItem('/treatments')).toBe('/treatments');
  expect(toActiveNavigationItem('/book')).toBeUndefined();
});

test('renders the header, page content, and footer shell', () => {
  const view = renderUi(
    <RootDocument>
      <p>page body content</p>
    </RootDocument>,
  );

  expect(view.container.textContent).toContain('Skip to content');
  expect(view.container.textContent).toContain('page body content');
  expect(view.container.textContent).toContain('Relax and Revitalize');
  expect(
    view.container.querySelector(
      'nav[aria-label="Main navigation"] a.is-current',
    )?.textContent,
  ).toBe('Treatments');
  view.unmount();
});

test('opens and closes the mobile navigation from the shell', () => {
  const view = renderUi(
    <RootDocument>
      <p>page body content</p>
    </RootDocument>,
  );

  click(view.container.querySelector('button[aria-label="Open menu"]')!);
  expect(document.body.classList.contains('menu-open')).toBe(true);
  expect(
    view.container.querySelector('button[aria-label="Close menu"]'),
  ).not.toBeNull();

  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  });
  expect(
    view.container.querySelector('button[aria-label="Close menu"]'),
  ).not.toBeNull();

  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  });
  expect(
    view.container.querySelector('button[aria-label="Open menu"]'),
  ).not.toBeNull();
  expect(document.body.classList.contains('menu-open')).toBe(false);

  click(view.container.querySelector('button[aria-label="Open menu"]')!);
  click(view.container.querySelector('#mobile-navigation a[href="/"]')!);
  expect(document.body.classList.contains('menu-open')).toBe(false);

  view.unmount();
  expect(document.body.classList.contains('menu-open')).toBe(false);
});
