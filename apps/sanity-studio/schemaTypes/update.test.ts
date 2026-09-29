import {expect, test} from 'vitest'

import {createMockRule, invokeAllValidations, preparePreview} from './test-helpers'
import {update, updateKinds} from './update'

test('update kind list matches the public card pills', () => {
  expect([...updateKinds]).toEqual([
    'news',
    'planning',
    'community',
    'transport',
    'housing',
    'parks',
    'environment',
    'safety',
    'waste',
    'education',
    'other',
  ])
})

test('update schema declares its document identity', () => {
  expect(update.name).toBe('update')
  expect(update.type).toBe('document')
  const names = update.fields?.map((field) => field.name) ?? []
  for (const required of [
    'title',
    'slug',
    'kind',
    'summary',
    'body',
    'publishedOn',
    'sourceName',
    'sourceUrl',
    'sourceReviewedOn',
  ]) {
    expect(names).toContain(required)
  }
})

test('update schema wires every validation without throwing', () => {
  invokeAllValidations(update.fields ?? [])
})

test('update image alt validation requires alt text only when a photo is set', () => {
  const image = (update.fields ?? []).find((field) => field.name === 'image')
  const alt = image?.fields?.find((field) => field.name === 'alt')
  expect(typeof alt?.validation).toBe('function')
  if (typeof alt?.validation !== 'function') {
    throw new Error('Expected image alt validation')
  }
  const validateRule: Function = alt.validation
  const {rule, capturedCustom} = createMockRule()
  validateRule(rule)
  expect(capturedCustom).toHaveLength(1)
  const validate: Function | undefined = capturedCustom[0]
  if (typeof validate !== 'function') {
    throw new Error('Expected custom validator')
  }
  expect(validate('A path closure notice', {parent: {asset: {}}})).toBe(true)
  expect(validate(undefined, {parent: {asset: {}}})).toBe(
    'Required when a photo is set: describe it for screen readers.',
  )
  expect(validate(undefined, {parent: {}})).toBe(true)
  expect(validate(undefined, {})).toBe(true)
})

test('update preview falls back for missing content and marks featured', () => {
  const prepare = update.preview?.prepare
  expect(typeof prepare).toBe('function')

  const full = preparePreview(prepare, {
    title: 'Path works',
    kind: 'transport',
    publishedOn: '2026-09-05',
    featured: true,
    media: undefined,
  })
  expect(full.title).toBe('Path works')
  expect(full.subtitle).toContain('transport')
  expect(full.subtitle).toContain('Featured')

  const missing = preparePreview(prepare, {})
  expect(missing.title).toBe('Untitled update')
  expect(missing.subtitle).toContain('No date')

  const emptyDate = preparePreview(prepare, {title: 'T', kind: 'news', publishedOn: ''})
  expect(emptyDate.subtitle).toContain('No date')

  const invalidDate = preparePreview(prepare, {
    title: 'T',
    kind: 'news',
    publishedOn: 'not-a-date',
  })
  expect(invalidDate.subtitle).toContain('Invalid date')

  const nonStringDate = preparePreview(prepare, {title: 'T', kind: 'news', publishedOn: 123})
  expect(nonStringDate.subtitle).toContain('No date')

  const missingKind = preparePreview(prepare, {title: 'T', publishedOn: '2026-09-05'})
  expect(missingKind.subtitle).toContain('—')
})
