import styles from './booking-policy.module.css';

export type BookingPolicyProps = Readonly<{
  eyebrow?: string;
  title?: string;
  copy?: string;
  fullUrl?: string;
  fullLabel?: string;
}>;

const defaultProps = {
  eyebrow: 'Before your appointment',
  title: 'Booking policy',
  copy: 'Please arrive on time and attend your appointment alone. If you need to cancel or rearrange, please give at least 24 hours’ notice. Late cancellations and no-shows may be charged.',
  fullUrl: 'https://www.julietrosebeauty.com/',
  fullLabel: 'Read the full policy',
} as const;

export function BookingPolicy(props: BookingPolicyProps) {
  const eyebrow = props.eyebrow ?? defaultProps.eyebrow;
  const title = props.title ?? defaultProps.title;
  const copy = props.copy ?? defaultProps.copy;
  const fullUrl = props.fullUrl ?? defaultProps.fullUrl;
  const fullLabel = props.fullLabel ?? defaultProps.fullLabel;

  return (
    <div className={styles.root}>
      <section
        className={styles.policy}
        id="booking-policy"
        aria-labelledby="policy-heading"
      >
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.sectionTitle} id="policy-heading">
            {title}
          </h2>
        </div>
        <p>{copy}</p>
        <a href={fullUrl}>{fullLabel}</a>
      </section>
    </div>
  );
}
