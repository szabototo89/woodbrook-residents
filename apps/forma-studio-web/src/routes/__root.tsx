import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import fontUrl from '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url';
import styles from '../styles.css?url';

function RootDocument() {
  return (
    <html lang="en-GB">
      <head>
        <HeadContent />
        <link rel="stylesheet" href={styles} />
        <link
          rel="preload"
          href={fontUrl}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style>{`@font-face{font-family:DM Sans;src:url(${fontUrl}) format('woff2');font-weight:100 1000;font-display:swap}`}</style>
      </head>
      <body>
        <Outlet />
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
      { name: 'theme-color', content: '#1d402d' },
    ],
    links: [{ rel: 'icon', href: '/favicon.png', type: 'image/png' }],
  }),
  shellComponent: RootDocument,
});
