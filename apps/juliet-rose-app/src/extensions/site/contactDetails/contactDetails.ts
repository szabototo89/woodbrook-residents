export const CONTACT_DETAILS_COLLECTION_ID = 'ContactDetails';

export type ContactDetailField =
  'phoneLabel' | 'phoneHref' | 'emailLabel' | 'emailHref';

export type ContactDetails = Partial<Record<ContactDetailField, string | null>>;

export const CONTACT_DETAILS_DEFAULTS: Record<ContactDetailField, string> = {
  phoneLabel: '0852867059',
  phoneHref: 'tel:+353852867059',
  emailLabel: 'denizzza1@gmail.com',
  emailHref: 'mailto:denizzza1@gmail.com',
};
