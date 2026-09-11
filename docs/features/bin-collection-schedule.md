# Bin collection schedule

Status: Available

## Job to be done

When I need to put out my bins, I want to see the next dates on the local hub and check the provider's original calendar, so I can prepare the correct bins without searching through old messages or files.

## User-visible behavior

- A Thorntons 2026 bin collection entry appears under the Waste category in Local information.
- The service page shows the next recycling date and the next waste and compost date in Dublin local time.
- Static page HTML includes those next dates without requiring client-side
  JavaScript to calculate them after the page loads.
- Residents can view the original schedule in a new tab or download the PDF.
- The page states that the calendar is only for Thorntons customers who received it and advises residents to confirm that it matches their address because routes can differ.
- When all listed dates have passed, the page directs residents to Thorntons for a current schedule rather than presenting an expired date as upcoming.
- The entry identifies the source and the date on which it was checked.

## Acceptance criteria

- Given the 2026 schedule is published, when a resident searches Local information for “bin collection” or selects Waste, then the Thorntons schedule entry is available.
- Given at least one future collection exists for each stream, when the schedule page opens, then the next recycling and waste and compost dates are visibly labelled.
- Given a collection is scheduled for the current Dublin date, when the schedule page opens, then that date is treated as the next collection.
- Given the schedule document is available, when a resident follows either PDF action, then they can view or download the original file.
- Given no collection dates remain, when the page opens, then it says that no remaining 2026 dates are listed and links residents to the provider website.
- Given a resident reads the entry, then its route limitation, source, and review date are visible.

## Scope

### Included

- The supplied Thorntons 2026 recycling and waste/compost dates.
- Google Sheets builds read the comma-separated ISO dates from the
  `recycling_dates` and `waste_compost_dates` Local_Info columns, together with
  the supporting `document_url` and `document_label` fields.
- An accessible, mobile-friendly summary of the next collections.
- The original PDF as a supporting download.

### Not included

- A claim that the schedule applies to every Woodbrook household.
- Notifications, reminders, route lookup, account integration, or schedules for other waste providers.
