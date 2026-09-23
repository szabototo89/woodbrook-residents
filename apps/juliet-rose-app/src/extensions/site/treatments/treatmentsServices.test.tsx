import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { FeaturedGrid } from '../widgets/jr-featured-grid/FeaturedGrid';
import { TreatmentCatalog } from '../widgets/jr-treatment-catalog/TreatmentCatalog';
import {
  resolveFeatured,
  toCardTreatment,
  type BookingsServiceSummary,
} from './treatments';
import {
  queryTreatmentSummaries,
  toTreatmentSummary,
  TREATMENTS_COLLECTION_ID,
} from './treatmentsServices';

const CMS_ROWS = [
  {
    _id: 'swedish-massage',
    slug: 'swedish-massage',
    name: 'Swedish massage',
    category: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
  },
  {
    _id: 'microneedling',
    slug: 'microneedling',
    name: 'Microneedling',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 13000,
  },
] as const;

function cmsSummaries(): readonly BookingsServiceSummary[] {
  return CMS_ROWS.map((row) => toTreatmentSummary(row)).filter(
    (summary): summary is BookingsServiceSummary => summary !== null,
  );
}

test('treatments CMS query uses the Treatments collection', () => {
  expect(TREATMENTS_COLLECTION_ID).toBe('Treatments');
});

test('treatments CMS query maps CMS fields without inventing values', () => {
  expect(toTreatmentSummary(CMS_ROWS[0])).toEqual({
    id: 'swedish-massage',
    slug: 'swedish-massage',
    name: 'Swedish massage',
    categoryName: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
  });
});

test('treatments CMS query preserves CMS category values exactly', () => {
  const summaries = cmsSummaries();
  expect(summaries.map((summary) => summary.categoryName)).toEqual([
    'Massage',
    'Facials & skin',
  ]);
});

test('treatments CMS query drops rows missing id or name', () => {
  expect(toTreatmentSummary({ _id: '', name: '', slug: 'x' })).toBeNull();
  expect(toTreatmentSummary({ _id: 'x', slug: 'x' })).toBeNull();
});

test('treatments CMS query returns mapped summaries from the fetcher', async () => {
  const summaries = await queryTreatmentSummaries(async () => [...CMS_ROWS]);
  expect(summaries).toHaveLength(2);
  expect(summaries[0]?.slug).toBe('swedish-massage');
});

test('treatments CMS query falls back to [] when the CMS query is empty', async () => {
  await expect(queryTreatmentSummaries(async () => [])).resolves.toEqual([]);
});

test('treatments CMS query falls back to [] when the CMS query fails', async () => {
  await expect(
    queryTreatmentSummaries(async () => {
      throw new Error('cms unavailable');
    }),
  ).resolves.toEqual([]);
});

test('live treatment catalog lists mocked CMS treatments', () => {
  const treatments = cmsSummaries()
    .map(toCardTreatment)
    .filter((treatment) => treatment !== null);
  const markup = renderToStaticMarkup(
    <TreatmentCatalog treatments={treatments} />,
  );
  expect(markup).toContain('Swedish massage');
  expect(markup).toContain('Microneedling');
});

test('live featured grid resolves mocked CMS treatments by slug', () => {
  const treatments = cmsSummaries()
    .map(toCardTreatment)
    .filter((treatment) => treatment !== null);
  const featured = resolveFeatured(treatments, ['microneedling']);
  const markup = renderToStaticMarkup(<FeaturedGrid featured={featured} />);
  expect(markup).toContain('Microneedling');
});
