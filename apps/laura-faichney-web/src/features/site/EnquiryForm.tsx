import { useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { Arrow } from './Arrow';
import {
  googleFormFields,
  googleFormSubmissionUrl,
} from './googleFormSubmission';
import type { CmsService, CmsSettings } from './lauraSanity';

export function EnquiryForm(props: {
  settings: CmsSettings;
  services: CmsService[];
  selectedService?: string;
}) {
  const initialService =
    props.services.some((service) => service.slug === props.selectedService) ||
    props.selectedService === 'other'
      ? props.selectedService
      : '';

  const [submitted, setSubmitted] = useState(false);
  const [enquiry, setEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service:
      props.services.find((service) => service.slug === initialService)
        ?.title ?? 'Other / not sure yet',
  });

  function readEnquiry(form: HTMLFormElement) {
    const fields = new FormData(form);
    const value = (name: string) => String(fields.get(name) ?? '').trim();
    return {
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      message: value('message'),
      service:
        props.services.find((service) => service.slug === value('service'))
          ?.title ?? 'Other / not sure yet',
    };
  }

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const fields = readEnquiry(form);
    function validateRequiredText(name: string, value: string) {
      const field = form.elements.namedItem(name);
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.setCustomValidity(value ? '' : 'Please fill in this field.');
      }
    }
    validateRequiredText('name', fields.name);
    validateRequiredText('message', fields.message);
    if (submitted || !form.reportValidity()) {
      event.preventDefault();
      return;
    }
    flushSync(() => setEnquiry(fields));
    setSubmitted(true);
  }

  return (
    <form
      className="enquiry-form contact-panel"
      id="enquiry"
      aria-labelledby="enquiry-heading"
      action={googleFormSubmissionUrl}
      method="post"
      target="_blank"
      rel="noopener noreferrer"
      onSubmit={submitEnquiry}
      onChange={(event) => {
        setSubmitted(false);
        setEnquiry(readEnquiry(event.currentTarget));
      }}
    >
      <h2 id="enquiry-heading">Send a Message</h2>
      <p>Tell me about your idea and let’s create something special.</p>
      <div className="enquiry-fields">
        <label htmlFor="enquiry-name">
          Your Name <span aria-hidden="true">*</span>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            placeholder="e.g. Sarah Murphy"
            required
            maxLength={120}
            onInput={(event) => event.currentTarget.setCustomValidity('')}
          />
        </label>
        <label htmlFor="enquiry-email">
          Your Email <span aria-hidden="true">*</span>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="e.g. sarah@email.com"
            required
            maxLength={254}
          />
        </label>
        <label htmlFor="enquiry-phone">
          Phone (optional)
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 089 123 4567"
            maxLength={40}
          />
        </label>
        <label htmlFor="enquiry-service">
          Service Interested In <span aria-hidden="true">*</span>
          <select
            id="enquiry-service"
            name="service"
            defaultValue={initialService}
            required
          >
            <option value="" disabled>
              Please select…
            </option>
            {props.services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
            <option value="other">Other / not sure yet</option>
          </select>
        </label>
        <label className="enquiry-message" htmlFor="enquiry-message">
          Your Message <span aria-hidden="true">*</span>
          <textarea
            id="enquiry-message"
            name="message"
            placeholder="Tell me about your idea, event or project…"
            required
            rows={5}
            maxLength={3000}
            onInput={(event) => event.currentTarget.setCustomValidity('')}
            aria-describedby="enquiry-help"
          />
        </label>
      </div>
      <button
        className="button button-primary"
        type="submit"
        disabled={submitted}
      >
        {submitted ? 'Enquiry submitted' : 'Send Enquiry'} <Arrow />
      </button>
      <p className="enquiry-help" id="enquiry-help">
        <span>Opens Google’s confirmation in a new tab.</span> Required fields
        are marked *. You can also{' '}
        <a href={`mailto:${props.settings.email}`}>email me directly</a>.
      </p>
      <div className="enquiry-status" role="status">
        {submitted && (
          <p>
            Check the Google confirmation tab to see whether your enquiry was
            recorded. Your details are still here; you can also email me
            directly.
          </p>
        )}
      </div>
      {Object.entries(googleFormFields(enquiry)).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </form>
  );
}
