import { createDailySlots } from './availability';
import type {
  BookingConfirmation,
  BookingProvider,
  BookingRequest,
} from './bookingProvider';
import { requireTreatmentBySlug } from '../treatments/treatmentCatalog';

export function createLocalBookingProvider(): BookingProvider {
  return {
    async listAvailableTimes({ treatmentSlug }) {
      const treatment = requireTreatmentBySlug(treatmentSlug);
      return createDailySlots(treatment.durationMinutes);
    },
    async createBooking(request: BookingRequest): Promise<BookingConfirmation> {
      requireTreatmentBySlug(request.treatmentSlug);
      return {
        reference: `JR-${request.date.replaceAll('-', '')}-${request.time.replace(':', '')}`,
        status: 'requested',
      };
    },
  };
}
