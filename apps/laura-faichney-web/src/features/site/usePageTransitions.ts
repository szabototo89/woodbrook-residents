import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

const pagePaths = new Set(['/', '/about', '/services', '/gallery', '/contact']);

export function usePageTransitions() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element) ||
        !document.startViewTransition ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;

      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (
        !link ||
        link.hasAttribute('data-gallery-collection') ||
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')
      )
        return;

      const destination = new URL(link.href);
      if (
        destination.origin !== location.origin ||
        !pagePaths.has(destination.pathname) ||
        destination.hash ||
        (destination.pathname === location.pathname &&
          destination.search === location.search)
      )
        return;

      event.preventDefault();
      document.documentElement.setAttribute('data-page-transition', '');
      const update = () =>
        router
          .navigate({
            href: `${destination.pathname}${destination.search}`,
            viewTransition: false,
          })
          .then(() => {
            const main = document.getElementById('main-content');
            if (main) {
              main.tabIndex = -1;
              main.focus({ preventScroll: true });
            }
          })
          .catch(() => {
            // A failed enhancement must still follow the original link.
            location.assign(destination.href);
          });
      const transition = document.startViewTransition(update);
      void transition.ready.catch(() => undefined);
      void transition.finished
        .catch(() => undefined)
        .then(() => {
          document.documentElement.removeAttribute('data-page-transition');
        });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);
}
