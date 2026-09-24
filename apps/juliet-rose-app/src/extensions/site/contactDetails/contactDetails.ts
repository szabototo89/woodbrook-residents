import { mergeText } from '../homeContent/homeContent';

export const CONTACT_DETAILS_COLLECTION_ID = 'ContactDetails';

export type ContactDetailField = 'phone' | 'email';

export type ContactDetails = Partial<Record<ContactDetailField, string | null>>;

export const CONTACT_DETAILS_DEFAULTS: Record<ContactDetailField, string> = {
  phone: '+353852867059',
  email: 'denizzza1@gmail.com',
};

/**
 * Builds a tap-to-call link from a plain phone number. Editors only ever
 * type the number itself — the `tel:` scheme is added here. A value that
 * already carries a scheme is passed through untouched.
 */
export function toPhoneHref(phone: string): string {
  const trimmed = phone.trim();
  if (/^tel:/i.test(trimmed)) {
    return trimmed;
  }
  return `tel:${trimmed.replace(/\s+/g, '')}`;
}

/**
 * Builds an email link from a plain address. Editors only ever type the
 * address itself — the `mailto:` scheme is added here.
 */
export function toEmailHref(email: string): string {
  const trimmed = email.trim();
  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  return `mailto:${trimmed}`;
}

/**
 * Resolves a tap-to-contact link with the standard fallback chain:
 * explicit element prop, derived CMS link, derived default link. Empty
 * values fall through at every level.
 */
export function mergeContactLink(
  explicit: unknown,
  contactValue: unknown,
  buildHref: (value: string) => string,
  fallbackValue: string,
): string {
  const cmsHref =
    typeof contactValue === 'string' && contactValue.trim()
      ? buildHref(contactValue)
      : undefined;
  return mergeText(explicit, cmsHref, buildHref(fallbackValue));
}
