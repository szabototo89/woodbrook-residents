# Add to calendar

Status: Available

## Job to be done

When I find a Woodbrook event I want to attend, I want to save it to my own calendar app, so I do not have to remember the details.

## User-visible behavior

- Each event detail page shows an Add to calendar button styled like the other event actions.
- Activating the button opens a calendar-choice list rather than downloading a file directly.
- The choice list opens as a modal, which keeps it usable on narrow mobile viewports including iOS Safari and Android Chrome.
- The modal follows the Woodbrook theme (paper background, ink text, forest accents) with plain-language entries — the file option reads “Download calendar file (.ics)” — and no third-party branding.
- The modal headline instructs (“Choose where to save this event”) and every entry is phrased as an action (“Save to Google Calendar”), so residents know what each choice does.
- Desktop browsers are offered Google, Outlook, Microsoft 365, and a generic iCal file; iOS Safari is additionally offered the native Apple entry, which hands the event to Calendar.
- Chrome and Firefox on iOS are offered Google, Outlook, and Microsoft 365 only: their Apple/iCal file flow would only show an open-in-Safari warning, so those entries are hidden there.
- Saved events use the event title, summary with a link back to the source, location, and Europe/Dublin start and end times.
- Apple and iCal choices open a static `.ics` file generated at build time for each event, so iOS hands the event to Calendar directly — including in Chrome on iOS, where a generated file would otherwise trigger an open-in-Safari warning.

## Acceptance criteria

- Given a resident opens an event detail page, when the page renders, then an Add to calendar button is visible next to the organiser-details action.
- Given a resident activates Add to calendar, when the calendar options appear, then Google, Outlook, Microsoft 365, and iCal choices are offered, with the native Apple choice added on iOS Safari and both file-based choices hidden in non-Safari browsers on iOS.
- Given an event with a start and end time, when it is saved, then the start and end match the published times in the Europe/Dublin time zone.
- Given an event with no end time, when it is saved, then only the start is set.
- Given a resident uses a narrow mobile viewport, when they open the calendar options, then the choices render as a modal without horizontal overflow.

## Scope

### Included

- Event-to-calendar configuration (title, description, location, Dublin-local times, source link) for published events.
- Static per-event `.ics` files generated during the static build and served from `/ics`, referenced by the calendar configuration.
- Custom Woodbrook button UI that delegates calendar behaviour to the `add-to-calendar-button` library.

### Not included

- Calendar subscriptions, recurring events, reminders, or event submission.
- The previous direct `.ics` file download.
