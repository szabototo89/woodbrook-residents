type TimeSlotPickerProps = {
  times: string[];
  value: string;
  onChange: (time: string) => void;
};

export function TimeSlotPicker({
  times,
  value,
  onChange,
}: TimeSlotPickerProps) {
  if (times.length === 0) {
    return (
      <p className="booking-hint">Choose a date to see preferred times.</p>
    );
  }

  return (
    <div className="time-grid" role="radiogroup" aria-label="Preferred time">
      {times.map((time) => (
        <label
          className={value === time ? 'is-selected' : undefined}
          key={time}
        >
          <input
            type="radio"
            name="appointment-time"
            value={time}
            checked={value === time}
            onChange={() => onChange(time)}
          />
          {time}
        </label>
      ))}
    </div>
  );
}
