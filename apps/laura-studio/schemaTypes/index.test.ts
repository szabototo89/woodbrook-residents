import {expect, test} from 'vitest'

import {schemaTypes} from './index'

test('studio schema registers the Laura document and object types', () => {
  const names = schemaTypes.map((type) => type.name).sort()
  expect(names).toEqual(
    [
      'aboutPage',
      'galleryItem',
      'galleryPage',
      'homePage',
      'pageHero',
      'seo',
      'service',
      'servicesPage',
      'siteSettings',
    ].sort(),
  )
})

test('studio schema types each declare a title', () => {
  for (const type of schemaTypes) {
    expect(typeof type.title).toBe('string')
  }
})

test('studio schema documents each declare an icon', () => {
  for (const type of schemaTypes) {
    if (type.type === 'document') {
      expect(type.icon).toBeDefined()
    }
  }
})
