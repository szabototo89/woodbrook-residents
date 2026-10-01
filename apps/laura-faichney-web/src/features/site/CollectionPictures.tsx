import { useState } from 'react';
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

  return (
    <section
      className="section collection-pictures"
      aria-label="Collection pictures"
    >
      <div className="container">
        <figure className="collection-selected-picture">
          <img
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
              onClick={() =>
                setSelectedIndex((index) => (index - 1 + total) % total)
              }
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Previous picture
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((index) => (index + 1) % total)}
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
              onClick={() => setSelectedIndex(index)}
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
