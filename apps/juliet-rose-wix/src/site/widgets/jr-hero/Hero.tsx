import styles from './jr-hero.module.css';

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
  imageUrl: '/images/facial-hero.jpg',
  imageSrcSet: '/images/facial-hero-640.jpg 640w, /images/facial-hero.jpg 840w',
  imageAlt: 'A relaxing facial treatment at Juliet Rose Beauty Studio',
} as const;

export function Hero(props: HeroProps) {
  const eyebrow = props.eyebrow ?? defaultProps.eyebrow;
  const title = props.title ?? defaultProps.title;
  const location = props.location ?? defaultProps.location;
  const copy = props.copy ?? defaultProps.copy;
  const copySecondLine = props.copySecondLine ?? defaultProps.copySecondLine;
  const bookingUrl = props.bookingUrl ?? defaultProps.bookingUrl;
  const treatmentsUrl = props.treatmentsUrl ?? defaultProps.treatmentsUrl;
  const policyUrl = props.policyUrl ?? defaultProps.policyUrl;
  const imageUrl = props.imageUrl ?? defaultProps.imageUrl;
  const imageSrcSet = props.imageSrcSet ?? defaultProps.imageSrcSet;
  const imageAlt = props.imageAlt ?? defaultProps.imageAlt;

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
