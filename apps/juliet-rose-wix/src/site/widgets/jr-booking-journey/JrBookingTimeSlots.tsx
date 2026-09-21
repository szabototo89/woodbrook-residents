import type { TimeSlot } from './booking';

type JrBookingTimeSlotsProps = Readonly<{
  slots: readonly TimeSlot[];
  value: string;
  onChange: (start: string) => void;
}>;

export function JrBookingTimeSlots(props: JrBookingTimeSlotsProps) {
  if (props.slots.length === 0) {
    return (
      <p className="booking-hint">Choose a date to see preferred times.</p>
    );
  }

  return (
    <div className="time-grid" role="radiogroup" aria-label="Preferred time">
      {props.slots.map((slot) => (
        <label
          className={props.value === slot.start ? 'is-selected' : undefined}
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
