import type {JSX} from 'react'
import {PatchEvent, set, unset, type ObjectInputProps} from 'sanity'

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
  lineStrong: 'rgba(39, 64, 56, 0.2)',
  radius: '28px',
  smallShadow: '0 10px 30px rgba(39, 64, 56, 0.07)',
  sagePale: '#e9f0e5',
  error: '#a33b2e',
}

const fieldLabelStyle = {
  display: 'grid' as const,
  gap: '2px',
  fontSize: '14px',
  fontWeight: 650,
  color: tokens.ink,
  textTransform: 'none' as const,
  letterSpacing: 'normal',
}

const helperStyle = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 400,
  color: tokens.inkSoft,
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

const sectionTitleStyle = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 750,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
  color: tokens.inkSoft,
}

const stackPairStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
}

const errorStyle = {margin: 0, fontSize: '12px', color: tokens.error}

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
  const dateError = validateEventDates(value.startsAt, value.endsAt)
  const bookingError =
    typeof value.bookingUrl === 'string' &&
    value.bookingUrl.trim().length > 0 &&
    !isValidHttpUrl(value.bookingUrl)
      ? "That booking link doesn't look like a web address. It should start with https://"
      : undefined
  const sourceError =
    typeof value.sourceUrl === 'string' &&
    value.sourceUrl.trim().length > 0 &&
    !isValidHttpUrl(value.sourceUrl)
      ? "That source link doesn't look like a web address. It should start with https://"
      : undefined

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

  const slugOnlyMembers = keepSlugOnlyMembers(
    props.members as never,
  ) as unknown as typeof props.members

  return (
    <div style={{display: 'grid', gap: '16px', paddingBottom: '96px'}}>
      <div
        data-testid="event-card-editor"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)',
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
            backgroundColor: tokens.forest,
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
        <div style={{display: 'grid', gap: '16px', minWidth: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
            <span
              title="Grouped by Dublin weeks on the Events page"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 9px',
                borderRadius: '999px',
                backgroundColor: surface,
                color: tokens.ink,
                fontSize: '0.75rem',
                fontWeight: 650,
              }}
            >
              <span
                aria-hidden="true"
                style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accent}}
              />
              Appears under: {periodLabelFor(period)}
            </span>
            {value.featured === true ? <span style={{fontSize: '0.78rem'}}>★ Featured</span> : null}
          </div>

          <section aria-label="Essentials" style={{display: 'grid', gap: '12px'}}>
            <p style={sectionTitleStyle}>Essentials</p>
            <label style={fieldLabelStyle}>
              Event name (required)
              <input
                aria-label="Event name"
                style={{...inputStyle, fontSize: '20px', fontWeight: 700, padding: '12px 14px'}}
                value={value.title ?? ''}
                placeholder="Beach clean at Seapoint"
                onChange={setField('title')}
              />
              <p style={helperStyle}>Shown on the card and as the page title.</p>
            </label>
            <label style={fieldLabelStyle}>
              Short description (required)
              <textarea
                aria-label="Short description"
                style={{...inputStyle, minHeight: '64px', resize: 'vertical'}}
                rows={2}
                value={value.summary ?? ''}
                placeholder="One or two sentences residents see first."
                onChange={setField('summary')}
              />
              <p style={helperStyle}>Shown on the card and under the page title.</p>
            </label>
            <div style={stackPairStyle}>
              <label style={fieldLabelStyle}>
                Starts at (required)
                <input
                  aria-label="Starts at"
                  type="datetime-local"
                  style={inputStyle}
                  value={toDatetimeLocalValue(value.startsAt)}
                  onChange={setDateTimeField('startsAt')}
                />
                <p style={helperStyle}>Dublin time. Shown on the date badge.</p>
              </label>
              <label style={fieldLabelStyle}>
                Ends at (optional)
                <input
                  aria-label="Ends at"
                  type="datetime-local"
                  style={inputStyle}
                  value={toDatetimeLocalValue(value.endsAt)}
                  onChange={setDateTimeField('endsAt')}
                />
                <p style={helperStyle}>Dublin time. Leave empty for open-ended events.</p>
              </label>
            </div>
            {typeof value.startsAt !== 'string' || value.startsAt.length === 0 ? (
              <p style={errorStyle}>Add a start date so the card can show.</p>
            ) : null}
            {dateError ? (
              <p role="alert" style={errorStyle}>
                {dateError}
              </p>
            ) : null}
            <label style={fieldLabelStyle}>
              Where (required)
              <input
                aria-label="Where"
                style={inputStyle}
                value={value.location ?? ''}
                placeholder="Shankill DART Station Car Park"
                onChange={setField('location')}
              />
              <p style={helperStyle}>The venue name. We link it to a map automatically.</p>
            </label>
            {typeof value.location !== 'string' || value.location.length === 0 ? (
              <p style={errorStyle}>Add a venue so residents know where to go.</p>
            ) : null}
          </section>

          <section aria-label="Details" style={{display: 'grid', gap: '12px'}}>
            <p style={sectionTitleStyle}>Details</p>
            <div style={stackPairStyle}>
              <label style={fieldLabelStyle}>
                Booking (optional)
                <input
                  aria-label="Booking (optional)"
                  type="url"
                  inputMode="url"
                  style={inputStyle}
                  value={value.bookingUrl ?? ''}
                  placeholder="Paste the booking page address"
                  onChange={setField('bookingUrl')}
                />
                <p style={helperStyle}>
                  Leave empty and the main button links to the source instead.
                </p>
              </label>
              <label style={fieldLabelStyle}>
                Source (required)
                <input
                  aria-label="Source (required)"
                  type="url"
                  inputMode="url"
                  style={inputStyle}
                  value={value.sourceUrl ?? ''}
                  placeholder="Paste the organiser page address"
                  onChange={setField('sourceUrl')}
                />
                <p style={helperStyle}>
                  The organiser page you checked. Also used for calendar files.
                </p>
              </label>
            </div>
            {bookingError ? (
              <p role="alert" style={errorStyle}>
                {bookingError}
              </p>
            ) : null}
            {sourceError ? (
              <p role="alert" style={errorStyle}>
                {sourceError}
              </p>
            ) : null}
            <div style={{display: 'grid', gap: '12px', alignItems: 'end'}}>
              <label style={fieldLabelStyle}>
                Source last checked (required)
                <input
                  aria-label="Source last checked"
                  type="date"
                  style={inputStyle}
                  value={value.sourceReviewedOn ?? ''}
                  onChange={setField('sourceReviewedOn')}
                />
                <p style={helperStyle}>The day you last confirmed the organiser page.</p>
              </label>
              <label
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  padding: '14px',
                  border: `1px solid ${tokens.lineStrong}`,
                  borderRadius: '12px',
                  backgroundColor: tokens.white,
                  fontSize: '14px',
                  color: tokens.ink,
                }}
              >
                <input
                  aria-label="Show on homepage"
                  type="checkbox"
                  checked={value.featured === true}
                  style={{width: '20px', height: '20px', accentColor: tokens.forest, flexShrink: 0}}
                  onChange={(event) =>
                    props.onChange(PatchEvent.from(set(event.currentTarget.checked, ['featured'])))
                  }
                />
                <span>
                  <span style={{display: 'block', fontWeight: 700}}>Show on homepage</span>
                  <span style={{display: 'block', fontSize: '12px', color: tokens.inkSoft}}>
                    Featured events are picked first for the homepage. Keep it to 1 or 2 at a time.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: tokens.sagePale,
              fontSize: '0.82rem',
              color: tokens.inkSoft,
            }}
          >
            <p style={{margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 700}}>
              Residents will see
            </p>
            <p style={{margin: 0}}>
              {formatEventDateTime(value.startsAt)} ·{' '}
              {value.location && value.location.length > 0 ? value.location : 'No venue yet'} ·{' '}
              {value.endsAt ? `Ends ${formatEventDateTime(value.endsAt)}` : 'Open-ended'} · checked{' '}
              {formatEventDate(value.sourceReviewedOn)}
            </p>
            <p style={{margin: '6px 0 0'}}>
              {actionUrl ? (
                <span>{value.bookingUrl ? 'Check organiser details' : 'View event source'}</span>
              ) : (
                <span>No action link yet — add a booking or source address.</span>
              )}
            </p>
          </div>
        </div>
      </div>
      <section aria-label="Web address" style={{display: 'grid', gap: '8px'}}>
        <p style={{margin: 0, fontSize: '0.78rem', color: tokens.inkSoft}}>
          Web address: <code>{slugHint}</code>
        </p>
        <div>{props.renderDefault({...props, members: slugOnlyMembers})}</div>
      </section>
    </div>
  )
}
