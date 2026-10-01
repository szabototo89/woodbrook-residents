import { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GalleryImage } from './GalleryImage';
import type { GalleryCollection } from './siteContent';
import { galleryPhotoSrcSet } from './galleryImageSources';

export function CollectionPictures(props: {
  images: GalleryCollection['images'];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = props.images[selectedIndex] ?? props.images[0];
  const total = props.images.length;
  const artwork = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!document.documentElement.hasAttribute('data-gallery-transition'))
      return;
    artwork.current?.scrollIntoView({ behavior: 'instant', block: 'center' });
    artwork.current?.focus({ preventScroll: true });
  }, [props.images]);

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

  return (
    <section
      className="section collection-pictures"
      aria-label="Collection pictures"
    >
      <div className="container">
        <figure
          className="collection-selected-picture"
          ref={artwork}
          id="collection-artwork"
          tabIndex={-1}
          aria-label={selected.alt}
        >
          <img
            key={selected.id}
            src={`/artwork/picsum-${selected.id}.webp`}
            srcSet={galleryPhotoSrcSet(selected.id)}
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1008px) calc(100vw - 48px), 960px"
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
        <div
          className="collection-thumbnails"
          role="group"
          aria-label="Choose a picture"
        >
          {props.images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={`View picture: ${image.alt}`}
              aria-pressed={index === selectedIndex}
              onClick={(event) =>
                changePicture(index, event.currentTarget.querySelector('img'))
              }
            >
              <GalleryImage
                image={image}
                sizes={`(max-width: 640px) calc((100vw - ${40 + 8 * (total - 1)}px) / ${total} - 12px), (max-width: 700px) calc((100vw - ${48 + 8 * (total - 1)}px) / ${total} - 12px), 148px`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
