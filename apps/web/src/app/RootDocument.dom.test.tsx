// @vitest-environment happy-dom

import type { ReactElement, ReactNode } from 'react';
import { expect, test, vi } from 'vitest';

vi.mock('../components/AppHeader', () => ({ AppHeader: () => null }));
vi.mock('../components/AppFooter', () => ({ AppFooter: () => null }));
vi.mock('../components/CloudflareWebAnalytics', () => ({
  CloudflareWebAnalytics: () => null,
}));
vi.mock('../components/ClarityAnalytics', () => ({
  ClarityAnalytics: () => null,
}));
vi.mock('../components/CookieConsent', () => ({
  CookieConsentBanner: () => null,
}));
vi.mock('./SiteStructuredData', () => ({ SiteStructuredData: () => null }));

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
