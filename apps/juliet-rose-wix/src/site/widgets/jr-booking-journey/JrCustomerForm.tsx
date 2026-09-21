import { useState } from 'react';

import {
  validateCustomer,
  type CustomerDetails,
  type CustomerErrors,
} from './booking';

type JrCustomerFormProps = Readonly<{
  disabled?: boolean;
  onSubmit: (details: CustomerDetails) => void | Promise<void>;
}>;

const EMPTY_DETAILS: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  notes: '',
};

export function JrCustomerForm(props: JrCustomerFormProps) {
  const disabled = props.disabled ?? false;
  const [values, setValues] = useState<CustomerDetails>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<Key extends keyof CustomerDetails>(key: Key, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateCustomer(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      await props.onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="customer-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <div className="customer-fields">
        <label>
          Name
          <input
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={errors.name !== undefined}
            disabled={disabled}
            required
          />
          <span className="field-error">{errors.name}</span>
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={errors.email !== undefined}
            disabled={disabled}
            required
          />
          <span className="field-error">{errors.email}</span>
        </label>

        <label>
          Phone
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="085 123 4567"
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
            aria-invalid={errors.phone !== undefined}
            disabled={disabled}
            required
          />
          <span className="field-error">{errors.phone}</span>
        </label>
      </div>

      <label>
        <span className="field-label">
          Notes <span>(optional)</span>
        </span>
        <textarea
          name="notes"
          placeholder="Is there anything we should know?"
          value={values.notes}
          onChange={(event) => update('notes', event.target.value)}
          disabled={disabled}
          rows={4}
        />
      </label>

      <div className="booking-submit-row">
        <label className="booking-consent">
          <input type="checkbox" disabled={disabled} />
          <span>I agree to be contacted about my appointment request.</span>
        </label>

        <button
          className="primary-button booking-submit"
          type="submit"
          disabled={disabled || submitting}
        >
          {submitting ? 'Sending request…' : 'Request appointment'}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
