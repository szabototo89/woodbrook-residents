import { items } from '@wix/data';
import { createClient } from '@wix/sdk';
import { site } from '@wix/site';

import wixConfig from '../../../../wix.config.json';
import {
  CONTACT_DETAILS_COLLECTION_ID,
  type ContactDetails,
} from './contactDetails';

function createContactDetailsClient() {
  return createClient({
    host: site.host({ applicationId: wixConfig.appId }),
    auth: site.auth(),
    modules: { items },
  });
}

const contactDetailsClient: {
  current?: ReturnType<typeof createContactDetailsClient>;
} = {};

function getContactDetailsClient() {
  contactDetailsClient.current ??= createContactDetailsClient();
  return contactDetailsClient.current;
}

export function getContactDetailsAccessTokenInjector() {
  return getContactDetailsClient().auth.getAccessTokenInjector();
}

function isContactDetails(value: unknown): value is ContactDetails {
  return typeof value === 'object' && value !== null;
}

async function defaultFetchContactDetails(): Promise<ContactDetails> {
  const response = await getContactDetailsClient()
    .items.query(CONTACT_DETAILS_COLLECTION_ID)
    .limit(1)
    .find();
  const first: unknown = response.items?.[0];
  return isContactDetails(first) ? first : {};
}

/**
 * Reads the single ContactDetails item from the Wix CMS. Returns {} when
 * the collection is empty, missing, or the query fails, so callers fall
 * back to hardcoded defaults instead of crashing. Only runs on the live
 * site or in preview — never in the editor and never in unit tests
 * (inject a fetcher there).
 */
export async function queryContactDetails(
  fetchItem: () => Promise<ContactDetails> = defaultFetchContactDetails,
): Promise<ContactDetails> {
  try {
    const item = await fetchItem();
    return item ?? {};
  } catch {
    return {};
  }
}
