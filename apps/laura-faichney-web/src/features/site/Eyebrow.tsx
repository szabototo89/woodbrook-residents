type EyebrowProps = { children: React.ReactNode; brush?: boolean };

export function Eyebrow(props: EyebrowProps) {
  if (!props.children) return null;
  return (
    <p className={props.brush ? 'eyebrow brush-accent' : 'eyebrow'}>
      {props.children}
    </p>
  );
}
