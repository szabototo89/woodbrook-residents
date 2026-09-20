import type { LucideIcon } from 'lucide-react';

export type EditorialPageHeroHighlight = Readonly<{
  title: string;
  description: string;
  Icon: LucideIcon;
}>;

type EditorialPageHeroProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  scriptLines: readonly [string, ...string[]];
  highlights: readonly [
    EditorialPageHeroHighlight,
    EditorialPageHeroHighlight,
    EditorialPageHeroHighlight,
  ];
}>;

export function EditorialPageHero(props: EditorialPageHeroProps) {
  return (
    <section className="editorial-page-hero">
      <div className="editorial-page-hero-content page-width">
        <header className="editorial-page-hero-heading">
          <p className="eyebrow">{props.eyebrow}</p>
          <h1>{props.title}</h1>
          <p>{props.description}</p>
        </header>

        <p className="editorial-page-hero-script" aria-hidden="true">
          {props.scriptLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>

        <ul className="editorial-page-hero-highlights">
          {props.highlights.map(({ title, description, Icon }) => (
            <li key={title}>
              <Icon aria-hidden="true" strokeWidth={1.5} />
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
