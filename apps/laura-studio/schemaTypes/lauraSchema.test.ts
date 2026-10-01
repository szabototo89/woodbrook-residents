import {expect, test} from 'vitest'

import {galleryItem} from './galleryItem'
import {service} from './service'
import {schemaTypes} from './index'
import {invokeAllValidations, preparePreview} from './test-helpers'

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

test('gallery item carries artwork, alt text and order', () => {
  const names = fieldNames('galleryItem')
  expect(names).toEqual(expect.arrayContaining(['image', 'imageAlt', 'order']))
  expect(names).not.toContain('caption')
  expect(names).not.toContain('featured')
  expect(names).not.toContain('slug')
})

test('editors can explicitly mark each picture for sale or not for sale without a default claim', () => {
  const status = fieldsOf('galleryItem').find((field) => field['name'] === 'saleStatus')
  expect(status).toMatchObject({
    title: 'Sale availability',
    type: 'string',
    options: {
      list: [
        {title: 'For sale', value: 'for-sale'},
        {title: 'Not for sale', value: 'not-for-sale'},
      ],
      layout: 'radio',
    },
  })
  expect(status?.['description']).toContain('Enquire for availability')
  expect(status?.['initialValue']).toBeUndefined()
})

test('gallery collection carries a slug, description, order and photo references', () => {
  const names = fieldNames('galleryCollection')
  expect(names).toEqual(expect.arrayContaining(['title', 'slug', 'description', 'order', 'photos']))
  const slug = fieldsOf('galleryCollection').find((field) => field['name'] === 'slug')
  expect(slug?.['type']).toBe('slug')
  const photos = fieldsOf('galleryCollection').find((field) => field['name'] === 'photos')
  expect(photos?.['type']).toBe('array')
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

test('list previews fall back to friendly placeholder text', () => {
  expect(preparePreview(service.preview?.prepare, {})).toEqual({
    title: 'Untitled service',
    subtitle: 'No description yet',
  })
  expect(preparePreview(galleryItem.preview?.prepare, {})).toEqual({
    title: 'Untitled artwork',
    subtitle: 'Gallery picture',
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
