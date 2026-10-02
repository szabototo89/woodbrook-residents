import { useState, type FormEvent } from 'react';
import { Arrow } from './Arrow';
import { enquiryMailto } from './enquiryMailto';
import type { CmsService, CmsSettings } from './lauraSanity';

export function EnquiryForm(props: {
  settings: CmsSettings;
  services: CmsService[];
  selectedService?: string;
}) {
  const [draft, setDraft] = useState('');
  const initialService =
    props.services.some((service) => service.slug === props.selectedService) ||
    props.selectedService === 'other'
      ? props.selectedService
      : '';

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const value = (name: string) => String(fields.get(name) ?? '').trim();
    function validateRequiredText(name: string) {
      const field = form.elements.namedItem(name);
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.setCustomValidity(
          value(name) ? '' : 'Please fill in this field.',
        );
      }
    }
    validateRequiredText('name');
    validateRequiredText('message');
    if (!form.reportValidity()) return;
    const service = props.services.find(
      (item) => item.slug === value('service'),
    );
    const url = enquiryMailto(props.settings, {
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      service: service?.title ?? 'Other / not sure yet',
      message: value('message'),
    });
    setDraft(url);
    window.location.assign(url);
  }

  return (
    <form
      className="enquiry-form contact-panel"
      id="enquiry"
      aria-labelledby="enquiry-heading"
      onSubmit={submitEnquiry}
      onChange={() => setDraft('')}
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
      <button className="button button-primary" type="submit">
        Send Enquiry <Arrow />
      </button>
      <p className="enquiry-help" id="enquiry-help">
        Opens a draft in your email app for you to send. Required fields are
        marked *. You can also{' '}
        <a href={`mailto:${props.settings.email}`}>email me directly</a>.
      </p>
      <div className="enquiry-status" role="status">
        {draft && (
          <>
            <p>
              Your email draft is ready. Send it in your email app to complete
              your enquiry.
            </p>
            <a href={draft}>Open email draft</a>
          </>
        )}
      </div>
    </form>
  );
}
