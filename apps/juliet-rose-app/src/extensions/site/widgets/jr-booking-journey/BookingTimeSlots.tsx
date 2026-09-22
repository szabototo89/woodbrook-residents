import type { TimeSlot } from './booking';
import styles from './jr-booking-journey.module.css';

type BookingTimeSlotsProps = Readonly<{
  slots: readonly TimeSlot[];
  value: string;
  onChange: (start: string) => void;
}>;

export function BookingTimeSlots(props: BookingTimeSlotsProps) {
  if (props.slots.length === 0) {
    return <p className={styles.hint}>Choose a date to see preferred times.</p>;
  }

  return (
    <div
      className={styles.timeGrid}
      role="radiogroup"
      aria-label="Preferred time"
    >
      {props.slots.map((slot) => (
        <label
          className={props.value === slot.start ? styles.isSelected : undefined}
          key={slot.start}
        >
          <input
            type="radio"
            name="appointment-time"
            value={slot.start}
            checked={props.value === slot.start}
            onChange={() => props.onChange(slot.start)}
          />
          {slot.label}
        </label>
      ))}
    </div>
  );
}
