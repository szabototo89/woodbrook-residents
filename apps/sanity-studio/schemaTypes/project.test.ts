import {expect, test} from 'vitest'

import {createMockRule, invokeAllValidations, preparePreview} from './test-helpers'
import {project, projectCategories, projectStages} from './project'

test('project category and stage vocabularies match the public cards', () => {
  expect([...projectCategories]).toEqual([
    'transport',
    'housing',
    'parks',
    'public-realm',
    'planning',
    'community',
    'environment',
    'safety',
    'education',
    'other',
  ])
  expect([...projectStages]).toEqual([
    'proposed',
    'active',
    'monitoring',
    'paused',
    'completed',
    'consultation',
  ])
})

test('project schema declares its tracked-initiative identity', () => {
  expect(project.name).toBe('project')
  expect(project.type).toBe('document')
  const names = project.fields?.map((field) => field.name) ?? []
  for (const required of [
    'title',
    'slug',
    'category',
    'stage',
    'summary',
    'details',
    'updatedOn',
    'sourceName',
    'sourceUrl',
    'sourceReviewedOn',
  ]) {
    expect(names).toContain(required)
  }
})

test('project schema wires every validation without throwing', () => {
  invokeAllValidations(project.fields ?? [])
})

test('project image alt validation requires alt text only when a photo is set', () => {
  const image = (project.fields ?? []).find((field) => field.name === 'image')
  const alt = image?.fields?.find((field) => field.name === 'alt')
  if (typeof alt?.validation !== 'function') {
    throw new Error('Expected image alt validation')
  }
  const validateRule: Function = alt.validation
  const {rule, capturedCustom} = createMockRule()
  validateRule(rule)
  expect(capturedCustom).toHaveLength(1)
  const validate = capturedCustom[0]
  if (typeof validate !== 'function') {
    throw new Error('Expected custom validator')
  }
  expect(validate('Greenway photo', {parent: {asset: {}}})).toBe(true)
  expect(validate(undefined, {parent: {asset: {}}})).toBe(
    'Required when a photo is set: describe it for screen readers.',
  )
  expect(validate(undefined, {parent: {}})).toBe(true)
})

test('project preview falls back and marks featured', () => {
  const prepare = project.preview?.prepare
  const full = preparePreview(prepare, {
    title: 'Greenway',
    stage: 'active',
    category: 'transport',
    updatedOn: '2026-09-01',
    featured: true,
  })
  expect(full.title).toBe('Greenway')
  expect(full.subtitle).toContain('active')
  expect(full.subtitle).toContain('transport')
  expect(full.subtitle).toContain('Featured')

  const missing = preparePreview(prepare, {})
  expect(missing.title).toBe('Untitled project')
  expect(missing.subtitle).toContain('No date')

  expect(preparePreview(prepare, {updatedOn: ''}).subtitle).toContain('No date')
  expect(preparePreview(prepare, {updatedOn: 'not-a-date'}).subtitle).toContain('Invalid date')
  expect(preparePreview(prepare, {updatedOn: 42}).subtitle).toContain('No date')
  expect(
    preparePreview(prepare, {stage: undefined, category: undefined, updatedOn: '2026-09-01'})
      .subtitle,
  ).toContain('—')
})
