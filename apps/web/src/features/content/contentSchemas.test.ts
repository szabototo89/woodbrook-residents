import { expect, test } from 'vitest';
import { z } from 'zod';

import {
  contentSnapshotSchema,
  eventSchema,
  projectSchema,
  resourceSchema,
  siteSettingSchema,
  surveySchema,
  updateSchema,
} from './contentSchemas';

function expectEveryFieldToHaveDescription(
  schemaName: string,
  schema: z.ZodObject,
) {
  Object.entries(schema.shape).map(([fieldName, fieldSchema]) => {
    expect(
      fieldSchema.description,
      `${schemaName}.${fieldName} should have a Zod description`,
    ).toBeTruthy();
  });
}

function expectZodObject(candidate: unknown, label: string): z.ZodObject {
  expect(candidate).toBeInstanceOf(z.ZodObject);
  if (!(candidate instanceof z.ZodObject)) {
    throw new Error(`${label} should be a Zod object`);
  }
  return candidate;
}

test('content schemas documents every canonical content field', () => {
  expectEveryFieldToHaveDescription('siteSetting', siteSettingSchema);
  expectEveryFieldToHaveDescription('update', updateSchema);
  expectEveryFieldToHaveDescription('project', projectSchema);
  expectEveryFieldToHaveDescription('event', eventSchema);
  expectEveryFieldToHaveDescription('survey', surveySchema);
  expectEveryFieldToHaveDescription('resource', resourceSchema);
  expectEveryFieldToHaveDescription('contentSnapshot', contentSnapshotSchema);

  const resourceDetails = expectZodObject(
    resourceSchema.shape.details.unwrap().element,
    'resource.details[]',
  );
  expectEveryFieldToHaveDescription('resource.details[]', resourceDetails);

  const collectionDates = expectZodObject(
    resourceSchema.shape.collectionDates.unwrap().element,
    'resource.collectionDates[]',
  );
  expectEveryFieldToHaveDescription(
    'resource.collectionDates[]',
    collectionDates,
  );
});

const validUpdate = {
  documentId: 'update-1',
  slug: 'update-1',
  title: 'Title',
  kind: 'news' as const,
  summary: 'Summary',
  body: 'Body',
  publishedOn: '2026-09-10',
  sourceName: 'Source',
  sourceUrl: 'https://example.com/update',
  sourceReviewedOn: '2026-09-10',
  featured: false,
};

test('content schemas keeps updates with unavailable dates without inventing dates', () => {
  for (const value of ['', 'not-a-date', '  ', null, undefined, 42]) {
    const update = updateSchema.parse({
      ...validUpdate,
      publishedOn: value,
      sourceReviewedOn: value,
    });
    expect(update.documentId).toBe(validUpdate.documentId);
    expect(update.publishedOn).toBe('');
    expect(update.sourceReviewedOn).toBe('');
  }
  expect(
    updateSchema.parse({ ...validUpdate, publishedOn: ' 2026-09-10 ' })
      .publishedOn,
  ).toBe('2026-09-10');
  expect(() => updateSchema.parse(validUpdate)).not.toThrow();
});

test('content schemas treats unavailable optional dates as absent', () => {
  const validSurvey = {
    documentId: 'survey-1',
    slug: 'survey-1',
    title: 'Title',
    stage: 'open' as const,
    summary: 'Summary',
    sourceName: 'Source',
    sourceUrl: 'https://example.com/survey',
    sourceReviewedOn: '2026-09-09',
  };
  for (const closesOn of ['', 'yesterday-ish', null, 42]) {
    expect(
      surveySchema.parse({ ...validSurvey, closesOn }).closesOn,
    ).toBeUndefined();
  }
  expect(() =>
    surveySchema.parse({ ...validSurvey, closesOn: '2026-10-01' }),
  ).not.toThrow();
  expect(() => surveySchema.parse(validSurvey)).not.toThrow();
});

test('content schemas retains events and collection entries without dates', () => {
  const validEvent = {
    documentId: 'event-1',
    slug: 'event-1',
    title: 'Title',
    summary: 'Summary',
    startsAt: '2026-10-01T10:00:00Z',
    location: 'Hall',
    sourceUrl: 'https://example.com/event',
    sourceReviewedOn: '2026-09-09',
    featured: false,
  };
  expect(eventSchema.parse({ ...validEvent, startsAt: '' }).startsAt).toBe('');
  expect(
    eventSchema.parse({ ...validEvent, endsAt: '' }).endsAt,
  ).toBeUndefined();

  const validResource = {
    documentId: 'resource-1',
    slug: 'resource-1',
    title: 'Title',
    category: 'health' as const,
    serviceType: 'GP',
    providerType: 'public-service' as const,
    description: 'Description',
    outOfHours: false,
    featured: false,
    details: [],
    collectionDates: [{ id: 0, date: '2026-10-06', stream: 'recycling' }],
    displayOrder: 1,
    sourceName: 'Source',
    sourceUrl: 'https://example.com/resource',
    sourceReviewedOn: '2026-09-09',
  };
  expect(
    resourceSchema.parse({
      ...validResource,
      collectionDates: [{ id: 0, date: '', stream: 'recycling' }],
    }).collectionDates,
  ).toEqual([{ id: 0, date: '', stream: 'recycling' }]);
  expect(() => resourceSchema.parse(validResource)).not.toThrow();
});

test('content schemas normalizes category spelling and uses Other for unknown categories', () => {
  expect(updateSchema.parse({ ...validUpdate, kind: ' Transport ' }).kind).toBe(
    'transport',
  );
  for (const kind of ['local-news', '', null, undefined, 42]) {
    expect(updateSchema.parse({ ...validUpdate, kind }).kind).toBe('other');
  }
});
