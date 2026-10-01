import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

export function useGalleryTransitions() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(
        'a[data-gallery-collection]',
      );
      const image = link?.querySelector('img');
      const slug = link?.dataset.galleryCollection;
      if (
        !link ||
        !image ||
        image.getClientRects().length === 0 ||
        !slug ||
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')
      )
        return;
      if (
        !document.startViewTransition ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;

      event.preventDefault();
      image.style.viewTransitionName = 'selected-artwork';
      document.documentElement.setAttribute('data-gallery-transition', slug);
      void router
        .navigate({
          to: '/gallery/$collectionSlug',
          params: { collectionSlug: slug },
          viewTransition: true,
          resetScroll: false,
        })
        .then(() => {
          document
            .getElementById('collection-artwork')
            ?.focus({ preventScroll: true });
        })
        .finally(() => {
          image.style.removeProperty('view-transition-name');
          if (
            document.documentElement.getAttribute('data-gallery-transition') ===
            slug
          )
            document.documentElement.removeAttribute('data-gallery-transition');
        });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);
}
