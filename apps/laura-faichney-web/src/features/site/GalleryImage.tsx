import {
  collectionCoverSizes,
  galleryPhotoSrcSet,
} from './galleryImageSources';

type GalleryImageProps = {
  src: string;
  srcSet?: string;
  alt: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
};

export function GalleryImage(props: GalleryImageProps) {
  return (
    <img
      src={props.src}
      srcSet={props.srcSet ?? galleryPhotoSrcSet(props.src)}
      alt={props.alt}
      sizes={props.sizes ?? collectionCoverSizes}
      width="640"
      height="480"
      loading={props.loading ?? 'lazy'}
    />
  );
}
