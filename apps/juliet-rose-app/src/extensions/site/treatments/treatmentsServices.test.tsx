import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { FeaturedGrid } from '../widgets/jr-featured-grid/FeaturedGrid';
import { TreatmentCatalog } from '../widgets/jr-treatment-catalog/TreatmentCatalog';
import {
  resolveAutomaticFeatured,
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
    isFeatured: false,
  });
});

test('treatments CMS query maps the featured flag in the same shape', () => {
  expect(
    toTreatmentSummary({ ...CMS_ROWS[0], isFeatured: true }),
  ).toMatchObject({ slug: 'swedish-massage', isFeatured: true });
  expect(
    toTreatmentSummary({ ...CMS_ROWS[0], is_featured: true }),
  ).toMatchObject({ slug: 'swedish-massage', isFeatured: true });
  expect(
    toTreatmentSummary({ ...CMS_ROWS[0], isFeatured: false }),
  ).toMatchObject({ isFeatured: false });
});

test('treatments CMS query preserves featured flags from the fetcher', async () => {
  const summaries = await queryTreatmentSummaries(async () => [
    { ...CMS_ROWS[0], isFeatured: true },
    { ...CMS_ROWS[1] },
  ]);
  expect(summaries.map((summary) => summary.isFeatured)).toEqual([true, false]);
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
  expect(toTreatmentSummary({ _id: 'x', slug: 'x', title: '' })).toBeNull();
});

test('treatments CMS query falls back to the system title field for names', () => {
  expect(
    toTreatmentSummary({
      _id: 'swedish-massage',
      slug: 'swedish-massage',
      title: 'Swedish massage',
      category: 'Massage',
    }),
  ).toMatchObject({ id: 'swedish-massage', name: 'Swedish massage' });
  expect(
    toTreatmentSummary({
      _id: 'swedish-massage',
      slug: 'swedish-massage',
      name: 'Custom name',
      title: 'System title',
    }),
  ).toMatchObject({ name: 'Custom name' });
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

test('treatments CMS query maps the CMS image field to an image URL', () => {
  expect(
    toTreatmentSummary({
      ...CMS_ROWS[0],
      image: 'https://static.wixstatic.com/media/swedish.jpg',
    }),
  ).toMatchObject({
    slug: 'swedish-massage',
    imageUrl: 'https://static.wixstatic.com/media/swedish.jpg',
  });
  expect(
    toTreatmentSummary({
      ...CMS_ROWS[0],
      image: { url: 'https://static.wixstatic.com/media/swedish.jpg' },
    }),
  ).toMatchObject({
    imageUrl: 'https://static.wixstatic.com/media/swedish.jpg',
  });
});

test('treatments CMS query omits the image URL when the CMS image is absent', () => {
  expect(toTreatmentSummary(CMS_ROWS[0])).not.toHaveProperty('imageUrl');
  expect(toTreatmentSummary({ ...CMS_ROWS[0], image: '' })).not.toHaveProperty(
    'imageUrl',
  );
});

test('card treatment keeps the CMS image URL in the same shape', () => {
  const summaries = cmsSummaries();
  const treatment = toCardTreatment({
    ...summaries[0]!,
    imageUrl: 'https://static.wixstatic.com/media/swedish.jpg',
  });
  expect(treatment).toMatchObject({
    slug: 'swedish-massage',
    imageUrl: 'https://static.wixstatic.com/media/swedish.jpg',
  });
});

test('featured grid prefers the CMS image over researched imagery', () => {
  const treatments = cmsSummaries()
    .map((summary) =>
      toCardTreatment({
        ...summary,
        imageUrl: 'https://static.wixstatic.com/media/cms-swedish.jpg',
      }),
    )
    .filter((treatment) => treatment !== null);
  const featured = resolveFeatured(treatments, ['swedish-massage']);
  expect(featured[0]?.image).toBe(
    'https://static.wixstatic.com/media/cms-swedish.jpg',
  );
  const markup = renderToStaticMarkup(<FeaturedGrid featured={featured} />);
  expect(markup).toContain(
    'https://static.wixstatic.com/media/cms-swedish.jpg',
  );
});

test('featured grid falls back to researched imagery without a CMS image', () => {
  const treatments = cmsSummaries()
    .map(toCardTreatment)
    .filter((treatment) => treatment !== null);
  const featured = resolveFeatured(treatments, ['swedish-massage']);
  expect(featured[0]?.image).toBeTruthy();
});
test('card treatment keeps the featured flag in the same shape', () => {
  const summaries = cmsSummaries();
  const treatment = toCardTreatment({ ...summaries[0]!, isFeatured: true });
  expect(treatment).toMatchObject({
    slug: 'swedish-massage',
    isFeatured: true,
  });
});

test('automatic featured selection resolves CMS-flagged treatments', () => {
  const treatments = cmsSummaries()
    .map((summary, index) =>
      toCardTreatment({ ...summary, isFeatured: index === 1 }),
    )
    .filter((treatment) => treatment !== null);
  const featured = resolveAutomaticFeatured(treatments);
  expect(featured.map((item) => item.treatment.slug)).toEqual([
    'microneedling',
  ]);
  const markup = renderToStaticMarkup(<FeaturedGrid featured={featured} />);
  expect(markup).toContain('Microneedling');
  expect(markup).not.toContain('Swedish massage');
});

test('automatic featured selection falls back to defaults without flags', () => {
  const treatments = cmsSummaries()
    .map(toCardTreatment)
    .filter((treatment) => treatment !== null);
  const featured = resolveAutomaticFeatured(treatments, ['swedish-massage']);
  expect(featured.map((item) => item.treatment.slug)).toEqual([
    'swedish-massage',
  ]);
});
