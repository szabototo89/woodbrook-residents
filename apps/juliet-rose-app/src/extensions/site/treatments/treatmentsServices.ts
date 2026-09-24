import { items } from '@wix/data';
import { createClient, media } from '@wix/sdk';
import { site } from '@wix/site';

import wixConfig from '../../../../wix.config.json';
import type { BookingsServiceSummary } from './treatments';

export const TREATMENTS_COLLECTION_ID = 'Treatments';

const TREATMENTS_LIMIT = 50;

const FEATURED_IMAGE_WIDTH = 1536;
const FEATURED_IMAGE_HEIGHT = 1024;

export type TreatmentsItemShape = Readonly<{
  readonly _id?: string | null;
  readonly slug?: string | null;
  readonly name?: string | null;
  readonly title?: string | null;
  readonly category?: string | null;
  readonly durationMinutes?: number | null;
  readonly priceCents?: number | null;
  readonly isFeatured?: boolean | null;
  readonly is_featured?: boolean | null;
  readonly image?:
    | string
    | { readonly url?: string | null; readonly image?: string | null }
    | null;
}>;

function extractRawImage(
  value: TreatmentsItemShape['image'],
): string | undefined {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }
  if (value && typeof value === 'object') {
    if (typeof value.url === 'string' && value.url.trim()) {
      return value.url.trim();
    }
    if (typeof value.image === 'string' && value.image.trim()) {
      return value.image.trim();
    }
  }
  return undefined;
}

export function toCmsImageUrl(
  value: TreatmentsItemShape['image'],
): string | undefined {
  const raw = extractRawImage(value);
  if (!raw) {
    return undefined;
  }
  if (raw.startsWith('wix:image://')) {
    try {
      return (
        media.getScaledToFillImageUrl(
          raw,
          FEATURED_IMAGE_WIDTH,
          FEATURED_IMAGE_HEIGHT,
          {},
        ) || undefined
      );
    } catch {
      return undefined;
    }
  }
  return raw;
}

export function toTreatmentSummary(
  item: TreatmentsItemShape,
): BookingsServiceSummary | null {
  const id = item._id ?? item.slug ?? '';
  const name = item.name ?? item.title ?? '';
  if (!id || !name) {
    return null;
  }
  const imageUrl = toCmsImageUrl(item.image);
  return {
    id,
    name,
    slug: item.slug ?? id,
    categoryName: item.category ?? undefined,
    durationMinutes: item.durationMinutes ?? undefined,
    priceCents: item.priceCents ?? undefined,
    isFeatured: item.isFeatured ?? item.is_featured ?? false,
    ...(imageUrl ? { imageUrl } : {}),
  };
}

function createTreatmentsClient() {
  return createClient({
    host: site.host({ applicationId: wixConfig.appId }),
    auth: site.auth(),
    modules: { items },
  });
}

const treatmentsClient: {
  current?: ReturnType<typeof createTreatmentsClient>;
} = {};

function getTreatmentsClient() {
  treatmentsClient.current ??= createTreatmentsClient();
  return treatmentsClient.current;
}

export function getTreatmentsAccessTokenInjector() {
  return getTreatmentsClient().auth.getAccessTokenInjector();
}

async function defaultFetchTreatments(): Promise<
  readonly TreatmentsItemShape[]
> {
  const response = await getTreatmentsClient()
    .items.query(TREATMENTS_COLLECTION_ID)
    .limit(TREATMENTS_LIMIT)
    .find();
  const rows: readonly TreatmentsItemShape[] = response.items ?? [];
  return rows;
}

/**
 * Lists live treatments from the Wix CMS Treatments collection. Returns []
 * when the query is empty or fails, so live widgets fall back to an empty
 * catalog instead of crashing. Only runs on the live site or in preview —
 * never in the editor and never in unit tests (inject a fetcher there).
 */
export async function queryTreatmentSummaries(
  fetchItems: () => Promise<
    readonly TreatmentsItemShape[]
  > = defaultFetchTreatments,
): Promise<readonly BookingsServiceSummary[]> {
  try {
    const rows = await fetchItems();
    return rows
      .map(toTreatmentSummary)
      .filter((summary): summary is BookingsServiceSummary => summary !== null);
  } catch {
    return [];
  }
}
