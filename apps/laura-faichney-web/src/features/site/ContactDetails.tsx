import { Mail, Phone } from 'lucide-react';

import type { CmsSettings } from './lauraSanity';

type ContactDetailsProps = { settings: CmsSettings };

export function ContactDetails(props: ContactDetailsProps) {
  if (!props.settings.email && !props.settings.phone) return null;
  return (
    <div className="contact-links">
      {props.settings.phone && (
        <a href={`tel:${props.settings.phone.replace(/[^+\d]/g, '')}`}>
          <Phone size={20} strokeWidth={1.75} aria-hidden="true" />{' '}
          {props.settings.phone}
        </a>
      )}
      {props.settings.email && (
        <a href={`mailto:${props.settings.email}`}>
          <Mail size={20} strokeWidth={1.75} aria-hidden="true" />{' '}
          {props.settings.email}
        </a>
      )}
    </div>
  );
}
