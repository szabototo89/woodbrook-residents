import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IE">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}
