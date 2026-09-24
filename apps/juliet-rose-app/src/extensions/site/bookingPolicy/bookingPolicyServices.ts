import { items } from '@wix/data';
import { createClient } from '@wix/sdk';
import { site } from '@wix/site';

import wixConfig from '../../../../wix.config.json';
import {
  BOOKING_POLICY_COLLECTION_ID,
  type BookingPolicyContent,
} from './bookingPolicy';

function createBookingPolicyClient() {
  return createClient({
    host: site.host({ applicationId: wixConfig.appId }),
    auth: site.auth(),
    modules: { items },
  });
}

const bookingPolicyClient: {
  current?: ReturnType<typeof createBookingPolicyClient>;
} = {};

function getBookingPolicyClient() {
  bookingPolicyClient.current ??= createBookingPolicyClient();
  return bookingPolicyClient.current;
}

export function getBookingPolicyAccessTokenInjector() {
  return getBookingPolicyClient().auth.getAccessTokenInjector();
}

function isBookingPolicyContent(value: unknown): value is BookingPolicyContent {
  return typeof value === 'object' && value !== null;
}

async function defaultFetchBookingPolicy(): Promise<BookingPolicyContent> {
  const response = await getBookingPolicyClient()
    .items.query(BOOKING_POLICY_COLLECTION_ID)
    .limit(1)
    .find();
  const first: unknown = response.items?.[0];
  return isBookingPolicyContent(first) ? first : {};
}

/**
 * Reads the single BookingPolicy item from the Wix CMS. Returns {} when
 * the collection is empty, missing, or the query fails, so callers fall
 * back to hardcoded defaults instead of crashing. Only runs on the live
 * site or in preview — never in the editor and never in unit tests
 * (inject a fetcher there).
 */
export async function queryBookingPolicy(
  fetchItem: () => Promise<BookingPolicyContent> = defaultFetchBookingPolicy,
): Promise<BookingPolicyContent> {
  try {
    const item = await fetchItem();
    return item ?? {};
  } catch {
    return {};
  }
}
