import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { AppFooter } from '../components/AppFooter';
import { AppHeader } from '../components/AppHeader';
import { CloudflareWebAnalytics } from '../components/CloudflareWebAnalytics';
import { ClarityAnalytics } from '../components/ClarityAnalytics';
import { CookieConsentBanner } from '../components/CookieConsent';

export function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <CloudflareWebAnalytics />
        <ClarityAnalytics />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <AppHeader />
        {children}
        <AppFooter />
        <CookieConsentBanner />
        <Scripts />
      </body>
    </html>
  );
}
