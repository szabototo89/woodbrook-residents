import {expect, test} from 'vitest'

import {invokeAllValidations, preparePreview} from './test-helpers'
import {event} from './event'

test('event schema declares the community date identity', () => {
  expect(event.name).toBe('event')
  expect(event.type).toBe('document')
  const names = event.fields?.map((field) => field.name) ?? []
  for (const required of [
    'title',
    'slug',
    'summary',
    'startsAt',
    'location',
    'sourceUrl',
    'sourceReviewedOn',
  ]) {
    expect(names).toContain(required)
  }
})

test('event schema wires every validation without throwing', () => {
  invokeAllValidations(event.fields ?? [])
})

test('event preview handles missing venue and featured flag', () => {
  const prepare = event.preview?.prepare
  expect(typeof prepare).toBe('function')

  const full = preparePreview(prepare, {
    title: 'Summer fair',
    startsAt: '2026-07-04T12:00:00.000Z',
    location: 'Shankill',
    featured: true,
  })
  expect(full.title).toBe('Summer fair')
  expect(full.subtitle).toContain('Shankill')
  expect(full.subtitle).toContain('Featured')

  const missing = preparePreview(prepare, {})
  expect(missing.title).toBe('Untitled event')
  expect(missing.subtitle).toContain('No date')
  expect(missing.subtitle).toContain('No venue')

  expect(preparePreview(prepare, {title: 'T', startsAt: '', location: 'Hall'}).subtitle).toContain(
    'No date',
  )
  expect(
    preparePreview(prepare, {title: 'T', startsAt: 'not-a-date', location: 'Hall'}).subtitle,
  ).toContain('Invalid date')
  expect(preparePreview(prepare, {title: 'T', startsAt: 123, location: ''}).subtitle).toContain(
    'No date',
  )
  expect(preparePreview(prepare, {title: 'T', startsAt: 123, location: ''}).subtitle).toContain(
    'No venue',
  )
})
