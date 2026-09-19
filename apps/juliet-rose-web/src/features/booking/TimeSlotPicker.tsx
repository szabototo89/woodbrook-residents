type TimeSlotPickerProps = {
  times: string[];
  value: string;
  onChange: (time: string) => void;
};

export function TimeSlotPicker(props: TimeSlotPickerProps) {
  if (props.times.length === 0) {
    return (
      <p className="booking-hint">Choose a date to see preferred times.</p>
    );
  }

  return (
    <div className="time-grid" role="radiogroup" aria-label="Preferred time">
      {props.times.map((time) => (
        <label
          className={props.value === time ? 'is-selected' : undefined}
          key={time}
        >
          <input
            type="radio"
            name="appointment-time"
            value={time}
            checked={props.value === time}
            onChange={() => props.onChange(time)}
          />
          {time}
        </label>
      ))}
    </div>
  );
}
