import { addMonths } from 'date-fns';
import { enIE } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';

import { isBookableDate } from './availability';

type AppointmentDatePickerProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  today?: Date;
};

export function AppointmentDatePicker(props: AppointmentDatePickerProps) {
  const today = props.today ?? new Date();
  return (
    <DayPicker
      className="booking-calendar"
      mode="single"
      selected={props.selected}
      onSelect={(date) => props.onSelect(date)}
      defaultMonth={today}
      startMonth={today}
      endMonth={addMonths(today, 6)}
      disabled={(date) => !isBookableDate(date, today)}
      locale={enIE}
      showOutsideDays
      today={today}
    />
  );
}
