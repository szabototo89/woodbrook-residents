import type { ReactNode } from 'react';

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="shell narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="page-intro-copy">{children}</div>
      </div>
    </section>
  );
}
