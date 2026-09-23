import { items } from '@wix/data';
import { createClient } from '@wix/sdk';
import { site } from '@wix/site';

import type { BookingsServiceSummary } from './treatments';

export const TREATMENTS_COLLECTION_ID = 'Treatments';

const TREATMENTS_LIMIT = 50;

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
}>;

export function toTreatmentSummary(
  item: TreatmentsItemShape,
): BookingsServiceSummary | null {
  const id = item._id ?? item.slug ?? '';
  const name = item.name ?? item.title ?? '';
  if (!id || !name) {
    return null;
  }
  return {
    id,
    name,
    slug: item.slug ?? id,
    categoryName: item.category ?? undefined,
    durationMinutes: item.durationMinutes ?? undefined,
    priceCents: item.priceCents ?? undefined,
    isFeatured: item.isFeatured ?? item.is_featured ?? false,
  };
}

function treatmentsClient() {
  return createClient({
    host: site.host(),
    auth: site.auth(),
    modules: { items },
  });
}

async function defaultFetchTreatments(): Promise<
  readonly TreatmentsItemShape[]
> {
  const response = await treatmentsClient()
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
