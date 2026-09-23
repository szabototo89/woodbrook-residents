import styles from './visit-us.module.css';
import { studioInteriorImage } from '../../imageAssets';

export type VisitUsProps = Readonly<{
  eyebrow?: string;
  title?: string;
  address?: string;
  hoursDays?: string;
  hoursTime?: string;
  phoneHref?: string;
  phoneLabel?: string;
  emailHref?: string;
  emailLabel?: string;
  contactButtonLabel?: string;
  studioImageUrl?: string;
  studioImageAlt?: string;
}>;

const defaultProps = {
  eyebrow: 'Visit us',
  title: 'Juliet Rose beauty studio',
  address: '10 Merville road, Stillorgan, Dublin, Ireland, A94YV78',
  hoursDays: 'Monday – Friday',
  hoursTime: '10.00am – 8.00pm',
  phoneHref: 'tel:+353852867059',
  phoneLabel: '0852867059',
  emailHref: 'mailto:denizzza1@gmail.com',
  emailLabel: 'denizzza1@gmail.com',
  contactButtonLabel: 'Contact Diana',
  studioImageUrl: studioInteriorImage,
  studioImageAlt: 'The warm and private Juliet Rose treatment studio',
} as const;

export function VisitUs(props: VisitUsProps) {
  const eyebrow = props.eyebrow ?? defaultProps.eyebrow;
  const title = props.title ?? defaultProps.title;
  const address = props.address ?? defaultProps.address;
  const hoursDays = props.hoursDays ?? defaultProps.hoursDays;
  const hoursTime = props.hoursTime ?? defaultProps.hoursTime;
  const phoneHref = props.phoneHref ?? defaultProps.phoneHref;
  const phoneLabel = props.phoneLabel ?? defaultProps.phoneLabel;
  const emailHref = props.emailHref ?? defaultProps.emailHref;
  const emailLabel = props.emailLabel ?? defaultProps.emailLabel;
  const contactButtonLabel =
    props.contactButtonLabel ?? defaultProps.contactButtonLabel;
  const studioImageUrl = props.studioImageUrl ?? defaultProps.studioImageUrl;
  const studioImageAlt = props.studioImageAlt ?? defaultProps.studioImageAlt;

  return (
    <div className={styles.root}>
      <section
        className={styles.visit}
        id="contact"
        aria-labelledby="visit-heading"
      >
        <div className={styles.visitCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.sectionTitle} id="visit-heading">
            {title}
          </h2>
          <p className={styles.address}>{address}</p>

          <div className={styles.contactRow}>
            <span className={styles.contactItem}>
              <span className={styles.iconClock} aria-hidden="true" />
              <span>
                {hoursDays}
                <br />
                {hoursTime}
              </span>
            </span>
            <a className={styles.contactItem} href={phoneHref}>
              <span className={styles.iconPhone} aria-hidden="true" />{' '}
              {phoneLabel}
            </a>
            <a className={styles.contactItem} href={emailHref}>
              <span className={styles.iconEmail} aria-hidden="true" />{' '}
              {emailLabel}
            </a>
            <a className={styles.contactButton} href={emailHref}>
              {contactButtonLabel}{' '}
              <span className={styles.iconArrow} aria-hidden="true" />
            </a>
            <a className={styles.contactPolicy} href="#booking-policy">
              <span className={styles.bookingIcon} aria-hidden="true" /> Booking
              policy
            </a>
          </div>
        </div>
        <img
          className={styles.studioImage}
          src={studioImageUrl}
          alt={studioImageAlt}
          width="1536"
          height="1024"
          loading="lazy"
          decoding="async"
        />
      </section>
    </div>
  );
}
