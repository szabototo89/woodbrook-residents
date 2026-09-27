# Add to calendar

Status: Available

## Job to be done

When I find a Woodbrook event I want to attend, I want to save it to my own calendar app, so I do not have to remember the details.

## User-visible behavior

- Each event detail page shows an Add to calendar button styled like the other event actions.
- Activating the button opens a calendar-choice list rather than downloading a file directly.
- The choice list opens as a modal, which keeps it usable on narrow mobile viewports including iOS Safari and Android Chrome.
- Desktop browsers are offered Google, Outlook, Microsoft 365, and a generic iCal file; iOS is additionally offered the native Apple entry, which hands the event to Calendar.
- Saved events use the event title, summary with a link back to the source, location, and Europe/Dublin start and end times.

## Acceptance criteria

- Given a resident opens an event detail page, when the page renders, then an Add to calendar button is visible next to the organiser-details action.
- Given a resident activates Add to calendar, when the calendar options appear, then Google, Outlook, Microsoft 365, and iCal choices are offered, with the native Apple choice added on iOS.
- Given an event with a start and end time, when it is saved, then the start and end match the published times in the Europe/Dublin time zone.
- Given an event with no end time, when it is saved, then only the start is set.
- Given a resident uses a narrow mobile viewport, when they open the calendar options, then the choices render as a modal without horizontal overflow.

## Scope

### Included

- Event-to-calendar configuration (title, description, location, Dublin-local times, source link) for published events.
- Custom Woodbrook button UI that delegates calendar behaviour to the `add-to-calendar-button` library.

### Not included

- Calendar subscriptions, recurring events, reminders, or event submission.
- The previous direct `.ics` file download.
