import { TimeSlotPicker } from './TimeSlotPicker';

import './booking.css';

export default {
  WithTimes: (
    <TimeSlotPicker
      times={['10:00', '11:30', '14:00']}
      value="11:30"
      onChange={() => undefined}
    />
  ),
  Empty: <TimeSlotPicker times={[]} value="" onChange={() => undefined} />,
};
