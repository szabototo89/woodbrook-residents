# Juliet Rose treatment browsing and booking

Status: Available

## Job to be done

When a Juliet Rose customer is ready to choose a service, they can compare the
current treatment list and request a suitable appointment without leaving the
website.

## Visible behavior

- The treatments page groups the current Juliet Rose services and shows each
  treatment's duration and price.
- The treatments page presents the services in a responsive editorial layout
  with reassurance cues, category descriptions, Lucide icons, and a contact
  prompt for customers who need help choosing.
- Each treatment has a booking action that carries the selected service into
  the appointment journey.
- The booking page lets a customer choose a treatment, weekday, preferred time,
  and provide their name, email, phone number, and optional notes.
- The final step clearly describes the booking as a request until Juliet Rose
  confirms it.
- Treatment content is stored in a local JSON catalog with its source URL and
  access date.

## Acceptance criteria

- Treatment names, durations, prices, contact details, hours, and policies come
  from `https://www.julietrosebeauty.com/`.
- The booking workflow uses `@tanstack/react-form` for customer details,
  `react-day-picker` for date selection, and `date-fns` for date logic.
- The booking UI depends on a provider-neutral interface that can later be
  implemented by Square or another appointment provider.
- Weekends and past dates cannot be selected, and preferred time choices fit
  within the published Monday-to-Friday opening hours.
- The treatment and booking pages work at mobile and desktop widths and expose
  labels, roles, visible copy, URLs, and submitted outcomes to assistive
  technology and automated tests.
- The Treatments navigation item exposes its current-page state on the
  treatment catalog route.

## Scope

This capability uses a local JSON treatment catalog and a local booking adapter.
It does not connect to live availability, take payment, send notifications, or
create an appointment in an external booking provider.
