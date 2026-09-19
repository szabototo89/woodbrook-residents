export type AvailabilityRequest = {
  treatmentSlug: string;
  date: string;
};

export type BookingCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type BookingRequest = AvailabilityRequest & {
  time: string;
  customer: BookingCustomer;
  notes?: string;
};

export type BookingConfirmation = {
  reference: string;
  status: 'requested';
};

export interface BookingProvider {
  listAvailableTimes(request: AvailabilityRequest): Promise<string[]>;
  createBooking(request: BookingRequest): Promise<BookingConfirmation>;
}
