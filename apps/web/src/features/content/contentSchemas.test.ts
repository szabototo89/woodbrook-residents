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

test('content schemas rejects empty or unparseable required dates', () => {
  expect(() =>
    updateSchema.parse({ ...validUpdate, publishedOn: '' }),
  ).toThrow();
  expect(() =>
    updateSchema.parse({ ...validUpdate, publishedOn: 'not-a-date' }),
  ).toThrow();
  expect(() =>
    updateSchema.parse({ ...validUpdate, sourceReviewedOn: '' }),
  ).toThrow();
  expect(() => updateSchema.parse(validUpdate)).not.toThrow();
});

test('content schemas rejects empty or unparseable optional dates when present', () => {
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
  expect(() => surveySchema.parse({ ...validSurvey, closesOn: '' })).toThrow();
  expect(() =>
    surveySchema.parse({ ...validSurvey, closesOn: 'yesterday-ish' }),
  ).toThrow();
  expect(() =>
    surveySchema.parse({ ...validSurvey, closesOn: '2026-10-01' }),
  ).not.toThrow();
  expect(() => surveySchema.parse(validSurvey)).not.toThrow();
});

test('content schemas rejects empty event dates and collection dates', () => {
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
  expect(() => eventSchema.parse({ ...validEvent, startsAt: '' })).toThrow();
  expect(() => eventSchema.parse({ ...validEvent, endsAt: '' })).toThrow();

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
  expect(() =>
    resourceSchema.parse({
      ...validResource,
      collectionDates: [{ id: 0, date: '', stream: 'recycling' }],
    }),
  ).toThrow();
  expect(() => resourceSchema.parse(validResource)).not.toThrow();
});
