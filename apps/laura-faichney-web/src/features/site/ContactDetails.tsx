import { Mail, Phone } from 'lucide-react';

import type { CmsSettings } from './lauraSanity';

export function ContactDetails(props: { settings: CmsSettings }) {
  return (
    <div className="contact-links">
      <a href={`tel:${props.settings.phone.replace(/[^+\d]/g, '')}`}>
        <Phone size={20} strokeWidth={1.75} aria-hidden="true" />{' '}
        {props.settings.phone}
      </a>
      <a href={`mailto:${props.settings.email}`}>
        <Mail size={20} strokeWidth={1.75} aria-hidden="true" />{' '}
        {props.settings.email}
      </a>
    </div>
  );
}
