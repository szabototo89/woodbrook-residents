import { useState } from 'react';

import { isBookableDateString } from './booking';
import styles from './jr-booking-journey.module.css';

type JrBookingDateInputProps = Readonly<{
  value?: string;
  min: string;
  max: string;
  onSelect: (date: string | undefined) => void;
}>;

export function JrBookingDateInput(props: JrBookingDateInputProps) {
  const [error, setError] = useState<string>();
  return (
    <div>
      <input
        className={styles.dateInput}
        type="date"
        aria-label="Preferred date"
        value={props.value ?? ''}
        min={props.min}
        max={props.max}
        onChange={(event) => {
          const next = event.target.value;
          if (!next) {
            setError(undefined);
            props.onSelect(undefined);
            return;
          }
          if (!isBookableDateString(next, props.min)) {
            setError('Appointments are Monday to Friday.');
            props.onSelect(undefined);
            return;
          }
          setError(undefined);
          props.onSelect(next);
        }}
      />
      {error ? (
        <p className={styles.dateError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
