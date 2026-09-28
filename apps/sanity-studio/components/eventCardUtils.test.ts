import {describe, expect, test} from 'vitest'

import {
  formatDateBadge,
  formatEventDate,
  formatEventDateTime,
  fromDatetimeLocalValue,
  getEventPreviewPath,
  getTimelineAccent,
  isValidHttpUrl,
  keepSlugOnlyMembers,
  periodForEventDate,
  periodLabelFor,
  toDatetimeLocalValue,
  validateEventDates,
} from './eventCardUtils'

describe('eventCardUtils', () => {
  test('formats badge day and month in Europe/Dublin like EventCard', () => {
    const badge = formatDateBadge('2026-06-14T10:00:00.000Z')
    expect(badge.day).toBe(
      new Intl.DateTimeFormat('en-IE', {day: '2-digit', timeZone: 'Europe/Dublin'}).format(
        new Date('2026-06-14T10:00:00.000Z'),
      ),
    )
    expect(badge.month).toBe(
      new Intl.DateTimeFormat('en-IE', {month: 'short', timeZone: 'Europe/Dublin'}).format(
        new Date('2026-06-14T10:00:00.000Z'),
      ),
    )
  })

  test('falls back for empty and invalid badge dates', () => {
    expect(formatDateBadge(undefined)).toEqual({day: '--', month: 'No date'})
    expect(formatDateBadge('')).toEqual({day: '--', month: 'No date'})
    expect(formatDateBadge('not-a-date')).toEqual({day: '--', month: 'Invalid date'})
  })

  test('formats date-time like the public event-meta row', () => {
    expect(formatEventDateTime('2026-06-14T10:00:00.000Z')).toBe(
      new Intl.DateTimeFormat('en-IE', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Europe/Dublin',
      }).format(new Date('2026-06-14T10:00:00.000Z')),
    )
    expect(formatEventDateTime(undefined)).toBe('No date')
    expect(formatEventDateTime('bad')).toBe('Invalid date')
  })

  test('formats long date like the detail header', () => {
    expect(formatEventDate('2026-06-14T10:00:00.000Z')).toBe(
      new Intl.DateTimeFormat('en-IE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Dublin',
      }).format(new Date('2026-06-14T10:00:00.000Z')),
    )
    expect(formatEventDate('')).toBe('No date')
  })

  test('maps timeline periods to web accent tokens', () => {
    expect(getTimelineAccent('this-week')).toEqual({accent: '#416b58', surface: '#e9f0e5'})
    expect(getTimelineAccent('next-week')).toEqual({accent: '#8a6d3f', surface: '#f8edc6'})
    expect(getTimelineAccent('later')).toEqual({accent: '#61716a', surface: '#eeeade'})
    expect(getTimelineAccent('earlier')).toEqual({accent: '#61716a', surface: '#eeeade'})
  })

  test('groups dates into Dublin Monday weeks like the Events page', () => {
    // Monday 2026-06-08 is start of this-week when now is Wed 2026-06-10 Dublin.
    expect(periodForEventDate('2026-06-10T10:00:00Z', '2026-06-10T12:00:00Z')).toBe('this-week')
    expect(periodForEventDate('2026-06-17T10:00:00Z', '2026-06-10T12:00:00Z')).toBe('next-week')
    expect(periodForEventDate('2026-07-01T10:00:00Z', '2026-06-10T12:00:00Z')).toBe('later')
    expect(periodForEventDate('2026-06-01T10:00:00Z', '2026-06-10T12:00:00Z')).toBe('earlier')
    expect(periodForEventDate(undefined, '2026-06-10T12:00:00Z')).toBe('later')
  })

  test('converts Sanity datetimes to datetime-local values and back', () => {
    expect(toDatetimeLocalValue(undefined)).toBe('')
    expect(toDatetimeLocalValue('bad')).toBe('')
    const local = toDatetimeLocalValue('2026-06-14T10:00:00.000Z')
    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    expect(fromDatetimeLocalValue('')).toBeUndefined()
    expect(fromDatetimeLocalValue('2026-06-14T11:00')).toBe(
      new Date('2026-06-14T11:00').toISOString(),
    )
  })

  test('builds read-only slug hint with public event path', () => {
    expect(getEventPreviewPath({current: 'summer-fair'})).toBe('/events/summer-fair')
    expect(getEventPreviewPath('summer-fair')).toBe('/events/summer-fair')
    expect(getEventPreviewPath(undefined)).toBe('No web address yet — set the slug below.')
  })

  test('labels timeline periods in plain language', () => {
    expect(periodLabelFor('this-week')).toBe('This week')
    expect(periodLabelFor('next-week')).toBe('Next week')
    expect(periodLabelFor('later')).toBe('Later')
    expect(periodLabelFor('earlier')).toBe('Earlier dates')
  })

  test('flags end dates that are not after the start', () => {
    expect(
      validateEventDates('2026-09-26T12:00:00.000Z', '2026-09-27T16:00:00.000Z'),
    ).toBeUndefined()
    expect(validateEventDates('2026-09-26T12:00:00.000Z', '2026-09-26T12:00:00.000Z')).toBe(
      'End time should be after the start time.',
    )
    expect(validateEventDates('2026-09-27T16:00:00.000Z', '2026-09-26T12:00:00.000Z')).toBe(
      'End time should be after the start time.',
    )
    expect(validateEventDates('2026-09-26T12:00:00.000Z', undefined)).toBeUndefined()
    expect(validateEventDates(undefined, undefined)).toBeUndefined()
    expect(validateEventDates('bad', '2026-09-26T12:00:00.000Z')).toBeUndefined()
  })

  test('checks http URLs without flagging empty optional fields', () => {
    expect(isValidHttpUrl('')).toBe(true)
    expect(isValidHttpUrl(undefined)).toBe(true)
    expect(isValidHttpUrl('https://bray.ie/festivals/')).toBe(true)
    expect(isValidHttpUrl('http://example.com')).toBe(true)
    expect(isValidHttpUrl('bray.ie/festivals')).toBe(false)
    expect(isValidHttpUrl('not a url')).toBe(false)
  })

  test('keeps only the slug member so card fields appear once', () => {
    const members = [
      {kind: 'field', key: 'title', name: 'title'},
      {
        kind: 'fieldSet',
        key: 'identity',
        fieldSet: {
          name: 'identity',
          members: [
            {kind: 'field', key: 'title', name: 'title'},
            {kind: 'field', key: 'slug', name: 'slug'},
          ],
        },
      },
      {
        kind: 'fieldSet',
        key: 'dates',
        fieldSet: {
          name: 'dates',
          members: [{kind: 'field', key: 'startsAt', name: 'startsAt'}],
        },
      },
      {kind: 'error', key: 'some-error'},
    ]
    const kept = keepSlugOnlyMembers(members as never) as Array<{kind: string; name?: string}>
    expect(kept.some((m) => m.kind === 'field' && m.name === 'title')).toBe(false)
    const asJson = JSON.stringify(kept)
    expect(asJson).toContain('slug')
    expect(asJson).not.toContain('startsAt')
    expect(asJson).not.toContain('"name":"title"')
  })
})
