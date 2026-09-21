import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { AppFooter } from '../components/AppFooter';
import { AppHeader } from '../components/AppHeader';
import { CloudflareWebAnalytics } from '../components/CloudflareWebAnalytics';
import { ClarityAnalytics } from '../components/ClarityAnalytics';
import { CookieConsentBanner } from '../components/CookieConsent';
import { SiteStructuredData } from './SiteStructuredData';

export function RootDocument(props: { children: ReactNode }) {
  return (
    <html lang="en-IE">
      <head>
        <HeadContent />
        <SiteStructuredData />
        <CloudflareWebAnalytics />
        <ClarityAnalytics />
      </head>
      {/* Browser extensions (Grammarly, etc.) add body attributes before
          React hydrates; ignore those to avoid hydration mismatch noise. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <AppHeader />
        {props.children}
        <AppFooter />
        <CookieConsentBanner />
        <Scripts />
      </body>
    </html>
  );
}
