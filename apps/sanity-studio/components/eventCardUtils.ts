export type EventTimelineAccent = {accent: string; surface: string}

export type EventTimelinePeriod = 'this-week' | 'next-week' | 'later' | 'earlier'

const DUBLIN_TIME_ZONE = 'Europe/Dublin'
const MILLISECONDS_PER_DAY = 86_400_000

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string' || value.length === 0) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed
}

function isEmpty(value: unknown): boolean {
  return typeof value !== 'string' || value.length === 0
}

export function formatDateBadge(value: unknown): {day: string; month: string} {
  if (isEmpty(value)) return {day: '--', month: 'No date'}
  const parsed = parseDate(value)
  if (!parsed) return {day: '--', month: 'Invalid date'}
  return {
    day: new Intl.DateTimeFormat('en-IE', {day: '2-digit', timeZone: DUBLIN_TIME_ZONE}).format(
      parsed,
    ),
    month: new Intl.DateTimeFormat('en-IE', {month: 'short', timeZone: DUBLIN_TIME_ZONE}).format(
      parsed,
    ),
  }
}

export function formatEventDateTime(value: unknown): string {
  if (isEmpty(value)) return 'No date'
  const parsed = parseDate(value)
  if (!parsed) return 'Invalid date'
  return new Intl.DateTimeFormat('en-IE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: DUBLIN_TIME_ZONE,
  }).format(parsed)
}

export function formatEventDate(value: unknown): string {
  if (isEmpty(value)) return 'No date'
  const parsed = parseDate(value)
  if (!parsed) return 'Invalid date'
  return new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: DUBLIN_TIME_ZONE,
  }).format(parsed)
}

export function getTimelineAccent(period: EventTimelinePeriod): EventTimelineAccent {
  if (period === 'this-week') return {accent: '#416b58', surface: '#e9f0e5'}
  if (period === 'next-week') return {accent: '#8a6d3f', surface: '#f8edc6'}
  return {accent: '#61716a', surface: '#eeeade'}
}

export function periodLabelFor(period: EventTimelinePeriod): string {
  if (period === 'this-week') return 'This week'
  if (period === 'next-week') return 'Next week'
  if (period === 'later') return 'Later'
  return 'Earlier dates'
}

export function validateEventDates(startsAt: unknown, endsAt: unknown): string | undefined {
  const start = parseDate(startsAt)
  const end = parseDate(endsAt)
  if (!start || !end) return undefined
  if (end.getTime() <= start.getTime()) return 'End time should be after the start time.'
  return undefined
}

export function isValidHttpUrl(value: unknown): boolean {
  if (typeof value !== 'string') return true
  const trimmed = value.trim()
  if (trimmed.length === 0) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

type SlugFilterMember = {
  kind: string
  name?: string
  fieldSet?: {members: Array<SlugFilterMember>; [key: string]: unknown}
  [key: string]: unknown
}

export function keepSlugOnlyMembers<T extends SlugFilterMember>(members: T[]): T[] {
  const kept: T[] = []
  for (const member of members) {
    if (member.kind === 'field') {
      if (member.name === 'slug') kept.push(member)
      continue
    }
    if (member.kind === 'fieldSet' && member.fieldSet) {
      const inner = member.fieldSet.members.filter(
        (item) => item.kind === 'field' && item.name === 'slug',
      )
      if (inner.length > 0) {
        kept.push({...member, fieldSet: {...member.fieldSet, members: inner}} as T)
      }
      continue
    }
    kept.push(member)
  }
  return kept
}

function getDublinDayNumber(value: string | Date): number {
  const parts = new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: DUBLIN_TIME_ZONE,
  }).formatToParts(new Date(value))
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return (
    Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)) /
    MILLISECONDS_PER_DAY
  )
}

function startOfWeek(dayNumber: number): number {
  const dayOfWeek = new Date(dayNumber * MILLISECONDS_PER_DAY).getUTCDay()
  const daysSinceMonday = (dayOfWeek + 6) % 7
  return dayNumber - daysSinceMonday
}

export function periodForEventDate(
  startsAt: unknown,
  now: string | Date = new Date(),
): EventTimelinePeriod {
  const parsed = parseDate(startsAt)
  if (!parsed) return 'later'
  const thisWeekStarts = startOfWeek(getDublinDayNumber(now))
  const nextWeekStarts = thisWeekStarts + 7
  const laterStarts = nextWeekStarts + 7
  const eventDay = getDublinDayNumber(parsed)
  if (eventDay < thisWeekStarts) return 'earlier'
  if (eventDay < nextWeekStarts) return 'this-week'
  if (eventDay < laterStarts) return 'next-week'
  return 'later'
}

export function toDatetimeLocalValue(value: unknown): string {
  const parsed = parseDate(value)
  if (!parsed) return ''
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string): string | undefined {
  if (value.length === 0) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString()
}

export function getEventPreviewPath(slug: unknown): string {
  const current =
    typeof slug === 'string'
      ? slug
      : typeof slug === 'object' && slug !== null && 'current' in slug
        ? (slug as {current?: unknown}).current
        : undefined
  if (typeof current !== 'string' || current.length === 0) {
    return 'No web address yet — set the slug below.'
  }
  return `/events/${current}`
}
