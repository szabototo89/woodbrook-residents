export function Eyebrow(props: { children: React.ReactNode; brush?: boolean }) {
  return (
    <p className={props.brush ? 'eyebrow brush-accent' : 'eyebrow'}>
      {props.children}
    </p>
  );
}
