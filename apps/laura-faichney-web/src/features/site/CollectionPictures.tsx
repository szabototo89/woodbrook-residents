import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GalleryImage } from './GalleryImage';
import type { CmsGalleryItem } from './lauraSanity';

export function CollectionPictures(props: { images: CmsGalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = props.images[selectedIndex] ?? props.images[0];
  const total = props.images.length;

  if (!selected) return null;

  return (
    <section
      className="section collection-pictures"
      aria-label="Collection pictures"
    >
      <div className="container">
        <figure className="collection-selected-picture">
          <img
            src={selected.fullImage.url}
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
              key={`${image.alt}-${index}`}
              type="button"
              aria-label={`View picture: ${image.alt}`}
              aria-pressed={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
            >
              <GalleryImage src={image.image.url} alt={image.alt} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
