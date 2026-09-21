import { AppointmentDatePicker } from './AppointmentDatePicker';

import './booking.css';

const today = new Date(2026, 9, 15);

export default (
  <AppointmentDatePicker
    selected={today}
    onSelect={() => undefined}
    today={today}
  />
);
