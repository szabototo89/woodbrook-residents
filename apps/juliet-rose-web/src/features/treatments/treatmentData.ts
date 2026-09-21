import treatmentRecords from './treatments.json';

export const TREATMENT_SOURCE_URL =
  'https://www.julietrosebeauty.com/book-online';
export const TREATMENT_SOURCE_ACCESSED_AT = '2026-09-19';

export type TreatmentCategory =
  'Massage' | 'Facials & skin' | 'Beauty essentials' | 'Packages';

export type Treatment = {
  slug: string;
  name: string;
  category: TreatmentCategory;
  durationMinutes: number;
  priceCents: number;
  sourceUrl: string;
  sourceAccessedAt: string;
};

type TreatmentRecord = {
  slug: string;
  name: string;
  category: TreatmentCategory;
  durationMinutes: number;
  priceCents: number;
};

const TREATMENT_CATEGORIES: readonly TreatmentCategory[] = [
  'Massage',
  'Facials & skin',
  'Beauty essentials',
  'Packages',
];

function isTreatmentCategory(value: unknown): value is TreatmentCategory {
  return (
    typeof value === 'string' &&
    TREATMENT_CATEGORIES.some((category) => category === value)
  );
}

function isTreatmentRecord(value: unknown): value is TreatmentRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'slug' in value &&
    typeof value.slug === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'category' in value &&
    isTreatmentCategory(value.category) &&
    'durationMinutes' in value &&
    typeof value.durationMinutes === 'number' &&
    'priceCents' in value &&
    typeof value.priceCents === 'number'
  );
}

const treatments: Treatment[] = treatmentRecords.map((record) => {
  if (!isTreatmentRecord(record)) {
    throw new Error('Invalid treatment record');
  }
  return {
    ...record,
    sourceUrl: TREATMENT_SOURCE_URL,
    sourceAccessedAt: TREATMENT_SOURCE_ACCESSED_AT,
  };
});

export function listTreatments(): Treatment[] {
  return [...treatments];
}

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return treatments.find((treatment) => treatment.slug === slug);
}

export function requireTreatmentBySlug(slug: string): Treatment {
  const treatment = getTreatmentBySlug(slug);
  if (!treatment) throw new Error('Treatment not found');
  return treatment;
}

export function formatTreatmentDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0
    ? `${hours} hr`
    : `${hours} hr ${remainingMinutes} min`;
}
