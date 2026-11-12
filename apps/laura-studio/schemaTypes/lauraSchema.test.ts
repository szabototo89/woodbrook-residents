import {expect, test, vi} from 'vitest'

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

test('home has an optional announcement with an explicit visibility switch and optional action', () => {
  const field = fieldsOf('homePage').find((field) => field['name'] === 'announcement')
  expect(field).toMatchObject({title: 'Homepage announcement', type: 'object'})
  const fields = field?.['fields'] as Array<Record<string, unknown>>
  expect(fields.map((field) => field['name'])).toEqual(['enabled', 'title', 'message', 'link'])
  expect(fields[0]).toMatchObject({type: 'boolean', initialValue: false})
  const {rule, capturedCustom} = createMockRule()
  const validation = field?.['validation'] as Function
  validation(rule)
  const validate = capturedCustom[0]!
  for (const value of [
    undefined,
    {enabled: false},
    {enabled: true},
    {enabled: true, title: 'Update', message: ' '},
    {enabled: true, title: 'Update', message: 'Message', link: {label: 'Read more'}},
    {enabled: true, title: 'Update', message: 'Message', link: {href: '/about'}},
    {enabled: true, title: 'Update', message: 'Sample message.'},
    {
      enabled: true,
      title: 'Update',
      message: 'Sample message.',
      link: {label: 'Read more', href: '/about'},
    },
    {
      enabled: true,
      title: 'Update',
      message: 'Sample message.',
      link: {label: 'Read more', href: 'https://example.com/update'},
    },
  ]) {
    expect(validate(value)).toBe(true)
  }
  for (const value of [
    ...[
      {label: 'Read more', href: 'javascript:alert(1)'},
      {label: 'Read more', href: '//example.com'},
      {label: 'Read more', href: '/\\example.com'},
    ].map((link) => ({enabled: true, title: 'Update', message: 'Sample message.', link})),
  ]) {
    expect(typeof validate(value)).toBe('string')
  }
})

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

test('every image field offers an optional alt-text sibling', () => {
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
      expect(alt?.['validation']).toBeUndefined()
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

test('editors can hide availability or mark a picture for sale or not for sale without a default claim', () => {
  const status = fieldsOf('galleryItem').find((field) => field['name'] === 'saleStatus')
  expect(status).toMatchObject({
    title: 'Sale availability',
    type: 'string',
    options: {
      list: [
        {title: 'None', value: 'none'},
        {title: 'For sale', value: 'for-sale'},
        {title: 'Not for sale', value: 'not-for-sale'},
      ],
      layout: 'radio',
    },
  })
  expect(status?.['description']).toContain('hide the badge')
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

test('legacy content fields allow publishing without a value', () => {
  function inspect(fields: unknown) {
    if (!Array.isArray(fields)) return
    for (const field of fields) {
      if (typeof field.validation === 'function') {
        const {rule} = createMockRule()
        const required = vi.fn(() => rule)
        field.validation(
          new Proxy(rule, {
            get(target, property) {
              return property === 'required' ? required : Reflect.get(target, property)
            },
          }),
        )
        expect(required, String(field.name)).not.toHaveBeenCalled()
      }
      inspect(field.fields)
      for (const member of field.of ?? []) inspect(member.fields)
    }
  }
  for (const type of schemaTypes)
    if (type.name !== 'pricesPage' && 'fields' in type) inspect(type.fields)
  for (const typeName of ['service', 'galleryCollection', 'galleryItem']) {
    expect(
      fieldsOf(typeName).find((field) => field['name'] === 'order')?.['initialValue'],
    ).toBeUndefined()
  }
})

// Prices has a strict publishing contract; legacy partial content remains optional.
test('prices categories can differ from services and use shared price validation', () => {
  expect(fieldNames('pricesPage')).toEqual(
    expect.arrayContaining(['categories', 'fallbackQuote', 'sharedNotes', 'seo']),
  )
  const categories = fieldsOf('pricesPage').find((field) => field['name'] === 'categories')!
  const category = (categories['of'] as Array<Record<string, unknown>>)[0]!
  const {rule, capturedCustom} = createMockRule()
  ;(category['validation'] as Function)(rule)
  const validate = capturedCustom[0]!
  expect(validate({title: 'Wedding gifts'})).toBe(true)
  expect(
    validate({
      title: 'Wedding gifts',
      offers: [{label: 'A gift', mode: 'from', amount: -1, currency: 'EUR', scope: 'per painting'}],
    }),
  ).toContain('amount')
})

test('prices publishing requires non-empty page copy and complete SEO', () => {
  for (const name of [
    'title',
    'introduction',
    'fallbackQuote',
    'fallbackGuidance',
    'enquiryLabel',
    'contactHeading',
    'contactCopy',
    'seo',
  ]) {
    const field = fieldsOf('pricesPage').find((field) => field['name'] === name)!
    const {rule, capturedCustom} = createMockRule()
    ;(field['validation'] as Function)(rule)
    const validate = capturedCustom[0]!
    for (const value of name === 'seo'
      ? [undefined, {}, {title: 'Prices'}, {description: 'Copy'}, {title: ' ', description: 'Copy'}]
      : [undefined, '', ' '])
      expect(typeof validate(value)).toBe('string')
    expect(
      validate(name === 'seo' ? {title: 'Prices', description: 'Copy'} : 'Approved copy'),
    ).toBe(true)
  }
})

test('price row validation accepts all supported modes and rejects incomplete rows', () => {
  const categories = fieldsOf('pricesPage').find((field) => field['name'] === 'categories')!
  const category = (categories['of'] as Array<Record<string, unknown>>)[0]!
  const offers = (category['fields'] as Array<Record<string, unknown>>).find(
    (field) => field['name'] === 'offers',
  )!
  const row = (offers['of'] as Array<Record<string, unknown>>)[0]!
  const {rule, capturedCustom} = createMockRule()
  ;(row['validation'] as Function)(rule)
  const validate = capturedCustom[0]!
  for (const value of [
    undefined,
    {},
    {label: 'Sample', mode: 'fixed', amount: 0, currency: 'EUR', scope: 'per session'},
  ])
    expect(typeof validate(value)).toBe('string')
  for (const value of [
    {label: 'Sample', mode: 'fixed', amount: 40, currency: 'EUR', scope: 'per session'},
    {label: 'Bespoke', mode: 'quote', guidance: 'Send dimensions.'},
  ])
    expect(validate(value)).toBe(true)
})
