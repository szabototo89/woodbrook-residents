import { Theme } from '@astryxdesign/core';
import { butterTheme } from '@astryxdesign/theme-butter/built';
import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export function RootDocument(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Theme theme={butterTheme}>
          <>{props.children}</>
        </Theme>
        <Scripts />
      </body>
    </html>
  );
}
