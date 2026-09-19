import { useForm } from '@tanstack/react-form';

import type { BookingCustomer } from './bookingProvider';

export type CustomerDetails = BookingCustomer & { notes: string };

type CustomerDetailsFormProps = {
  disabled?: boolean;
  onSubmit: (details: CustomerDetails) => void | Promise<void>;
};

function fieldError(errors: unknown[]): string | undefined {
  return errors.find((error): error is string => typeof error === 'string');
}

export function CustomerDetailsForm(props: CustomerDetailsFormProps) {
  const disabled = props.disabled ?? false;
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
    onSubmit: async ({ value }) => props.onSubmit(value),
  });

  return (
    <form
      className="customer-form"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="customer-fields">
        <form.Field
          name="name"
          validators={{
            onSubmit: ({ value }) =>
              value.trim() ? undefined : 'Enter your name',
          }}
        >
          {(field) => (
            <label>
              Name
              <input
                name={field.name}
                autoComplete="name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
                disabled={disabled}
                required
              />
              <span className="field-error">
                {fieldError(field.state.meta.errors)}
              </span>
            </label>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onSubmit: ({ value }) =>
              /^\S+@\S+\.\S+$/.test(value)
                ? undefined
                : 'Enter a valid email address',
          }}
        >
          {(field) => (
            <label>
              Email
              <input
                name={field.name}
                type="email"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
                disabled={disabled}
                required
              />
              <span className="field-error">
                {fieldError(field.state.meta.errors)}
              </span>
            </label>
          )}
        </form.Field>

        <form.Field
          name="phone"
          validators={{
            onSubmit: ({ value }) =>
              value.trim().length >= 7 ? undefined : 'Enter a phone number',
          }}
        >
          {(field) => (
            <label>
              Phone
              <input
                name={field.name}
                type="tel"
                autoComplete="tel"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
                disabled={disabled}
                required
              />
              <span className="field-error">
                {fieldError(field.state.meta.errors)}
              </span>
            </label>
          )}
        </form.Field>
      </div>

      <form.Field name="notes">
        {(field) => (
          <label>
            Notes <span>(optional)</span>
            <textarea
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              disabled={disabled}
              rows={4}
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <button
            className="primary-button booking-submit"
            type="submit"
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? 'Sending request…' : 'Request appointment'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
