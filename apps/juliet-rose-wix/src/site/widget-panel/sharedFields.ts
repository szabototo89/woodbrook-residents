import type { PanelField } from './panelFields';

const BOOKING_LINKS: Readonly<Record<string, { label: string; help: string }>> =
  {
    'booking-base-url': {
      label: 'Booking link',
      help: 'Base booking page, e.g. /book. Booking buttons append ?service=<slug>.',
    },
    'booking-url': {
      label: 'Booking link',
      help: 'Booking page, e.g. /book.',
    },
    'treatments-url': {
      label: 'Treatments link',
      help: 'Treatments page, e.g. /treatments.',
    },
    'contact-url': {
      label: 'Contact link',
      help: 'Contact anchor or page, e.g. /#contact.',
    },
    'gift-card-url': {
      label: 'Gift card link',
      help: 'Gift card page, e.g. /gift-cards.',
    },
    'gift-cards-url': {
      label: 'Gift card link',
      help: 'Gift card page, e.g. /gift-cards.',
    },
    'card-url': {
      label: 'Gift card link',
      help: 'Gift card page, e.g. /gift-cards.',
    },
    'home-url': {
      label: 'Home link',
      help: 'Home page, e.g. /.',
    },
    'policy-url': {
      label: 'Policy link',
      help: 'Booking policy anchor or page, e.g. #booking-policy.',
    },
    'full-url': {
      label: 'Full policy link',
      help: 'Full external policy page URL.',
    },
    'checkout-url': {
      label: 'Checkout link',
      help: 'External gift-card checkout URL.',
    },
    'instagram-url': {
      label: 'Instagram link',
      help: 'Full Instagram profile URL.',
    },
    'view-all-href': {
      label: 'View-all link',
      help: 'Destination for the view-all action, e.g. /treatments.',
    },
  };

const CONTACT_FIELDS: Readonly<
  Record<string, { label: string; help: string }>
> = {
  'phone-href': {
    label: 'Phone link',
    help: 'Telephone link starting with tel:, e.g. tel:+353852867059.',
  },
  'phone-label': {
    label: 'Phone label',
    help: 'Phone number text shown to visitors.',
  },
  'email-href': {
    label: 'Email link',
    help: 'Email link starting with mailto:, e.g. mailto:studio@example.com.',
  },
  'email-label': {
    label: 'Email label',
    help: 'Email text shown to visitors.',
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
      ? 'Describe the image for screen readers.'
      : 'Wix Media URL. Replaces the local preview image at install time.',
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
      help: 'Label of the view-all button.',
    },
    bookingLinkField('view-all-href'),
  ];
}

export function describeFieldKeys(
  fields: readonly PanelField[],
): readonly string[] {
  return fields.map((field) => field.key);
}
