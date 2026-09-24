import { items } from '@wix/data';
import { createClient } from '@wix/sdk';
import { site } from '@wix/site';

import wixConfig from '../../../../wix.config.json';
import { HOME_CONTENT_COLLECTION_ID, type HomeContent } from './homeContent';

function createHomeContentClient() {
  return createClient({
    host: site.host({ applicationId: wixConfig.appId }),
    auth: site.auth(),
    modules: { items },
  });
}

const homeContentClient: {
  current?: ReturnType<typeof createHomeContentClient>;
} = {};

function getHomeContentClient() {
  homeContentClient.current ??= createHomeContentClient();
  return homeContentClient.current;
}

export function getHomeContentAccessTokenInjector() {
  return getHomeContentClient().auth.getAccessTokenInjector();
}

type AccessTokenListener = ReturnType<typeof getHomeContentAccessTokenInjector>;

export function combineAccessTokenInjectors(
  ...injectors: ReadonlyArray<AccessTokenListener>
): AccessTokenListener {
  return (getAccessTokenFn) => {
    injectors.reduce<undefined>((_, injector) => {
      injector(getAccessTokenFn);
      return undefined;
    }, undefined);
  };
}

function isHomeContent(value: unknown): value is HomeContent {
  return typeof value === 'object' && value !== null;
}

async function defaultFetchHomeContent(): Promise<HomeContent> {
  const response = await getHomeContentClient()
    .items.query(HOME_CONTENT_COLLECTION_ID)
    .limit(1)
    .find();
  const first: unknown = response.items?.[0];
  return isHomeContent(first) ? first : {};
}

/**
 * Reads the single HomePageContent item from the Wix CMS. Returns {} when
 * the collection is empty, missing, or the query fails, so callers fall
 * back to hardcoded defaults instead of crashing. Only runs on the live
 * site or in preview — never in the editor and never in unit tests
 * (inject a fetcher there).
 */
export async function queryHomeContent(
  fetchItem: () => Promise<HomeContent> = defaultFetchHomeContent,
): Promise<HomeContent> {
  try {
    const item = await fetchItem();
    return item ?? {};
  } catch {
    return {};
  }
}
