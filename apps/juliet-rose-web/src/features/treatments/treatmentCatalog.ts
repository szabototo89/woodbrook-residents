import { z } from 'zod';

import treatmentRecords from './treatments.json';

export const TREATMENT_SOURCE_URL =
  'https://www.julietrosebeauty.com/book-online';
export const TREATMENT_SOURCE_ACCESSED_AT = '2026-09-19';

const treatmentCategorySchema = z.enum([
  'Massage',
  'Facials & skin',
  'Beauty essentials',
  'Packages',
]);

const treatmentRecordSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: treatmentCategorySchema,
  durationMinutes: z.number().int().positive(),
  priceCents: z.number().int().positive(),
});

export type TreatmentCategory = z.infer<typeof treatmentCategorySchema>;
export type Treatment = z.infer<typeof treatmentRecordSchema> & {
  sourceUrl: string;
  sourceAccessedAt: string;
};

export function toTreatmentCategory(value: unknown): TreatmentCategory {
  return treatmentCategorySchema.parse(value);
}

export function toTreatment(value: unknown): Treatment {
  const record = treatmentRecordSchema.parse(value);
  return {
    ...record,
    sourceUrl: TREATMENT_SOURCE_URL,
    sourceAccessedAt: TREATMENT_SOURCE_ACCESSED_AT,
  };
}

const treatments = treatmentRecords.map(toTreatment);

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
