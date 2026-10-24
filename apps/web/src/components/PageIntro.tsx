import type { ReactNode } from 'react';

type PageIntroProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function PageIntro(props: PageIntroProps) {
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
