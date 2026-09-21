import { CustomerDetailsForm } from './CustomerDetailsForm';

export default {
  Default: <CustomerDetailsForm onSubmit={() => undefined} />,
  Disabled: <CustomerDetailsForm disabled={true} onSubmit={() => undefined} />,
};
