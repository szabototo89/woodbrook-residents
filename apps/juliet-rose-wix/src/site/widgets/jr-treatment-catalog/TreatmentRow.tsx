import styles from './treatment-catalog.module.css';
import {
  bookTreatmentUrl,
  formatTreatmentDuration,
  formatTreatmentPrice,
  type Treatment,
} from '../../treatments/treatments';

type TreatmentRowProps = Readonly<{
  treatment: Treatment;
  bookingBaseUrl: string;
}>;

export function TreatmentRow(props: TreatmentRowProps) {
  return (
    <li className={styles.row}>
      <div>
        <h3>{props.treatment.name}</h3>
        <p>{formatTreatmentDuration(props.treatment.durationMinutes)}</p>
      </div>
      <div className={styles.rowAction}>
        <strong>{formatTreatmentPrice(props.treatment.priceCents)}</strong>
        <a
          aria-label={`Book ${props.treatment.name}`}
          href={bookTreatmentUrl(props.treatment, props.bookingBaseUrl)}
        >
          Book
        </a>
      </div>
    </li>
  );
}
