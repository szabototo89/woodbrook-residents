import { CustomerDetailsForm } from './CustomerDetailsForm';

import './booking.css';

export default {
  Default: <CustomerDetailsForm onSubmit={() => undefined} />,
  Disabled: <CustomerDetailsForm disabled={true} onSubmit={() => undefined} />,
};
