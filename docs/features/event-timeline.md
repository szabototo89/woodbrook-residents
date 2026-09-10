# Event timeline

Status: Available

## Job to be done

When I browse local events, I want dates grouped into clear near-term periods, so I can quickly understand what is happening soon and what I can plan for later.

## User-visible behavior

- The Events page groups published dates into This week, Next week, and Later.
- Older dates that remain published are kept in a clearly labelled Earlier dates section instead of being presented as current.
- Each visible period shows its calendar range using Monday-based Irish weeks.
- Empty periods are omitted, keeping the page concise when only a few events are published.
- Periods use distinct but restrained colour accents while retaining the familiar event cards, dates, locations, and detail links.
- The browser updates relative week groups from the current date after the static page loads; the complete event list remains available as a no-JavaScript fallback.

## Acceptance criteria

- Given events occur in the current week, following week, and beyond, when a resident opens Events, then each event appears under the matching timeline heading.
- Given a timeline period has no published events, when the page renders, then that empty period heading is not shown.
- Given an older event remains published, when the page renders, then it appears after upcoming periods under Earlier dates.
- Given a week crosses a month boundary, when its range is shown, then both month names are clear.
- Given a resident uses a narrow mobile viewport, when they browse the event timeline, then headings, ranges, and cards stack without horizontal overflow.
- Given the site has not rebuilt since a week boundary, when a resident loads Events with JavaScript available, then the periods reflect the current date in Dublin rather than the build date.
- Given JavaScript is unavailable, when a resident loads Events, then every published event remains visible in chronological order.

## Scope

### Included

- Visual grouping of the existing published event list.
- Monday-based week boundaries in the Europe/Dublin time zone.

### Not included

- Calendar filtering, event submission, reminders, or changes to event publishing.
