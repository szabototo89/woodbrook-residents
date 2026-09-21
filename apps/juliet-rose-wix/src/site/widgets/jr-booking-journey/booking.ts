export type BookingService = Readonly<{
  id: string;
  slug: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  scheduleId?: string;
}>;

export type TimeSlot = Readonly<{
  start: string;
  label: string;
  scheduleId?: string;
  resourceId?: string;
  locationType?: string;
}>;

export type CustomerDetails = Readonly<{
  name: string;
  email: string;
  phone: string;
  notes: string;
}>;

export type CustomerErrors = Readonly<{
  name?: string;
  email?: string;
  phone?: string;
}>;

export type BookingRequest = Readonly<{
  service: BookingService;
  date: string;
  slot: TimeSlot;
  customer: CustomerDetails;
}>;

export type BookingConfirmation = Readonly<{
  reference: string;
  status: 'requested';
}>;

export function toDateString(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseDateParts(date: string): [number, number, number] {
  const [year, month, day] = date.split('-').map(Number);
  return [year ?? 0, month ?? 1, day ?? 1];
}

export function isBookableDateString(date: string, today: string): boolean {
  if (date < today) {
    return false;
  }
  const [year, month, day] = parseDateParts(date);
  const weekday = new Date(year, month - 1, day).getDay();
  return weekday >= 1 && weekday <= 5;
}

export function formatBookingDate(date: string): string {
  const [year, month, day] = parseDateParts(date);
  const parts = new Intl.DateTimeFormat('en-IE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(new Date(year, month - 1, day));
  const valueOf = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${valueOf('weekday')}, ${valueOf('day')} ${valueOf('month')} ${valueOf('year')}`;
}

export function toTimeSlotLabel(localStartDate: string): string {
  return localStartDate.slice(11, 16);
}

export function validateCustomer(details: CustomerDetails): CustomerErrors {
  if (!details.name.trim()) {
    return { name: 'Enter your name' };
  }
  if (!/^\S+@\S+\.\S+$/.test(details.email)) {
    return { email: 'Enter a valid email address' };
  }
  if (details.phone.trim().length < 7) {
    return { phone: 'Enter a phone number' };
  }
  return {};
}

/** Editor preview services. Clearly fake ids, never booked from. */
export const MOCK_SERVICES: readonly BookingService[] = [
  {
    id: 'preview-swedish-massage',
    slug: 'swedish-massage',
    name: 'Swedish massage',
    durationMinutes: 60,
    priceCents: 8000,
  },
  {
    id: 'preview-signature-facial',
    slug: 'juliet-rose-signature-facial',
    name: 'Juliet Rose Signature Facial',
    durationMinutes: 60,
    priceCents: 9500,
  },
  {
    id: 'preview-microneedling',
    slug: 'microneedling',
    name: 'Microneedling',
    durationMinutes: 60,
    priceCents: 13000,
  },
];

/** Editor preview slots for any date. Never booked from. */
export function MOCK_SLOTS(date: string): readonly TimeSlot[] {
  return ['10:00', '11:30', '14:00', '16:30'].map((label) => ({
    start: `${date}T${label}:00`,
    label,
  }));
}

export function mockConfirmation(): BookingConfirmation {
  return { reference: 'PREVIEW-0000', status: 'requested' };
}
