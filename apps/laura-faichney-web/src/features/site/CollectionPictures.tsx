import { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GalleryImage } from './GalleryImage';
import { galleryPhotoSrcSet } from './galleryImageSources';
import type { CmsGalleryItem } from './lauraSanity';
import type { SwipeDirection } from './useCollectionSwipeNavigation';

export function CollectionPictures(props: {
  images: CmsGalleryItem[];
  initialIndex?: number;
  focusOnMount?: boolean;
  onSwipeBoundary?: (direction: SwipeDirection) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(props.initialIndex ?? 0);
  const selected = props.images[selectedIndex] ?? props.images[0];
  const total = props.images.length;
  const canSwipe = total > 1 || !!props.onSwipeBoundary;
  const artwork = useRef<HTMLElement>(null);
  const swipeStart = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (
      !props.focusOnMount &&
      !document.documentElement.hasAttribute('data-gallery-transition')
    )
      return;
    artwork.current?.scrollIntoView({ behavior: 'instant', block: 'center' });
    artwork.current?.focus({ preventScroll: true });
  }, [props.images, props.focusOnMount]);

  const changePicture = (
    index: number,
    thumbnail?: HTMLImageElement | null,
  ) => {
    if (index === selectedIndex) return;
    const current = artwork.current?.querySelector('img');
    const update = () => {
      thumbnail?.style.removeProperty('view-transition-name');
      flushSync(() => setSelectedIndex(index));
      if (thumbnail) {
        artwork.current?.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        });
        artwork.current?.focus({ preventScroll: true });
      }
    };
    if (
      !document.startViewTransition ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      update();
      return;
    }
    if (thumbnail) {
      if (current) current.style.viewTransitionName = 'none';
      thumbnail.style.setProperty('view-transition-name', 'selected-artwork');
    }
    const transition = document.startViewTransition(update);
    // A skipped visual transition must never interfere with picture selection.
    void transition.ready.catch(() => undefined);
    void transition.finished
      .catch(() => undefined)
      .then(() => {
        current?.style.removeProperty('view-transition-name');
        thumbnail?.style.removeProperty('view-transition-name');
      });
  };

  if (!selected) return null;

  return (
    <section className="collection-pictures" aria-label="Collection pictures">
      <figure
        className="collection-selected-picture"
        ref={artwork}
        id="collection-artwork"
        tabIndex={-1}
        aria-label={selected.alt}
        style={canSwipe ? { touchAction: 'pan-y pinch-zoom' } : undefined}
        onPointerDown={(event) => {
          if (event.pointerType !== 'touch') return;
          swipeStart.current =
            canSwipe && event.isPrimary
              ? {
                  pointerId: event.pointerId,
                  x: event.clientX,
                  y: event.clientY,
                }
              : null;
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start || start.pointerId !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
          const direction = dx < 0 ? 'next' : 'previous';
          const nextIndex = selectedIndex + (direction === 'next' ? 1 : -1);
          if (props.onSwipeBoundary && (nextIndex < 0 || nextIndex >= total)) {
            props.onSwipeBoundary(direction);
            return;
          }
          changePicture((nextIndex + total) % total);
        }}
      >
        <img
          key={selected.fullImage.url}
          src={selected.fullImage.url}
          srcSet={galleryPhotoSrcSet(selected.fullImage.url)}
          sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 96px) * 2 / 3), 821px"
          fetchPriority="high"
          alt={selected.alt}
          width="640"
          height="480"
        />
      </figure>
      {total > 1 && (
        <nav
          className="collection-picture-navigation"
          aria-label="Picture navigation"
        >
          <button
            type="button"
            onClick={() => changePicture((selectedIndex - 1 + total) % total)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Previous picture
          </button>
          <button
            type="button"
            onClick={() => changePicture((selectedIndex + 1) % total)}
          >
            Next picture
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </nav>
      )}
      {total > 1 && (
        <div
          className="collection-thumbnails"
          role="group"
          aria-label="Choose a picture"
        >
          {props.images.map((image, index) => (
            <button
              key={`${image.alt}-${index}`}
              type="button"
              aria-label={`View picture: ${image.alt}`}
              aria-pressed={index === selectedIndex}
              onClick={(event) =>
                changePicture(index, event.currentTarget.querySelector('img'))
              }
            >
              <GalleryImage
                src={image.image.url}
                alt={image.alt}
                sizes={`(max-width: 640px) calc((100vw - ${40 + 8 * (total - 1)}px) / ${total} - 12px), (max-width: 700px) calc((100vw - ${48 + 8 * (total - 1)}px) / ${total} - 12px), 148px`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
