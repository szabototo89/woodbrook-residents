import type { BookingService } from './booking';
import styles from './jr-booking-journey.module.css';

type TreatmentPickerProps = Readonly<{
  services: readonly BookingService[];
  value: string;
  onChange: (serviceSlug: string) => void;
}>;

export function TreatmentPicker(props: TreatmentPickerProps) {
  return (
    <label className={styles.select}>
      <span className={styles.visuallyHidden}>Treatment</span>
      <select
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      >
        <option value="">Choose a treatment</option>
        {props.services.map((service) => (
          <option value={service.slug} key={service.slug}>
            {service.name} — €{service.priceCents / 100}
          </option>
        ))}
      </select>
    </label>
  );
}
