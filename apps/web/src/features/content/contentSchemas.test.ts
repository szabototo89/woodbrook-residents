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
