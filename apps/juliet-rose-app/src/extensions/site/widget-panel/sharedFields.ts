import type { PanelField } from './panelFields';

const BOOKING_LINKS: Readonly<Record<string, { label: string; help: string }>> =
  {
    'booking-base-url': {
      label: 'Booking link',
      help: 'Booking page the widget links to. Treatment buttons append ?service=<slug>, so /book becomes /book?service=swedish-massage.',
    },
    'booking-url': {
      label: 'Booking link',
      help: 'Booking page opened by booking buttons, e.g. /book.',
    },
    'treatments-url': {
      label: 'Treatments link',
      help: 'Page listing all treatments, opened by treatments links, e.g. /treatments.',
    },
    'contact-url': {
      label: 'Contact link',
      help: 'Contact section or page opened by contact buttons, e.g. /#contact.',
    },
    'gift-card-url': {
      label: 'Gift card link',
      help: 'Gift card page opened by the gift-card button, e.g. /gift-cards.',
    },
    'gift-cards-url': {
      label: 'Gift card link',
      help: 'Gift card page opened by gift-card links, e.g. /gift-cards.',
    },
    'card-url': {
      label: 'Gift card link',
      help: 'Gift card page opened by the gift-card button, e.g. /gift-cards.',
    },
    'home-url': {
      label: 'Home link',
      help: 'Home page opened by the logo and home links, e.g. /.',
    },
    'policy-url': {
      label: 'Policy link',
      help: 'Booking policy section opened by policy links, e.g. #booking-policy.',
    },
    'full-url': {
      label: 'Full policy link',
      help: 'Full booking policy page opened in a new tab when visitors want the complete terms.',
    },
    'checkout-url': {
      label: 'Checkout link',
      help: 'External checkout page where visitors buy the gift card.',
    },
    'instagram-url': {
      label: 'Instagram link',
      help: 'Studio Instagram profile opened by the footer icon.',
    },
    'view-all-href': {
      label: 'View-all link',
      help: 'Page opened by the view-all button, e.g. /treatments.',
    },
  };

const CONTACT_FIELDS: Readonly<
  Record<string, { label: string; help: string }>
> = {
  'phone-href': {
    label: 'Phone link',
    help: 'Number dialed when visitors tap the phone link. Must start with tel:, e.g. tel:+353852867059.',
  },
  'phone-label': {
    label: 'Phone label',
    help: 'Phone number text visitors see, e.g. 085 286 7059. Tapping it dials the Phone link above.',
  },
  'email-href': {
    label: 'Email link',
    help: 'Address emailed when visitors tap the email link. Must start with mailto:, e.g. mailto:studio@example.com.',
  },
  'email-label': {
    label: 'Email label',
    help: 'Email text visitors see. Tapping it opens the Email link above.',
  },
};

export function bookingLinkField(key: string): PanelField {
  const preset = BOOKING_LINKS[key];
  return {
    key,
    label: preset?.label ?? 'Link',
    kind: 'url',
    help: preset?.help ?? 'Relative link or anchor, e.g. /treatments.',
    placeholder: '/book',
  };
}

export function contactField(key: string): PanelField {
  const preset = CONTACT_FIELDS[key];
  return {
    key,
    label: preset?.label ?? key,
    kind: key.endsWith('-label') ? 'text' : 'url',
    help: preset?.help,
  };
}

export function imageField(key: string): PanelField {
  const isAlt = key.endsWith('-alt');
  return {
    key,
    label: isAlt ? 'Image alt text' : 'Image URL',
    kind: 'url',
    help: isAlt
      ? 'Text describing the photo for screen readers and search. Say what the photo shows, e.g. the treatment room.'
      : 'Photo shown in the widget. Use a Wix Media URL; it replaces the local preview image at install time.',
    placeholder: isAlt ? undefined : '/images/studio-interior.jpg',
  };
}

export function textField(
  key: string,
  label: string,
  help?: string,
): PanelField {
  return { key, label, kind: 'text', help };
}

export function longTextField(
  key: string,
  label: string,
  help?: string,
): PanelField {
  return { key, label, kind: 'longText', help };
}

export function viewAllFields(): readonly PanelField[] {
  return [
    {
      key: 'view-all-label',
      label: 'View-all label',
      kind: 'text',
      help: 'Text on the button that leads to the full list, e.g. View all treatments.',
    },
    bookingLinkField('view-all-href'),
  ];
}

export function describeFieldKeys(
  fields: readonly PanelField[],
): readonly string[] {
  return fields.map((field) => field.key);
}
