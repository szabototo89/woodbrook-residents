import { defineQuery } from 'groq';
import { parseFormaContent } from './schema';

export const FORMA_PROJECT_ID = 'ms27me7o';
export const FORMA_DATASET = 'production';
const published =
  '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const image =
  'alt, asset->{_id, url, "width": metadata.dimensions.width, "height": metadata.dimensions.height}';
// Preserve null references: dropping them would silently publish partial content.
export const FORMA_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings" && ${published}][0]{..., logo{${image}}},
  "home": *[_id == "homePage" && ${published}][0]{..., hero{..., image{${image}}}, selectedWork[]->{..., image{${image}}}},
  "journal": *[_id == "journalPage" && ${published}][0]{..., guides[]->{..., image{${image}}}}
}`);

type FormaConfig = { projectId?: string; dataset?: string; token?: string };

export async function fetchFormaContent(
  config: FormaConfig = {},
  request: (input: string, init?: RequestInit) => Promise<Response> = fetch,
) {
  const projectId = config.projectId ?? FORMA_PROJECT_ID;
  const dataset = config.dataset ?? FORMA_DATASET;
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) {
    throw new Error(
      'Forma content configuration failed: check projectId and dataset.',
    );
  }
  const url = new URL(
    `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}`,
  );
  url.searchParams.set('query', FORMA_QUERY);
  url.searchParams.set('perspective', 'published');
  const payload = await (async (): Promise<unknown> => {
    try {
      const response = await request(url.toString(), {
        headers: config.token
          ? { Authorization: `Bearer ${config.token}` }
          : {},
        cache: 'no-store',
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error('Request failed');
      return await response.json();
    } catch {
      // Never echo response bodies, URLs, request errors, or authentication headers.
      throw new Error(
        'Forma content request failed. Check Sanity availability, project/dataset and FORMA_SANITY_READ_TOKEN permissions.',
      );
    }
  })();
  const result =
    typeof payload === 'object' && payload !== null && 'result' in payload
      ? payload.result
      : undefined;
  return parseFormaContent(result);
}
