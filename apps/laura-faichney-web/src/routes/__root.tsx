import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import cormorantUrl from '@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2?url';
import dmSansUrl from '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url';
import styles from '../styles.css?url';
import { SiteFooter, SiteHeader } from '../features/site/SitePages';
import { useGalleryTransitions } from '../features/site/useGalleryTransitions';

function RootDocument() {
  useGalleryTransitions();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <html lang="en-IE">
      <head>
        <HeadContent />
        <link rel="stylesheet" href={styles} />
        <link
          rel="preload"
          href={cormorantUrl}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={dmSansUrl}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style>{`@font-face{font-family:Cormorant;src:url(${cormorantUrl}) format('woff2');font-weight:300 700;font-display:swap}@font-face{font-family:DM Sans;src:url(${dmSansUrl}) format('woff2');font-weight:100 1000;font-display:swap}`}</style>
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader active={pathname} />
        <Outlet />
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#fbf7f1' },
    ],
  }),
  shellComponent: RootDocument,
});
