import { services } from '@wix/bookings';
import { createClient } from '@wix/sdk';
import { site } from '@wix/site';

import type { BookingsServiceSummary } from './treatments';

type BookingsServiceShape = {
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

function serviceSlug(service: BookingsServiceShape, fallback: string): string {
  const custom = service.supportedSlugs?.find((slug) => slug.custom)?.name;
  return custom ?? service.supportedSlugs?.[0]?.name ?? fallback;
}

function servicePriceCents(service: BookingsServiceShape): number | undefined {
  const value = service.payment?.fixed?.price?.value;
  if (!value) {
    return undefined;
  }
  const cents = Math.round(Number.parseFloat(value) * 100);
  return Number.isNaN(cents) ? undefined : cents;
}

function toSummary(
  service: BookingsServiceShape,
): BookingsServiceSummary | null {
  const id = service._id ?? '';
  const name = service.name ?? '';
  if (!id || !name) {
    return null;
  }
  return {
    id,
    name,
    slug: serviceSlug(service, id),
    categoryName: service.category?.name ?? undefined,
    durationMinutes:
      service.schedule?.availabilityConstraints?.durations?.[0]?.minutes ??
      undefined,
    priceCents: servicePriceCents(service),
    isFeatured: false,
  };
}

/**
 * Lists live appointment services from Wix Bookings. Requires the Bookings
 * app with configured services, and only runs on the live site or in
 * preview — never in the editor and never in unit tests.
 */
export async function queryBookingServices(): Promise<
  readonly BookingsServiceSummary[]
> {
  const client = createClient({
    host: site.host(),
    auth: site.auth(),
    modules: { services },
  });
  const response = await client.services.queryServices({});
  const summaries: (BookingsServiceSummary | null)[] = (
    response.services ?? []
  ).map(toSummary);
  return summaries.filter(
    (summary): summary is BookingsServiceSummary => summary !== null,
  );
}
