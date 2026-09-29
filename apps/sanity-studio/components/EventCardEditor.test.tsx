import {expect, test, vi} from 'vitest'

import {EventCardEditor} from './EventCardEditor'

function fieldMembers(names: string[]) {
  return names.map((name) => ({kind: 'field', key: name, name}))
}

function defaultMembers() {
  return [
    {
      kind: 'fieldSet',
      key: 'identity',
      fieldSet: {name: 'identity', members: fieldMembers(['title', 'slug'])},
    },
    {
      kind: 'fieldSet',
      key: 'content',
      fieldSet: {name: 'content', members: fieldMembers(['summary', 'bookingUrl'])},
    },
    {
      kind: 'fieldSet',
      key: 'dates',
      fieldSet: {name: 'dates', members: fieldMembers(['startsAt', 'endsAt', 'location'])},
    },
    {
      kind: 'fieldSet',
      key: 'source',
      fieldSet: {name: 'source', members: fieldMembers(['sourceUrl', 'sourceReviewedOn'])},
    },
    {
      kind: 'fieldSet',
      key: 'featuring',
      fieldSet: {name: 'featuring', members: fieldMembers(['featured'])},
    },
    {kind: 'error', key: 'doc-error'},
  ]
}

function renderCard(value: Record<string, unknown>, onChange = vi.fn()) {
  let captured: {members?: unknown[]} | undefined
  const props = {
    value,
    members: defaultMembers(),
    onChange,
    renderDefault: (next: {members?: unknown[]}) => {
      captured = next
      return {type: 'default-form', props: {count: next.members?.length ?? 0}}
    },
    renderField: () => null,
    renderInput: () => null,
    renderItem: () => null,
    renderPreview: () => null,
  }
  const element = EventCardEditor(props as never)
  return {element, captured: () => captured, onChange}
}

function textOf(element: unknown): string {
  return JSON.stringify(element)
}

function findInputs(element: unknown, label: string): Array<{onChange: (e: unknown) => void}> {
  const found: Array<{onChange: (e: unknown) => void}> = []
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (node !== null && typeof node === 'object' && 'props' in node) {
      const props = (node as {props?: Record<string, unknown>}).props ?? {}
      if (props['aria-label'] === label && typeof props['onChange'] === 'function') {
        found.push({onChange: props['onChange'] as (e: unknown) => void})
      }
      if ('children' in props) walk(props['children'])
    }
  }
  walk(element)
  return found
}

function fireChange(element: unknown, label: string, value: unknown) {
  const inputs = findInputs(element, label)
  expect(inputs.length).toBeGreaterThan(0)
  for (const input of inputs) {
    input.onChange({currentTarget: {value, checked: value}})
  }
}

test('uses plain-language labels with sections and no emoji', () => {
  const {element} = renderCard({title: 'Beach clean', summary: 'Join us', location: 'Seapoint'})
  const text = textOf(element)
  expect(text).toContain('Event name')
  expect(text).toContain('Short description')
  expect(text).toContain('Essentials')
  expect(text).toContain('Details')
  expect(text).toContain('Residents will see')
  expect(text).not.toContain('TITLE — CARD HEADING')
  expect(text).not.toContain('SUMMARY — CARD + PAGE DECK')
  expect(text).not.toContain('📅')
  expect(text).not.toContain('📍')
  expect(text).not.toContain('🕒')
})

test('shows where the event appears without internal week jargon', () => {
  const past = renderCard({startsAt: '2020-01-05T12:00:00.000Z'})
  expect(textOf(past.element)).toContain('Appears under:')
  expect(textOf(past.element)).not.toContain('· Dublin week')
})

test('renders remaining form only for the slug so fields appear once', () => {
  const {captured} = renderCard({title: 'T'})
  const members = (captured()?.members ?? []) as Array<{kind: string; name?: string}>
  const flat = JSON.stringify(members)
  expect(flat).toContain('slug')
  expect(flat).not.toContain('"name":"title"')
  expect(flat).not.toContain('"name":"summary"')
  expect(flat).not.toContain('"name":"startsAt"')
})

test('marks booking as optional and source as required', () => {
  const {element} = renderCard({})
  const text = textOf(element)
  expect(text).toContain('Booking (optional)')
  expect(text).toContain('Source (required)')
  expect(text).toContain('Leave empty and the main button links to the source instead')
})

test('shows friendly validation for dates and links', () => {
  const bad = renderCard({
    startsAt: '2026-09-27T16:00:00.000Z',
    endsAt: '2026-09-26T12:00:00.000Z',
    bookingUrl: 'not a url',
    sourceUrl: 'bray.ie/festivals',
  })
  const text = textOf(bad.element)
  expect(text).toContain('End time should be after the start time.')
  expect(text).toContain("doesn't look like a web address")
  expect(text.toLowerCase()).not.toContain('crash')
})

test('editing every card field patches the document', () => {
  const onChange = vi.fn()
  const {element} = renderCard(
    {
      title: 'Old',
      summary: 'Old summary',
      startsAt: '2026-09-26T12:00:00.000Z',
      endsAt: '2026-09-27T16:00:00.000Z',
      location: 'Old venue',
      bookingUrl: 'https://example.com/book',
      sourceUrl: 'https://example.com/source',
      sourceReviewedOn: '2026-09-21',
      featured: false,
    },
    onChange,
  )
  fireChange(element, 'Event name', 'New name')
  fireChange(element, 'Short description', 'New summary')
  fireChange(element, 'Starts at', '2026-09-28T10:00')
  fireChange(element, 'Ends at', '')
  fireChange(element, 'Where', '')
  fireChange(element, 'Booking (optional)', 'https://example.com/new')
  fireChange(element, 'Source (required)', 'https://example.com/ok')
  fireChange(element, 'Source last checked', '2026-09-22')
  fireChange(element, 'Show on homepage', true)
  expect(onChange).toHaveBeenCalled()
  expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(9)
})

test('covers timeline, featured, and link variants', () => {
  const now = Date.now()
  const day = 86_400_000
  const variants = [
    {startsAt: new Date(now).toISOString(), featured: true, location: 'Hall'},
    {
      startsAt: new Date(now + 8 * day).toISOString(),
      endsAt: new Date(now + 9 * day).toISOString(),
    },
    {
      startsAt: new Date(now + 30 * day).toISOString(),
      bookingUrl: 'https://example.com/book',
      slug: {current: 'summer-fair'},
    },
    {sourceUrl: 'https://example.com/source', slug: 'autumn-fair'},
    {},
  ]
  for (const value of variants) {
    const {element} = renderCard(value)
    expect(textOf(element)).toContain('Appears under:')
  }
})
