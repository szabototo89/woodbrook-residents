import type { GalleryPhoto } from './siteContent';
import {
  collectionCoverSizes,
  galleryPhotoSrcSet,
} from './galleryImageSources';

export function GalleryImage(props: {
  image: GalleryPhoto;
  sizes?: string;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <picture>
      <source
        srcSet={galleryPhotoSrcSet(props.image.id)}
        sizes={props.sizes ?? collectionCoverSizes}
        type="image/webp"
      />
      <img
        src={`/artwork/picsum-${props.image.id}.webp`}
        alt={props.image.alt}
        width="640"
        height="480"
        loading={props.loading ?? 'lazy'}
      />
    </picture>
  );
}
