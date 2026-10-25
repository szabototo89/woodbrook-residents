import { fetchFormaContent } from '../src/features/content/fetchContent';
export function loadBuildContent(
  env: Record<string, string | undefined> = process.env,
  request: (input: string, init?: RequestInit) => Promise<Response> = fetch,
) {
  return fetchFormaContent(
    {
      projectId: env.FORMA_SANITY_PROJECT_ID,
      dataset: env.FORMA_SANITY_DATASET,
      token: env.FORMA_SANITY_READ_TOKEN,
    },
    request,
  );
}
