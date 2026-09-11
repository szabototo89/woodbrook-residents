import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { AppFooter } from '../components/AppFooter';
import { AppHeader } from '../components/AppHeader';
import { CloudflareWebAnalytics } from '../components/CloudflareWebAnalytics';

export function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <CloudflareWebAnalytics />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <AppHeader />
        {children}
        <AppFooter />
        <Scripts />
      </body>
    </html>
  );
}
