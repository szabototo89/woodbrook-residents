import { services } from './siteContent';

export function ServiceImage(props: {
  service: (typeof services)[number];
  eager?: boolean;
}) {
  return (
    <img
      src={props.service.image}
      alt={props.service.imageAlt}
      width="600"
      height="450"
      loading={props.eager ? 'eager' : 'lazy'}
      style={{ objectPosition: props.service.position }}
    />
  );
}
