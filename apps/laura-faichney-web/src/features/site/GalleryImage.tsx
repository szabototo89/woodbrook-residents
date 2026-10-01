import {
  collectionCoverSizes,
  galleryPhotoSrcSet,
} from './galleryImageSources';

export function GalleryImage(props: {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <img
      src={props.src}
      srcSet={galleryPhotoSrcSet(props.src)}
      alt={props.alt}
      sizes={props.sizes ?? collectionCoverSizes}
      width="640"
      height="480"
      loading={props.loading ?? 'lazy'}
    />
  );
}
