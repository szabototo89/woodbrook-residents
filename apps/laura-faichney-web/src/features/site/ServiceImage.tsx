import { sanityImageSrcSet } from './galleryImageSources';
import type { CmsImage } from './lauraSanity';

export function ServiceImage(props: {
  image: CmsImage;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <img
      src={props.image.url}
      srcSet={
        props.image.srcSet ??
        sanityImageSrcSet(props.image.url, [160, 240, 320, 480, 640, 768, 960])
      }
      sizes={
        props.sizes ??
        '(max-width: 640px) 106px, (max-width: 900px) calc((100vw - 84px) / 3), (max-width: 1328px) calc((100vw - 120px) / 5), 242px'
      }
      decoding="async"
      alt={props.image.alt}
      width="1448"
      height="1086"
      loading={props.eager ? 'eager' : 'lazy'}
    />
  );
}
