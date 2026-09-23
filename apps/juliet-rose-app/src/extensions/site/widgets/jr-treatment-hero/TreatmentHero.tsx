import { Flower2, Heart, Leaf } from 'lucide-react';
import type { CSSProperties } from 'react';

import styles from './jr-treatment-hero.module.css';
import { facialHeroImage } from '../../imageAssets';

export type TreatmentHeroProps = Readonly<{
  eyebrow?: string;
  title?: string;
  description?: string;
  scriptFirstLine?: string;
  scriptSecondLine?: string;
  scriptThirdLine?: string;
  imageUrl?: string;
}>;

const defaults = {
  eyebrow: 'Our services',
  title: 'Treatments & prices',
  description:
    'Choose a treatment and send an appointment request at a date and time that suits you.',
  scriptFirstLine: 'Relax',
  scriptSecondLine: 'and',
  scriptThirdLine: 'Rejuvenate',
  imageUrl: facialHeroImage,
} as const;

const highlights = [
  {
    title: 'Relax & unwind',
    description: 'Expert care, tailored to you',
    Icon: Leaf,
  },
  {
    title: 'Natural radiance',
    description: 'Real results, naturally',
    Icon: Flower2,
  },
  {
    title: 'A more confident you',
    description: 'Because you deserve it',
    Icon: Heart,
  },
] as const;

export function TreatmentHero(props: TreatmentHeroProps) {
  const scriptLines = [
    props.scriptFirstLine ?? defaults.scriptFirstLine,
    props.scriptSecondLine ?? defaults.scriptSecondLine,
    props.scriptThirdLine ?? defaults.scriptThirdLine,
  ];
  const backgroundStyle: CSSProperties & { '--jr-hero-image': string } = {
    '--jr-hero-image': `url("${props.imageUrl ?? defaults.imageUrl}")`,
  };

  return (
    <section
      className={styles.root}
      style={backgroundStyle}
      aria-labelledby="treatment-hero-heading"
    >
      <div className={styles.content}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>{props.eyebrow ?? defaults.eyebrow}</p>
          <h1 id="treatment-hero-heading">{props.title ?? defaults.title}</h1>
          <p>{props.description ?? defaults.description}</p>
        </header>

        <p className={styles.script} aria-hidden="true">
          {scriptLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        <ul className={styles.highlights}>
          {highlights.map(({ title, description, Icon }) => (
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
