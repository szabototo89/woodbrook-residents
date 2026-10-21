import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';

type AppearanceImage = {
  src: string;
  title: string;
  alt: string;
  description: string;
};

export function AppearanceGallery(props: { images: AppearanceImage[] }) {
  const [index, setIndex] = useState(0);
  if (props.images.length === 0) return null;
  const current = index % props.images.length;
  const image = props.images[current]!;
  const move = (offset: number) =>
    setIndex(
      (value) => (value + offset + props.images.length) % props.images.length,
    );

  return (
    <section
      className="appearance-gallery"
      aria-label="Appearance gallery"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
    >
      <figure aria-live="polite">
        <img className="gallery-image" src={image.src} alt={image.alt} />
        <figcaption>
          <strong>{image.title}</strong>
          <span>
            {current + 1} of {props.images.length}
          </span>
        </figcaption>
        <p className="gallery-review">
          <strong>What to check</strong>
          <br />
          {image.description}
        </p>
      </figure>
      <div className="gallery-controls">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={props.images.length === 1}
        >
          <ChevronLeft size={15} aria-hidden="true" />
          Previous image
        </button>
        <a href={image.src} target="_blank" rel="noreferrer">
          Open full size
          <ExternalLink size={13} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={props.images.length === 1}
        >
          Next image
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="gallery-thumbnails" aria-label="Choose a screenshot">
        {props.images.map((item, itemIndex) => (
          <button
            type="button"
            key={item.src}
            aria-label={`Show ${item.title}`}
            aria-pressed={itemIndex === current}
            onClick={() => setIndex(itemIndex)}
          >
            <img src={item.src} alt="" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
