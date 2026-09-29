import { Mail, Phone } from 'lucide-react';

export function ContactDetails() {
  return (
    <div className="contact-links">
      <a href="tel:+353894007747">
        <Phone size={20} strokeWidth={1.75} aria-hidden="true" /> 089-4007747
      </a>
      <a href="mailto:lauralfaichney@gmail.com">
        <Mail size={20} strokeWidth={1.75} aria-hidden="true" />{' '}
        lauralfaichney@gmail.com
      </a>
    </div>
  );
}
