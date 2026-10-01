import type { CmsImage } from './lauraSanity';

export function ServiceImage(props: { image: CmsImage; eager?: boolean }) {
  return (
    <img
      src={props.image.url}
      alt={props.image.alt}
      width="1448"
      height="1086"
      loading={props.eager ? 'eager' : 'lazy'}
    />
  );
}
