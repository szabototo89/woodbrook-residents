# Native mobile date labels

Status: Available

## Job to be done

When I open the resident app on iOS, I want dated content to load so I can read
local updates and event details without a browser-only runtime dependency.

## Visible behavior

- Home, collection and detail screens render published content when `Intl` is absent.
- Dates retain English month abbreviations and day/month/year order.
- Event times retain 24-hour hours and minutes in the device's local time zone.
- Invalid dates remain errors instead of displaying broken date labels.

## Acceptance criteria

- With `Intl` undefined, both shared date formatters return the expected labels.
- Midnight minutes are padded; leap-day and month labels remain readable.
- Native home and article/event screens display real Sanity content in the Orca simulator.
- Desktop/phone browser rendering, mobile tests and both bundle builds continue to pass.

## Scope

Included: removing the shared formatters' dependency on `Intl.DateTimeFormat`,
regression tests and native/browser verification. Excluded: changing device time
zone semantics, event selection, category filters, native font support, or other
mobile parity features.
