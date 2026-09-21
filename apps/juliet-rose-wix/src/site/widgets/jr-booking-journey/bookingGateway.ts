import { availabilityTimeSlots, bookings, services } from '@wix/bookings';
import { createClient } from '@wix/sdk';
import { site } from '@wix/site';

import {
  toTimeSlotLabel,
  type BookingConfirmation,
  type BookingRequest,
  type BookingService,
  type TimeSlot,
} from './booking';

type ServiceShape = {
  readonly _id?: string | null;
  readonly name?: string | null;
  readonly category?: { readonly name?: string | null } | null;
  readonly supportedSlugs?:
    | readonly {
        readonly name?: string | null;
        readonly custom?: boolean | null;
      }[]
    | null;
  readonly schedule?: {
    readonly _id?: string | null;
    readonly availabilityConstraints?: {
      readonly durations?: readonly { readonly minutes?: number }[] | null;
    } | null;
  } | null;
  readonly payment?: {
    readonly fixed?: {
      readonly price?: { readonly value?: string } | null;
    } | null;
  } | null;
};

type AvailabilitySlotShape = {
  readonly serviceId?: string | null;
  readonly localStartDate?: string | null;
  readonly localEndDate?: string | null;
  readonly bookable?: boolean | null;
  readonly location?: { readonly locationType?: string | null } | null;
  readonly availableResources?:
    | readonly {
        readonly resources?: readonly { readonly _id?: string }[] | null;
      }[]
    | null;
};

function bookingsClient() {
  return createClient({
    host: site.host(),
    auth: site.auth(),
    modules: { services, availabilityTimeSlots, bookings },
  });
}

function serviceSlug(service: ServiceShape, fallback: string): string {
  const custom = service.supportedSlugs?.find((slug) => slug.custom)?.name;
  return custom ?? service.supportedSlugs?.[0]?.name ?? fallback;
}

function servicePriceCents(service: ServiceShape): number {
  const value = service.payment?.fixed?.price?.value;
  if (!value) {
    return 0;
  }
  const cents = Math.round(Number.parseFloat(value) * 100);
  return Number.isNaN(cents) ? 0 : cents;
}

function toBookingService(service: ServiceShape): BookingService | null {
  const id = service._id ?? '';
  const name = service.name ?? '';
  if (!id || !name) {
    return null;
  }
  return {
    id,
    slug: serviceSlug(service, id),
    name,
    durationMinutes:
      service.schedule?.availabilityConstraints?.durations?.[0]?.minutes ?? 60,
    priceCents: servicePriceCents(service),
    scheduleId: service.schedule?._id ?? undefined,
  };
}

/**
 * Lists live appointment services from Wix Bookings. Requires the Bookings
 * app with configured services, and only runs on the live site or in
 * preview — never in the editor and never in unit tests.
 */
export async function queryBookingOptions(): Promise<
  readonly BookingService[]
> {
  const response = await bookingsClient().services.queryServices({});
  const options: (BookingService | null)[] = (response.services ?? []).map(
    toBookingService,
  );
  return options.filter((option): option is BookingService => option !== null);
}

function toTimeSlot(slot: AvailabilitySlotShape): TimeSlot | null {
  const start = slot.localStartDate;
  if (!slot.bookable || !start) {
    return null;
  }
  return {
    start,
    label: toTimeSlotLabel(start),
    scheduleId: undefined,
    resourceId: slot.availableResources?.[0]?.resources?.[0]?._id ?? undefined,
    locationType: slot.location?.locationType ?? undefined,
  };
}

/**
 * Lists bookable slots for one service and day from Wix Bookings.
 * Live-site and preview only.
 */
export async function queryDaySlots(
  serviceId: string,
  date: string,
): Promise<readonly TimeSlot[]> {
  const response =
    await bookingsClient().availabilityTimeSlots.listAvailabilityTimeSlots({
      serviceId,
      fromLocalDate: `${date}T00:00:00`,
      toLocalDate: `${date}T23:59:59`,
      bookable: true,
    });
  const slots: (TimeSlot | null)[] = (response.timeSlots ?? []).map(toTimeSlot);
  return slots.filter((slot): slot is TimeSlot => slot !== null);
}

function ownerLocationType(
  locationType: string | undefined,
): 'OWNER_BUSINESS' | 'OWNER_CUSTOM' | undefined {
  if (locationType === 'CUSTOM') {
    return 'OWNER_CUSTOM';
  }
  if (locationType === 'BUSINESS' || locationType === undefined) {
    return 'OWNER_BUSINESS';
  }
  return undefined;
}

/**
 * Creates the booking in Wix Bookings and returns its reference.
 * Live-site and preview only. Paid services continue to Wix checkout,
 * which redirects the visitor away from the widget.
 */
export async function submitBookingRequest(
  request: BookingRequest,
): Promise<BookingConfirmation> {
  const scheduleId = request.slot.scheduleId ?? request.service.scheduleId;
  if (!scheduleId) {
    throw new Error('The selected slot cannot be booked yet.');
  }
  const response = await bookingsClient().bookings.createBooking({
    bookedEntity: {
      slot: {
        serviceId: request.service.id,
        scheduleId,
        startDate: request.slot.start,
        ...(request.slot.resourceId
          ? { resource: { _id: request.slot.resourceId } }
          : {}),
        ...(ownerLocationType(request.slot.locationType)
          ? {
              location: {
                locationType: ownerLocationType(request.slot.locationType),
              },
            }
          : {}),
      },
    },
    contactDetails: {
      firstName: request.customer.name,
      email: request.customer.email,
      phone: request.customer.phone,
    },
  });
  return {
    reference: response.booking?._id ?? request.slot.start,
    status: 'requested',
  };
}
