import {expect, test} from 'vitest'

import {invokeAllValidations, preparePreview} from './test-helpers'
import {collectionDate} from './collectionDate'
import {issueReport} from './issueReport'
import {resourceDetail} from './resourceDetail'
import {siteSetting} from './siteSetting'

test('collection date object declares its pickup fields', () => {
  expect(collectionDate.name).toBe('collectionDate')
  expect(collectionDate.type).toBe('object')
  invokeAllValidations(collectionDate.fields ?? [])
  expect(collectionDate.preview).toMatchObject({
    select: {title: 'date', subtitle: 'stream'},
  })
})

test('resource detail object declares its label facts', () => {
  expect(resourceDetail.name).toBe('resourceDetail')
  expect(resourceDetail.type).toBe('object')
  invokeAllValidations(resourceDetail.fields ?? [])
  expect(resourceDetail.preview).toMatchObject({
    select: {title: 'label', subtitle: 'value'},
  })
})

test('site setting declares the single website identity', () => {
  expect(siteSetting.name).toBe('siteSetting')
  expect(siteSetting.type).toBe('document')
  invokeAllValidations(siteSetting.fields ?? [])
  expect(siteSetting.preview).toMatchObject({
    select: {title: 'name', subtitle: 'location'},
  })
  const names = siteSetting.fields?.map((field) => field.name) ?? []
  for (const required of ['name', 'location', 'tagline', 'introduction']) {
    expect(names).toContain(required)
  }
})

test('issue report preview always marks records private', () => {
  expect(issueReport.name).toBe('issueReport')
  invokeAllValidations(issueReport.fields ?? [])
  const prepare = issueReport.preview?.prepare
  const full = preparePreview(prepare, {
    title: 'Missed bin',
    subtitle: 'Main Street',
    description: 'triaged',
  })
  expect(full.title).toBe('Missed bin')
  expect(full.subtitle).toContain('PRIVATE')
  expect(full.subtitle).toContain('triaged')

  const missing = preparePreview(prepare, {})
  expect(missing.title).toBe('Untitled report')
  expect(missing.subtitle).toContain('No location')
  expect(missing.subtitle).toContain('PRIVATE')
})
