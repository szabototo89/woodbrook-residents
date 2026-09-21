import { HeadContent, Scripts, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader, toActiveNavigationItem } from '../components/SiteHeader';
import { appStyles } from './appStyles';

export function RootDocument(props: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <html lang="en-IE">
      <head>
        <HeadContent />
        <style
          data-app-styles
          dangerouslySetInnerHTML={{ __html: appStyles }}
        />
      </head>
      {/* Browser extensions (Grammarly, etc.) add body attributes before
          React hydrates; ignore those to avoid hydration mismatch noise. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader activeNavigationItem={toActiveNavigationItem(pathname)} />
        {props.children}
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}
