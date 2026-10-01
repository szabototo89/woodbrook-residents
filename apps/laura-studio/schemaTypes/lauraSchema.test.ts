import {expect, test} from 'vitest'

import {galleryItem} from './galleryItem'
import {service} from './service'
import {schemaTypes} from './index'
import {createMockRule, invokeAllValidations, preparePreview} from './test-helpers'

function fieldsOf(typeName: string): Array<Record<string, unknown>> {
  const type = schemaTypes.find((candidate) => candidate.name === typeName)
  if (!type || !('fields' in type) || !Array.isArray(type.fields)) {
    throw new Error(`Expected fields on schema type "${typeName}"`)
  }
  return type.fields as Array<Record<string, unknown>>
}

function fieldNames(typeName: string): Array<string> {
  return fieldsOf(typeName).map((field) => String(field['name']))
}

test('page singletons share the hero and SEO shapes', () => {
  for (const typeName of ['homePage', 'aboutPage', 'servicesPage', 'galleryPage']) {
    const names = fieldNames(typeName)
    expect(names).toContain('hero')
    expect(names).toContain('seo')
  }
  expect(fieldNames('pageHero')).toEqual(
    expect.arrayContaining(['eyebrow', 'title', 'description', 'image', 'imageAlt']),
  )
  expect(fieldNames('seo')).toEqual(expect.arrayContaining(['title', 'description']))
})

test('every image field has a required alt-text sibling', () => {
  const imageTypes = schemaTypes.filter(
    (type) => type.type === 'document' || type.type === 'object',
  )
  for (const type of imageTypes) {
    if (!('fields' in type) || !Array.isArray(type.fields)) {
      continue
    }
    const fields = type.fields as Array<Record<string, unknown>>
    for (const field of fields) {
      if (field['type'] !== 'image') {
        continue
      }
      const alt = fields.find((candidate) => candidate['name'] === `${String(field['name'])}Alt`)
      expect(alt).toBeDefined()
      expect(alt?.['type']).toBe('string')
      expect(typeof alt?.['validation']).toBe('function')
    }
  }
})

test('service carries a slug, description, image and order', () => {
  const names = fieldNames('service')
  expect(names).toEqual(
    expect.arrayContaining(['title', 'slug', 'description', 'image', 'imageAlt', 'order']),
  )
  const slug = fieldsOf('service').find((field) => field['name'] === 'slug')
  expect(slug?.['type']).toBe('slug')
})

test('gallery item carries a title, slug, description and featured flag', () => {
  const names = fieldNames('galleryItem')
  expect(names).toEqual(
    expect.arrayContaining([
      'title',
      'slug',
      'description',
      'image',
      'imageAlt',
      'featured',
      'order',
    ]),
  )
  expect(names).not.toContain('caption')
  const featured = fieldsOf('galleryItem').find((field) => field['name'] === 'featured')
  expect(featured?.['type']).toBe('boolean')
  const slug = fieldsOf('galleryItem').find((field) => field['name'] === 'slug')
  expect(slug?.['type']).toBe('slug')
})

test('site settings hold the shared contact details', () => {
  expect(fieldNames('siteSettings')).toEqual(
    expect.arrayContaining([
      'contactEmail',
      'contactPhone',
      'contactMailtoSubject',
      'contactEyebrow',
      'contactHeading',
      'contactCopy',
    ]),
  )
})

test('all schema validations run without throwing', () => {
  for (const type of schemaTypes) {
    if ('fields' in type) {
      invokeAllValidations(type.fields)
    }
  }
})

function featuredValidator(): Function {
  const featured = galleryItem.fields?.find((field) => field.name === 'featured') as unknown as {
    validation: (rule: object) => unknown
  }
  const captured: Array<Function> = []
  const {rule} = createMockRule(captured)
  featured.validation(rule)
  if (captured.length === 0) {
    throw new Error('Expected a custom featured validator')
  }
  const validator = captured[0]
  if (typeof validator !== 'function') {
    throw new Error('Expected the featured validator to be a function')
  }
  return validator
}

function featuredContext(count: number, id: string | undefined) {
  return {
    getClient: () => ({
      fetch: async () => count,
    }),
    document: id === undefined ? undefined : {_id: id},
  }
}

test('unfeaturing artwork always passes the home preview cap', async () => {
  expect(await featuredValidator()(false, featuredContext(6, 'abc'))).toBe(true)
})

test('featuring artwork passes while the home preview has room', async () => {
  const validator = featuredValidator()
  expect(await validator(true, featuredContext(5, 'drafts.abc'))).toBe(true)
  expect(await validator(true, featuredContext(0, undefined))).toBe(true)
})

test('featuring artwork fails once six others are featured', async () => {
  expect(await featuredValidator()(true, featuredContext(6, 'abc'))).toBe(
    'Only six artworks fit the home page preview — unfeature another one first.',
  )
})

test('list previews fall back to friendly placeholder text', () => {
  expect(preparePreview(service.preview?.prepare, {})).toEqual({
    title: 'Untitled service',
    subtitle: 'No description yet',
  })
  expect(preparePreview(galleryItem.preview?.prepare, {title: 'Pink flowers'})).toEqual({
    title: 'Pink flowers',
    subtitle: 'No alt text yet',
  })
})

test('every document preview renders a title and subtitle', () => {
  for (const type of schemaTypes) {
    if (type.type !== 'document') {
      continue
    }
    const preview = (type as {preview?: {prepare?: unknown}}).preview
    const rendered = preparePreview(preview?.prepare, {})
    expect(rendered.title.length).toBeGreaterThan(0)
  }
})
