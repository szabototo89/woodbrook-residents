import type {JSX} from 'react'
import {PatchEvent, set, unset, type ObjectInputProps} from 'sanity'

import {
  formatDateBadge,
  formatEventDate,
  formatEventDateTime,
  fromDatetimeLocalValue,
  getEventPreviewPath,
  getTimelineAccent,
  periodForEventDate,
  toDatetimeLocalValue,
  type EventTimelinePeriod,
} from './eventCardUtils'

type EventEditorValue = {
  title?: string
  slug?: {current?: string} | string
  summary?: string
  startsAt?: string
  endsAt?: string
  location?: string
  bookingUrl?: string
  sourceUrl?: string
  sourceReviewedOn?: string
  featured?: boolean
}

type EventCardEditorProps = ObjectInputProps & {
  value?: EventEditorValue
}

const tokens = {
  ink: '#274038',
  inkSoft: '#61716a',
  forest: '#416b58',
  white: '#fffdf8',
  line: 'rgba(39, 64, 56, 0.13)',
  lineStrong: 'rgba(39, 64, 56, 0.2)',
  radius: '28px',
  smallShadow: '0 10px 30px rgba(39, 64, 56, 0.07)',
  sagePale: '#e9f0e5',
  paperDeep: '#eeeade',
}

const labelStyle = {
  display: 'grid' as const,
  gap: '4px',
  fontSize: '12px',
  fontWeight: 700,
  color: tokens.inkSoft,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}

const inputStyle = {
  width: '100%',
  padding: '9px 11px',
  border: `1px solid ${tokens.lineStrong}`,
  borderRadius: '10px',
  backgroundColor: tokens.white,
  color: tokens.ink,
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none' as const,
  letterSpacing: 'normal',
}

function patchField(field: string, raw: string): ReturnType<typeof PatchEvent.from> {
  const trimmed = raw.trim()
  if (trimmed.length === 0) return PatchEvent.from(unset([field]))
  return PatchEvent.from(set(trimmed, [field]))
}

export function EventCardEditor(props: EventCardEditorProps): JSX.Element {
  const value = props.value ?? {}
  const badge = formatDateBadge(value.startsAt)
  const period: EventTimelinePeriod = periodForEventDate(value.startsAt)
  const {accent, surface} = getTimelineAccent(period)
  const actionUrl = value.bookingUrl ?? value.sourceUrl
  const slugHint = getEventPreviewPath(value.slug)

  const setField = (field: string) => (event: {currentTarget: {value: string}}) => {
    props.onChange(patchField(field, event.currentTarget.value))
  }

  const setDateTimeField =
    (field: 'startsAt' | 'endsAt') => (event: {currentTarget: {value: string}}) => {
      const iso = fromDatetimeLocalValue(event.currentTarget.value)
      props.onChange(
        iso === undefined ? PatchEvent.from(unset([field])) : PatchEvent.from(set(iso, [field])),
      )
    }

  return (
    <div style={{display: 'grid', gap: '16px'}}>
      <div
        data-testid="event-card-editor"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '22px',
          padding: '28px',
          borderRadius: tokens.radius,
          backgroundColor: tokens.white,
          boxShadow: tokens.smallShadow,
          borderLeft: `5px solid ${accent}`,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            display: 'grid',
            width: '72px',
            height: '82px',
            placeContent: 'center',
            borderRadius: '17px',
            backgroundColor: accent,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <strong style={{fontSize: '1.9rem', fontWeight: 800, lineHeight: 1}}>{badge.day}</strong>
          <span
            style={{
              marginTop: '4px',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {badge.month}
          </span>
        </div>
        <div style={{display: 'grid', gap: '12px', minWidth: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 9px',
                borderRadius: '999px',
                backgroundColor: surface,
                color: accent,
                fontSize: '0.7rem',
                fontWeight: 760,
              }}
            >
              <span
                aria-hidden="true"
                style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accent}}
              />
              {period === 'this-week'
                ? 'This week'
                : period === 'next-week'
                  ? 'Next week'
                  : period === 'later'
                    ? 'Later'
                    : 'Earlier dates'}{' '}
              · Dublin week
            </span>
            {value.featured === true ? <span style={{fontSize: '0.78rem'}}>★ Featured</span> : null}
          </div>
          <label style={labelStyle}>
            Title — card heading
            <input
              aria-label="Title — card heading"
              style={inputStyle}
              value={value.title ?? ''}
              placeholder="Beach clean at Seapoint"
              onChange={setField('title')}
            />
          </label>
          <label style={labelStyle}>
            Summary — card + page deck
            <textarea
              aria-label="Summary — card and page deck"
              style={{...inputStyle, minHeight: '64px', resize: 'vertical'}}
              rows={2}
              value={value.summary ?? ''}
              placeholder="One or two sentences residents see first."
              onChange={setField('summary')}
            />
          </label>
          <div style={{display: 'grid', gap: '8px', color: tokens.inkSoft, fontSize: '0.82rem'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span aria-hidden="true">📅</span>
              {formatEventDateTime(value.startsAt)}
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span aria-hidden="true">📍</span>
              {value.location && value.location.length > 0 ? value.location : 'No venue yet'}
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span aria-hidden="true">🕒</span>
              {value.endsAt ? `Ends ${formatEventDateTime(value.endsAt)}` : 'Open-ended'}
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <label style={labelStyle}>
              Starts at
              <input
                aria-label="Starts at"
                type="datetime-local"
                style={inputStyle}
                value={toDatetimeLocalValue(value.startsAt)}
                onChange={setDateTimeField('startsAt')}
              />
            </label>
            <label style={labelStyle}>
              Ends at
              <input
                aria-label="Ends at"
                type="datetime-local"
                style={inputStyle}
                value={toDatetimeLocalValue(value.endsAt)}
                onChange={setDateTimeField('endsAt')}
              />
            </label>
          </div>
          <label style={labelStyle}>
            Location — links to Google Maps
            <input
              aria-label="Location"
              style={inputStyle}
              value={value.location ?? ''}
              placeholder="Shankill DART Station Car Park"
              onChange={setField('location')}
            />
          </label>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <label style={labelStyle}>
              Booking link
              <input
                aria-label="Booking link"
                type="url"
                inputMode="url"
                style={inputStyle}
                value={value.bookingUrl ?? ''}
                placeholder="https://…"
                onChange={setField('bookingUrl')}
              />
            </label>
            <label style={labelStyle}>
              Source link
              <input
                aria-label="Source link"
                type="url"
                inputMode="url"
                style={inputStyle}
                value={value.sourceUrl ?? ''}
                placeholder="https://…"
                onChange={setField('sourceUrl')}
              />
            </label>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              alignItems: 'end',
            }}
          >
            <label style={labelStyle}>
              Source last checked
              <input
                aria-label="Source last checked"
                type="date"
                style={inputStyle}
                value={value.sourceReviewedOn ?? ''}
                onChange={setField('sourceReviewedOn')}
              />
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: tokens.ink,
                textTransform: 'none',
                letterSpacing: 'normal',
              }}
            >
              <input
                aria-label="Featured"
                type="checkbox"
                checked={value.featured === true}
                onChange={(event) =>
                  props.onChange(PatchEvent.from(set(event.currentTarget.checked, ['featured'])))
                }
              />
              Featured for homepage
            </label>
          </div>
          <p style={{margin: 0, fontSize: '0.78rem', color: tokens.inkSoft}}>
            Web address (read-only): <code>{slugHint}</code>
            {typeof value.slug === 'object' && value.slug !== null
              ? ' — edit the slug field below; changing it breaks links and calendar files.'
              : ' — set the slug field below.'}
          </p>
          <div
            style={{
              marginTop: '4px',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: tokens.sagePale,
              fontSize: '0.82rem',
              color: tokens.inkSoft,
            }}
          >
            <p
              style={{
                margin: '0 0 6px',
                fontSize: '0.72rem',
                fontWeight: 750,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Detail preview — Starts / Location
            </p>
            <p style={{margin: 0}}>
              {formatEventDate(value.startsAt)} · {value.location ?? 'No venue'} · checked{' '}
              {formatEventDate(value.sourceReviewedOn)}
            </p>
            {actionUrl ? (
              <a href={actionUrl} target="_blank" rel="noreferrer">
                {value.bookingUrl ? 'Check organiser details' : 'View event source'} →
              </a>
            ) : (
              <span>No action link yet — add a booking or source URL.</span>
            )}
          </div>
        </div>
      </div>
      <div>{props.renderDefault(props)}</div>
    </div>
  )
}
