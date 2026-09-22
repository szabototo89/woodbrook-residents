import styles from './featured-grid.module.css';
import {
  bookTreatmentUrl,
  formatFeaturedDuration,
  formatTreatmentPrice,
  type FeaturedTreatment,
} from '../../treatments/treatments';

type FeaturedCardProps = Readonly<{
  item: FeaturedTreatment;
  bookingBaseUrl: string;
}>;

export function FeaturedCard(props: FeaturedCardProps) {
  return (
    <a
      className={styles.treatmentCard}
      href={bookTreatmentUrl(props.item.treatment, props.bookingBaseUrl)}
    >
      {props.item.image ? (
        <img
          src={props.item.image}
          alt={props.item.imageAlt}
          width="1536"
          height="1024"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className={styles.treatmentCopy}>
        <h3>{props.item.treatment.name}</h3>
        <div className={styles.treatmentMeta}>
          <span className={styles.duration}>
            <span className={styles.iconClock} aria-hidden="true" />
            {formatFeaturedDuration(props.item.treatment.durationMinutes)}
          </span>
          <strong>
            {formatTreatmentPrice(props.item.treatment.priceCents)}
          </strong>
        </div>
        <span className={styles.cardButton} aria-hidden="true">
          Book now <span className={styles.iconArrow} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
