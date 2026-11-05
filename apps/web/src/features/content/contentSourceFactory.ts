import type { ContentSource } from './contentSource';
import { SanityContentSource } from './sanityContentSource';

const defaultSanityProjectId = 'ca34quae';
const defaultSanityDataset = 'production';
const defaultSanityApiVersion = '2025-09-01';

export type ContentEnvironmentKey =
  | 'CONTENT_SOURCE'
  | 'SANITY_PROJECT_ID'
  | 'VITE_SANITY_PROJECT_ID'
  | 'SANITY_DATASET'
  | 'VITE_SANITY_DATASET'
  | 'SANITY_API_VERSION'
  | 'VITE_SANITY_API_VERSION'
  | 'SANITY_API_TOKEN'
  | 'SANITY_API_HOST';

type ContentEnvironment =
  | Partial<Record<ContentEnvironmentKey, string>>
  | Partial<Record<string, string | undefined>>;

function readEnv(
  environment: ContentEnvironment,
  ...names: ContentEnvironmentKey[]
): string {
  const found = names
    .map((name) => environment[name]?.trim())
    .find((value) => value);
  return found ?? '';
}

export function createContentSource(
  environment: ContentEnvironment = process.env,
): ContentSource {
  const configuredSource = environment.CONTENT_SOURCE?.trim() || 'sanity';

  if (configuredSource === 'sanity') {
    const projectId =
      readEnv(environment, 'SANITY_PROJECT_ID', 'VITE_SANITY_PROJECT_ID') ||
      defaultSanityProjectId;
    const dataset =
      readEnv(environment, 'SANITY_DATASET', 'VITE_SANITY_DATASET') ||
      defaultSanityDataset;
    const apiVersion =
      readEnv(environment, 'SANITY_API_VERSION', 'VITE_SANITY_API_VERSION') ||
      defaultSanityApiVersion;
    const token = readEnv(environment, 'SANITY_API_TOKEN') || undefined;
    const apiHost = readEnv(environment, 'SANITY_API_HOST') || undefined;

    return new SanityContentSource({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
      apiHost,
    });
  }

  throw new Error(`Unsupported CONTENT_SOURCE "${configuredSource}".`);
}
