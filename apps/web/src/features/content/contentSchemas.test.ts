import { describe, expect, it } from 'vitest';
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
  for (const [fieldName, fieldSchema] of Object.entries(schema.shape)) {
    expect(
      fieldSchema.description,
      `${schemaName}.${fieldName} should have a Zod description`,
    ).toBeTruthy();
  }
}

describe('content schemas', () => {
  it('documents every canonical content field', () => {
    expectEveryFieldToHaveDescription('siteSetting', siteSettingSchema);
    expectEveryFieldToHaveDescription('update', updateSchema);
    expectEveryFieldToHaveDescription('project', projectSchema);
    expectEveryFieldToHaveDescription('event', eventSchema);
    expectEveryFieldToHaveDescription('survey', surveySchema);
    expectEveryFieldToHaveDescription('resource', resourceSchema);
    expectEveryFieldToHaveDescription('contentSnapshot', contentSnapshotSchema);

    const resourceDetails = resourceSchema.shape.details.unwrap().element;
    expect(resourceDetails).toBeInstanceOf(z.ZodObject);
    expectEveryFieldToHaveDescription(
      'resource.details[]',
      resourceDetails as z.ZodObject,
    );

    const collectionDates =
      resourceSchema.shape.collectionDates.unwrap().element;
    expect(collectionDates).toBeInstanceOf(z.ZodObject);
    expectEveryFieldToHaveDescription(
      'resource.collectionDates[]',
      collectionDates as z.ZodObject,
    );
  });
});
