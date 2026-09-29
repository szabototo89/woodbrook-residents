import {expect, test} from 'vitest'

import {invokeAllValidations, preparePreview} from './test-helpers'
import {providerTypes, resource, resourceCategories} from './resource'

test('resource vocabularies match the directory filters', () => {
  expect([...resourceCategories]).toContain('health')
  expect([...resourceCategories]).toContain('waste')
  expect([...providerTypes]).toEqual([
    'business',
    'public-service',
    'community',
    'nonprofit',
    'other',
  ])
})

test('resource schema declares its directory identity', () => {
  expect(resource.name).toBe('resource')
  expect(resource.type).toBe('document')
  const names = resource.fields?.map((field) => field.name) ?? []
  for (const required of [
    'title',
    'slug',
    'category',
    'serviceType',
    'providerType',
    'description',
    'sourceName',
    'sourceUrl',
    'sourceReviewedOn',
  ]) {
    expect(names).toContain(required)
  }
})

test('resource schema wires every validation without throwing', () => {
  invokeAllValidations(resource.fields ?? [])
})

test('resource preview falls back and marks featured', () => {
  const prepare = resource.preview?.prepare
  const full = preparePreview(prepare, {
    title: 'Shankill Pharmacy',
    category: 'health',
    serviceType: 'Pharmacy',
    featured: true,
  })
  expect(full.title).toBe('Shankill Pharmacy')
  expect(full.subtitle).toContain('health')
  expect(full.subtitle).toContain('Featured')

  const missing = preparePreview(prepare, {})
  expect(missing.title).toBe('Untitled entry')
  expect(missing.subtitle).toContain('—')
})
