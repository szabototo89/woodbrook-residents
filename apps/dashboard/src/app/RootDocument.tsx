import { Theme } from '@astryxdesign/core';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Theme theme={neutralTheme}>
          <>{children}</>
        </Theme>
        <Scripts />
      </body>
    </html>
  );
}
