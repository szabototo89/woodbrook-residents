export function GalleryImage(props: { src: string; alt: string }) {
  return (
    <img
      src={props.src}
      alt={props.alt}
      width="640"
      height="480"
      loading="lazy"
    />
  );
}
