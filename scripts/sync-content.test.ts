import { expect, test } from 'bun:test';

import {
  contentCollections,
  planCollectionSync,
  type SheetRecord,
  type StrapiRecord,
} from './sync-content';

const descriptor = {
  key: 'updates',
  strapiPath: 'updates',
  tab: 'Updates',
  range: 'A:Q',
  sheetToStrapi: (row: SheetRecord) => ({
    slug: row.cells.slug,
    title: row.cells.title,
  }),
  strapiToSheet: (record: StrapiRecord) => ({
    record_id: record.documentId,
    slug: record.slug,
    title: record.data.title,
  }),
};

const sheetRow = (
  slug: string,
  title: string,
  publish = true,
): SheetRecord => ({
  rowNumber: 2,
  values: [slug, title, publish],
  cells: { slug, title, publish },
});

const strapiRecord = (slug: string, title: string): StrapiRecord => ({
  documentId: `document-${slug}`,
  slug,
  data: { slug, title },
});

test('maps Dublin spreadsheet date-times to UTC for Strapi', () => {
  const events = contentCollections.find((item) => item.key === 'events')!;
  const row: SheetRecord = {
    rowNumber: 2,
    values: [],
    cells: {
      slug: 'summer-event',
      start_at: 46242.5,
      timezone: 'Europe/Dublin',
    },
  };

  expect(events.sheetToStrapi(row).startsAt).toBe('2026-08-08T11:00:00.000Z');
});

test('maps a resource to every required local information field', () => {
  const resources = contentCollections.find(
    (item) => item.key === 'resources',
  )!;
  const source = strapiRecord('library', 'Library');
  source.data.details = [
    {
      id: 1,
      label: 'Opening hours',
      value: 'Monday to Friday',
      showOnCard: true,
    },
  ];
  source.data.collectionDates = [
    { id: 1, date: '2026-09-15', stream: 'recycling' },
    { id: 2, date: '2026-09-22', stream: 'waste-compost' },
  ];
  source.data.documentUrl = '/documents/bin-schedule.pdf';
  source.data.documentLabel = '2026 bin collection schedule';
  source.data.featured = true;
  const cells = resources.strapiToSheet(source);
  const data = resources.sheetToStrapi({ rowNumber: 2, values: [], cells });

  expect(cells.emergency_only).toBe(false);
  expect(data.details).toEqual([
    {
      label: 'Opening hours',
      value: 'Monday to Friday',
      showOnCard: true,
    },
  ]);
  expect(cells).toMatchObject({
    featured: true,
    recycling_dates: '2026-09-15',
    waste_compost_dates: '2026-09-22',
    document_url: '/documents/bin-schedule.pdf',
    document_label: '2026 bin collection schedule',
  });
  expect(data).toMatchObject({
    featured: true,
    collectionDates: [
      { date: '2026-09-15', stream: 'recycling' },
      { date: '2026-09-22', stream: 'waste-compost' },
    ],
    documentUrl: '/documents/bin-schedule.pdf',
    documentLabel: '2026 bin collection schedule',
  });
});

test('content sync planning appends Strapi-only records to Sheets', () => {
  const plan = planCollectionSync({
    descriptor,
    direction: 'strapi-to-sheets',
    conflictPolicy: 'report',
    sheetRows: [],
    strapiRecords: [strapiRecord('new-item', 'New item')],
  });

  expect(plan.actions).toHaveLength(1);
});

test('content sync planning creates only published Sheet records in Strapi', () => {
  const published = planCollectionSync({
    descriptor,
    direction: 'sheets-to-strapi',
    conflictPolicy: 'report',
    sheetRows: [sheetRow('new-item', 'New item')],
    strapiRecords: [],
  });
  const draft = planCollectionSync({
    descriptor,
    direction: 'sheets-to-strapi',
    conflictPolicy: 'report',
    sheetRows: [sheetRow('draft-item', 'Draft item', false)],
    strapiRecords: [],
  });

  expect(published.actions[0]?.type).toBe('create-strapi');
  expect(draft.actions).toHaveLength(0);
});

test('content sync planning reports differences by default', () => {
  const plan = planCollectionSync({
    descriptor,
    direction: 'two-way',
    conflictPolicy: 'report',
    sheetRows: [sheetRow('same-item', 'Sheet title')],
    strapiRecords: [strapiRecord('same-item', 'Strapi title')],
  });

  expect(plan.actions).toHaveLength(0);
  expect(plan.conflicts).toEqual([
    {
      collection: 'updates',
      slug: 'same-item',
      sheetRow: 2,
      differingFields: ['title'],
    },
  ]);
});

test('content sync planning honours the selected winner for two-way conflicts', () => {
  const strapiWins = planCollectionSync({
    descriptor,
    direction: 'two-way',
    conflictPolicy: 'strapi-wins',
    sheetRows: [sheetRow('same-item', 'Sheet title')],
    strapiRecords: [strapiRecord('same-item', 'Strapi title')],
  });
  const sheetsWins = planCollectionSync({
    descriptor,
    direction: 'two-way',
    conflictPolicy: 'sheets-wins',
    sheetRows: [sheetRow('same-item', 'Sheet title')],
    strapiRecords: [strapiRecord('same-item', 'Strapi title')],
  });

  expect(strapiWins.actions[0]?.type).toBe('update-sheet');
  expect(sheetsWins.actions[0]?.type).toBe('update-strapi');
});

test('content sync planning does not act on ambiguous duplicate slugs', () => {
  const plan = planCollectionSync({
    descriptor,
    direction: 'two-way',
    conflictPolicy: 'strapi-wins',
    sheetRows: [sheetRow('duplicate', 'One'), sheetRow('duplicate', 'Two')],
    strapiRecords: [strapiRecord('duplicate', 'Strapi')],
  });

  expect(plan.actions).toHaveLength(0);
  expect(plan.duplicates).toEqual(['Updates sheet: duplicate']);
});
