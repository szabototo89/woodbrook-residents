import type { CmsImage } from './lauraSanity';

export function ServiceImage(props: {
  image: CmsImage;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <img
      src={props.image.url}
      srcSet={props.image.srcSet}
      sizes={
        props.sizes ??
        '(max-width: 640px) 106px, (max-width: 900px) calc((100vw - 84px) / 3), (max-width: 1328px) calc((100vw - 120px) / 5), 242px'
      }
      alt={props.image.alt}
      width="1448"
      height="1086"
      loading={props.eager ? 'eager' : 'lazy'}
    />
  );
}
