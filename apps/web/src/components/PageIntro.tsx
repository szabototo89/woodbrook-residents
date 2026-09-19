import type { ReactNode } from 'react';

export function PageIntro(props: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="shell narrow">
        <p className="eyebrow">{props.eyebrow}</p>
        <h1>{props.title}</h1>
        <div className="page-intro-copy">{props.children}</div>
      </div>
    </section>
  );
}
