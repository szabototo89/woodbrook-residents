import styles from './jr-studio-sections.module.css';

export type StudioSectionsProps = Readonly<{
  giftEyebrow?: string;
  giftTitle?: string;
  giftCopyLead?: string;
  giftCopyRest?: string;
  giftButtonLabel?: string;
  giftCardUrl?: string;
  visitEyebrow?: string;
  visitTitle?: string;
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
  policyEyebrow?: string;
  policyTitle?: string;
  policyCopy?: string;
  policyFullUrl?: string;
  policyFullLabel?: string;
}>;

const defaultProps = {
  giftEyebrow: 'Gift cards',
  giftTitle: 'The perfect gift',
  giftCopyLead: 'Treat someone special to a Juliet Rose gift card.',
  giftCopyRest: 'Available for any treatment or amount.',
  giftButtonLabel: 'Buy a gift card',
  giftCardUrl: '/gift-cards',
  visitEyebrow: 'Visit us',
  visitTitle: 'Juliet Rose beauty studio',
  address: '10 Merville road, Stillorgan, Dublin, Ireland, A94YV78',
  hoursDays: 'Monday – Friday',
  hoursTime: '10.00am – 8.00pm',
  phoneHref: 'tel:+353852867059',
  phoneLabel: '0852867059',
  emailHref: 'mailto:denizzza1@gmail.com',
  emailLabel: 'denizzza1@gmail.com',
  contactButtonLabel: 'Contact Diana',
  studioImageUrl: '/images/studio-interior.jpg',
  studioImageAlt: 'The warm and private Juliet Rose treatment studio',
  policyEyebrow: 'Before your appointment',
  policyTitle: 'Booking policy',
  policyCopy:
    'Please arrive on time and attend your appointment alone. If you need to cancel or rearrange, please give at least 24 hours’ notice. Late cancellations and no-shows may be charged.',
  policyFullUrl: 'https://www.julietrosebeauty.com/',
  policyFullLabel: 'Read the full policy',
} as const;

export function StudioSections(props: StudioSectionsProps) {
  const giftEyebrow = props.giftEyebrow ?? defaultProps.giftEyebrow;
  const giftTitle = props.giftTitle ?? defaultProps.giftTitle;
  const giftCopyLead = props.giftCopyLead ?? defaultProps.giftCopyLead;
  const giftCopyRest = props.giftCopyRest ?? defaultProps.giftCopyRest;
  const giftButtonLabel = props.giftButtonLabel ?? defaultProps.giftButtonLabel;
  const giftCardUrl = props.giftCardUrl ?? defaultProps.giftCardUrl;
  const visitEyebrow = props.visitEyebrow ?? defaultProps.visitEyebrow;
  const visitTitle = props.visitTitle ?? defaultProps.visitTitle;
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
  const policyEyebrow = props.policyEyebrow ?? defaultProps.policyEyebrow;
  const policyTitle = props.policyTitle ?? defaultProps.policyTitle;
  const policyCopy = props.policyCopy ?? defaultProps.policyCopy;
  const policyFullUrl = props.policyFullUrl ?? defaultProps.policyFullUrl;
  const policyFullLabel = props.policyFullLabel ?? defaultProps.policyFullLabel;

  return (
    <div className={styles.root}>
      <section
        className={styles.gift}
        id="gift-cards"
        aria-labelledby="gift-heading"
      >
        <div className={styles.giftVisual} aria-hidden="true" />
        <div className={styles.giftCopy}>
          <p className={styles.eyebrow}>{giftEyebrow}</p>
          <h2 className={styles.sectionTitle} id="gift-heading">
            {giftTitle}
          </h2>
          <p>
            {giftCopyLead}
            <br />
            {giftCopyRest}
          </p>
        </div>
        <a className={styles.giftButton} href={giftCardUrl}>
          {giftButtonLabel}{' '}
          <span className={styles.iconArrow} aria-hidden="true" />
        </a>
      </section>

      <section
        className={styles.visit}
        id="contact"
        aria-labelledby="visit-heading"
      >
        <div className={styles.visitCopy}>
          <p className={styles.eyebrow}>{visitEyebrow}</p>
          <h2 className={styles.sectionTitle} id="visit-heading">
            {visitTitle}
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

      <section
        className={styles.policy}
        id="booking-policy"
        aria-labelledby="policy-heading"
      >
        <div>
          <p className={styles.eyebrow}>{policyEyebrow}</p>
          <h2 className={styles.sectionTitle} id="policy-heading">
            {policyTitle}
          </h2>
        </div>
        <p>{policyCopy}</p>
        <a href={policyFullUrl}>{policyFullLabel}</a>
      </section>
    </div>
  );
}
