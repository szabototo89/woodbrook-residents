import {describe, expect, test} from 'bun:test'

import {
  formatDateBadge,
  formatEventDate,
  formatEventDateTime,
  fromDatetimeLocalValue,
  getEventPreviewPath,
  getTimelineAccent,
  periodForEventDate,
  toDatetimeLocalValue,
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
})
