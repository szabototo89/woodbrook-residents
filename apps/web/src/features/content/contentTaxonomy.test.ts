import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  projectCategories,
  projectStages,
  providerTypes,
  resourceCategories,
  updateKinds,
} from './contentTaxonomy';

function readCmsSchema(type: string) {
  const url = new URL(
    `../../../../cms/src/api/${type}/content-types/${type}/schema.json`,
    import.meta.url,
  );
  return JSON.parse(readFileSync(url, 'utf8')) as {
    attributes: Record<string, { enum?: string[] }>;
  };
}

describe('content taxonomy', () => {
  it('keeps interchangeable Strapi enumerations aligned with the domain', () => {
    const update = readCmsSchema('update');
    const project = readCmsSchema('project');
    const resource = readCmsSchema('resource');

    expect(update.attributes.kind?.enum).toEqual([...updateKinds]);
    expect(project.attributes.category?.enum).toEqual([...projectCategories]);
    expect(project.attributes.stage?.enum).toEqual([...projectStages]);
    expect(resource.attributes.category?.enum).toEqual([...resourceCategories]);
    expect(resource.attributes.providerType?.enum).toEqual([...providerTypes]);
  });
});
