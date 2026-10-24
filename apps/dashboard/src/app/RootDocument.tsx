import { Theme } from '@astryxdesign/core';
import { butterTheme } from '@astryxdesign/theme-butter/built';
import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type RootDocumentProps = { children: ReactNode };

export function RootDocument(props: RootDocumentProps) {
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
