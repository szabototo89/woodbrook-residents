export const BOOKING_POLICY_COLLECTION_ID = 'BookingPolicy';

export type BookingPolicyField =
  'eyebrow' | 'title' | 'copy' | 'fullLabel' | 'fullUrl';

export type BookingPolicyContent = Partial<
  Record<BookingPolicyField, string | null>
>;

export const BOOKING_POLICY_DEFAULTS: Record<BookingPolicyField, string> = {
  eyebrow: 'Before your appointment',
  title: 'Booking policy',
  copy: 'Please arrive on time and attend your appointment alone. If you need to cancel or rearrange, please give at least 24 hours’ notice. Late cancellations and no-shows may be charged.',
  fullLabel: 'Read the full policy',
  fullUrl: 'https://www.julietrosebeauty.com/',
};
