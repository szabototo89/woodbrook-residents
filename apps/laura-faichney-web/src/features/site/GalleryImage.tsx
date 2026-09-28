import { galleryImages } from './siteContent';

export function GalleryImage(props: { image: (typeof galleryImages)[number] }) {
  return (
    <picture>
      <source
        srcSet={`/artwork/picsum-${props.image.id}.webp`}
        type="image/webp"
      />
      <img
        src={`/artwork/picsum-${props.image.id}.webp`}
        alt={props.image.alt}
        width="640"
        height="480"
        loading="lazy"
      />
    </picture>
  );
}
