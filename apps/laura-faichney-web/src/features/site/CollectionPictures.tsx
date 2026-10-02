import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GalleryImage } from './GalleryImage';
import {
  ArtworkAvailability,
  artworkAvailabilityLabel,
} from './ArtworkAvailability';
import { galleryPhotoSrcSet } from './galleryImageSources';
import type { CmsGalleryItem } from './lauraSanity';
import type { SwipeDirection } from './useCollectionSwipeNavigation';

export function CollectionPictures(props: {
  images: CmsGalleryItem[];
  initialIndex?: number;
  focusOnMount?: boolean;
  previousPicture?: CmsGalleryItem;
  nextPicture?: CmsGalleryItem;
  onSwipeBoundary?: (direction: SwipeDirection) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(props.initialIndex ?? 0);
  const selected = props.images[selectedIndex] ?? props.images[0];
  const total = props.images.length;
  const canSwipe = total > 1 || !!props.onSwipeBoundary;
  const artwork = useRef<HTMLElement>(null);
  const offset = props.previousPicture ? 1 : 0;
  const slides = [
    ...(props.previousPicture ? [props.previousPicture] : []),
    ...props.images,
    ...(props.nextPicture ? [props.nextPicture] : []),
  ];
  const [carouselRef, carousel] = useEmblaCarousel({
    startIndex: (props.initialIndex ?? 0) + offset,
    loop: !props.onSwipeBoundary && total > 1,
    containScroll: false,
    watchDrag: canSwipe,
    watchFocus: false,
    breakpoints: {
      '(prefers-reduced-motion: reduce)': { duration: 0 },
    },
  });
  const navigating = useRef(false);

  useEffect(() => {
    if (!carousel) return;
    const selectPicture = () => {
      const index = carousel.selectedScrollSnap() - offset;
      if (index >= 0 && index < total) setSelectedIndex(index);
    };
    const navigateBoundary = () => {
      const index = carousel.selectedScrollSnap() - offset;
      if (index >= 0 && index < total) return;
      if (navigating.current) return;
      navigating.current = true;
      props.onSwipeBoundary?.(index < 0 ? 'previous' : 'next');
    };
    const finishDrag = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        carousel.scrollTo(carousel.selectedScrollSnap(), true);
      }
      navigateBoundary();
    };
    carousel.on('select', selectPicture).on('pointerUp', finishDrag);
    return () => {
      carousel.off('select', selectPicture).off('pointerUp', finishDrag);
    };
  }, [carousel, offset, total, props.onSwipeBoundary]);

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
    const current = artwork.current?.querySelector<HTMLImageElement>(
      'img[aria-hidden="false"]',
    );
    const update = () => {
      thumbnail?.style.removeProperty('view-transition-name');
      flushSync(() => setSelectedIndex(index));
      carousel?.scrollTo(index + offset, true);
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
  const selectedAvailability = artworkAvailabilityLabel(selected.saleStatus);

  return (
    <section className="collection-pictures" aria-label="Collection pictures">
      <figure
        className="collection-selected-picture"
        ref={artwork}
        id="collection-artwork"
        tabIndex={-1}
        aria-label={selected.alt}
      >
        <div className="collection-carousel" ref={carouselRef}>
          <div
            className="collection-carousel-track"
            style={{
              transform: `translate3d(-${((props.initialIndex ?? 0) + offset) * 100}%, 0, 0)`,
            }}
          >
            {slides.map((image, index) => (
              <div
                className="collection-carousel-slide"
                key={`${image.alt}-${index}`}
              >
                <img
                  src={image.fullImage.url}
                  srcSet={galleryPhotoSrcSet(image.fullImage.url)}
                  sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 96px) * 2 / 3), 821px"
                  fetchPriority={
                    index === selectedIndex + offset ? 'high' : 'auto'
                  }
                  alt={image.alt}
                  aria-hidden={index !== selectedIndex + offset}
                  draggable={false}
                  width="640"
                  height="480"
                />
              </div>
            ))}
          </div>
        </div>
        {selectedAvailability && (
          <figcaption role="status" aria-atomic="true">
            <ArtworkAvailability status={selected.saleStatus} />
          </figcaption>
        )}
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
              aria-label={[
                `View picture: ${image.alt}`,
                artworkAvailabilityLabel(image.saleStatus),
              ]
                .filter(Boolean)
                .join('. ')}
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
              <ArtworkAvailability status={image.saleStatus} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
