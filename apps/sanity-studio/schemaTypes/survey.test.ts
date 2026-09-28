import {expect, test} from 'vitest'

import {invokeAllValidations, preparePreview} from './test-helpers'
import {survey, surveyStages} from './survey'

test('survey stages match the public consultation pills', () => {
  expect([...surveyStages]).toEqual(['upcoming', 'open', 'closed'])
})

test('survey schema declares its consultation identity', () => {
  expect(survey.name).toBe('survey')
  expect(survey.type).toBe('document')
  const names = survey.fields?.map((field) => field.name) ?? []
  for (const required of [
    'title',
    'slug',
    'stage',
    'summary',
    'sourceName',
    'sourceUrl',
    'sourceReviewedOn',
  ]) {
    expect(names).toContain(required)
  }
})

test('survey schema wires every validation without throwing', () => {
  invokeAllValidations(survey.fields ?? [])
})

test('survey preview explains the closing date', () => {
  const prepare = survey.preview?.prepare
  const open = preparePreview(prepare, {
    title: 'Have your say',
    stage: 'open',
    closesOn: '2026-10-01',
  })
  expect(open.title).toBe('Have your say')
  expect(open.subtitle).toContain('open')
  expect(open.subtitle).toContain('Closes')

  const missing = preparePreview(prepare, {})
  expect(missing.title).toBe('Untitled consultation')
  expect(missing.subtitle).toContain('No closing date')

  expect(preparePreview(prepare, {closesOn: ''}).subtitle).toContain('No closing date')
  expect(preparePreview(prepare, {closesOn: 'not-a-date'}).subtitle).toContain('Invalid date')
  expect(preparePreview(prepare, {closesOn: 7}).subtitle).toContain('No closing date')
  expect(preparePreview(prepare, {stage: undefined, closesOn: '2026-10-01'}).subtitle).toContain(
    '—',
  )
})
