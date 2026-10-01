import { useLocation, useNavigate } from '@tanstack/react-router';
import type { CmsGalleryCollection } from './lauraSanity';

export type SwipeDirection = 'previous' | 'next';

declare module '@tanstack/react-router' {
  interface HistoryState {
    gallerySwipe?: { slug: string; picture: 'first' | 'last' };
  }
}

export function useCollectionSwipeNavigation(
  collection: CmsGalleryCollection,
  collections: CmsGalleryCollection[],
) {
  const navigate = useNavigate();
  const entry = useLocation({
    select: (location) => location.state.gallerySwipe,
  });
  const enteredBySwipe = entry?.slug === collection.slug;
  const initialIndex =
    enteredBySwipe && entry.picture === 'last'
      ? collection.photos.length - 1
      : 0;

  const changeCollection = (direction: SwipeDirection) => {
    const index = collections.findIndex(
      (item) => item.slug === collection.slug,
    );
    const offset = direction === 'next' ? 1 : -1;
    const adjacent =
      collections[(index + offset + collections.length) % collections.length];
    if (!adjacent) return;
    document.documentElement.setAttribute(
      'data-gallery-transition',
      adjacent.slug,
    );
    const update = () =>
      navigate({
        to: '/gallery/$collectionSlug',
        params: { collectionSlug: adjacent.slug },
        state: {
          gallerySwipe: {
            slug: adjacent.slug,
            picture: direction === 'next' ? 'first' : 'last',
          },
        },
        viewTransition: false,
        resetScroll: false,
      });
    const finish = () => {
      document.documentElement.removeAttribute('data-gallery-transition');
    };
    if (
      !document.startViewTransition ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      void update().finally(finish);
      return;
    }
    const transition = document.startViewTransition(update);
    void transition.ready.catch(() => undefined);
    void transition.finished.catch(() => undefined).then(finish);
  };

  return {
    initialIndex,
    focusOnMount: enteredBySwipe,
    onSwipeBoundary: collections.length > 1 ? changeCollection : undefined,
  };
}
