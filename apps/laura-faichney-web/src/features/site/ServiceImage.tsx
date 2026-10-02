import { sanityImageSrcSet } from './galleryImageSources';
import type { CmsImage } from './lauraSanity';

export function ServiceImage(props: {
  image: CmsImage;
  eager?: boolean;
  sizes: string;
}) {
  return (
    <img
      src={props.image.url}
      srcSet={sanityImageSrcSet(
        props.image.url,
        [160, 240, 320, 480, 640, 768, 960],
      )}
      sizes={props.sizes}
      decoding="async"
      alt={props.image.alt}
      width="1448"
      height="1086"
      loading={props.eager ? 'eager' : 'lazy'}
    />
  );
}
