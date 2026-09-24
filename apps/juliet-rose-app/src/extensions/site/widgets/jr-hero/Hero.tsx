import styles from './jr-hero.module.css';
import { resolveText } from '../../homeContent/homeContent';
import { facialHeroImage } from '../../imageAssets';

export type HeroProps = Readonly<{
  eyebrow?: string;
  title?: string;
  location?: string;
  copy?: string;
  copySecondLine?: string;
  bookingUrl?: string;
  treatmentsUrl?: string;
  policyUrl?: string;
  imageUrl?: string;
  imageSrcSet?: string;
  imageAlt?: string;
}>;

const defaultProps = {
  eyebrow: 'Beauty · Wellbeing · You',
  title: 'Relax and Revitalize',
  location: 'Beauty treatments in Stillorgan, South Dublin.',
  copy: 'A wide range of beauty treatments and products,',
  copySecondLine: 'all in one place.',
  bookingUrl: '/book',
  treatmentsUrl: '/treatments',
  policyUrl: '#booking-policy',
  imageUrl: facialHeroImage,
  imageAlt: 'A relaxing facial treatment at Juliet Rose Beauty Studio',
} as const;

export function Hero(props: HeroProps) {
  const eyebrow = resolveText(props.eyebrow, defaultProps.eyebrow);
  const title = resolveText(props.title, defaultProps.title);
  const location = resolveText(props.location, defaultProps.location);
  const copy = resolveText(props.copy, defaultProps.copy);
  const copySecondLine = resolveText(
    props.copySecondLine,
    defaultProps.copySecondLine,
  );
  const bookingUrl = resolveText(props.bookingUrl, defaultProps.bookingUrl);
  const treatmentsUrl = resolveText(
    props.treatmentsUrl,
    defaultProps.treatmentsUrl,
  );
  const policyUrl = resolveText(props.policyUrl, defaultProps.policyUrl);
  const imageUrl = resolveText(props.imageUrl, defaultProps.imageUrl);
  const imageSrcSet = props.imageSrcSet;
  const imageAlt = resolveText(props.imageAlt, defaultProps.imageAlt);

  return (
    <section className={styles.root} id="top" aria-labelledby="hero-heading">
      <img
        className={styles.image}
        src={imageUrl}
        srcSet={imageSrcSet}
        sizes="(max-width: 700px) 100vw, 840px"
        alt={imageAlt}
        width="840"
        height="420"
        fetchPriority="high"
      />
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title} id="hero-heading">
          {title}
        </h1>
        <p className={styles.location}>{location}</p>
        <p className={styles.copy}>
          {copy} <br />
          {copySecondLine}
        </p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href={bookingUrl}>
            Book an appointment{' '}
            <span className={styles.iconArrow} aria-hidden="true" />
          </a>
          <a className={styles.secondaryButton} href={treatmentsUrl}>
            View treatments
          </a>
        </div>
        <a className={styles.policyLink} href={policyUrl}>
          <span className={styles.bookingIcon} aria-hidden="true" /> Booking
          policy
        </a>
      </div>
    </section>
  );
}
