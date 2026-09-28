import {expect, test} from 'vitest'

import {schemaTypes} from './index'

test('studio schema registers the nine Woodbrook document and object types', () => {
  const names = schemaTypes.map((type) => type.name).sort()
  expect(names).toEqual(
    [
      'collectionDate',
      'event',
      'issueReport',
      'project',
      'resource',
      'resourceDetail',
      'siteSetting',
      'survey',
      'update',
    ].sort(),
  )
})

test('studio schema types eachdeclare a title', () => {
  for (const type of schemaTypes) {
    expect(typeof type.title).toBe('string')
  }
})
