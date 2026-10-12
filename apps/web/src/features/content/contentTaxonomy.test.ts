import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

import {
  projectCategories,
  projectStages,
  providerTypes,
  resourceCategories,
  updateKinds,
} from './contentTaxonomy';

function readStudioValues(file: string, exportName: string): string[] {
  const url = new URL(
    `../../../../sanity-studio/schemaTypes/${file}`,
    import.meta.url,
  );
  const source = readFileSync(url, 'utf8');
  const block = new RegExp(
    `export const ${exportName} = \\[(.*?)\\] as const`,
    's',
  ).exec(source)?.[1];
  if (!block) {
    throw new Error(
      `Could not find ${exportName} in sanity-studio schema ${file}.`,
    );
  }
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1] ?? '');
}

test('content taxonomy keeps Sanity Studio enumerations aligned with the domain', () => {
  expect(readStudioValues('update.ts', 'updateKinds')).toEqual([
    ...updateKinds,
  ]);
  expect(readStudioValues('project.ts', 'projectCategories')).toEqual([
    ...projectCategories,
  ]);
  expect(readStudioValues('project.ts', 'projectStages')).toEqual([
    ...projectStages,
  ]);
  expect(readStudioValues('resource.ts', 'resourceCategories')).toEqual([
    ...resourceCategories,
  ]);
  expect(readStudioValues('resource.ts', 'providerTypes')).toEqual([
    ...providerTypes,
  ]);
});
