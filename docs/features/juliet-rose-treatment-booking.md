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
  with a softly overlaid treatment photograph, reassurance cues, category
  descriptions, Lucide icons, and a contact prompt for customers who need help
  choosing.
- The treatment photograph fades into the page before the catalog, while
  mobile headings and reassurance cues stay visually centered and treatment
  prices remain aligned beside comfortable booking touch targets.
- The treatments and booking pages reuse the same typed editorial header
  component with page-specific copy and script text. Treatment highlights stay
  in the catalog introduction, while booking reassurance closes the form.
- Each treatment has a booking action that carries the selected service into
  the appointment journey.
- The booking page lets a customer choose a treatment, weekday, preferred time,
  and provide their name, email, phone number, and optional notes.
- The booking journey follows the supplied Juliet Rose visual concept with a
  softly overlaid studio photograph, numbered steps, a spacious calendar,
  balanced time choices, clear field prompts, and a three-part reassurance
  strip on compact screens.
- On desktop, the booking journey becomes a two-column composition: bordered
  form cards and supporting imagery sit beside a persistent summary of the
  selected treatment, duration, price, date, and time. The summary also makes
  the request-and-confirmation process explicit.
- The desktop date card includes an availability key and a contact prompt,
  while the time choices use four balanced columns and the details action sits
  beside the contact acknowledgement.
- At compact widths, the desktop summary and editorial panels collapse away;
  the journey retains its focused phone layout, three-column time choices, and
  reassurance strip without horizontal overflow.
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
- At compact widths, step numbers remain beside their headings, email and phone
  share a practical row where space allows, and the time options retain three
  equal columns.
- At desktop widths, the form and summary remain side by side, every form step
  is presented as a bordered card, and the summary updates from the same
  treatment, date, and time state used for submission.
- Treatment booking actions provide at least a 44-pixel touch target on phone
  layouts.
- The Treatments navigation item exposes its current-page state on the
  treatment catalog route.

## Scope

This capability uses a local JSON treatment catalog and a local booking adapter.
It does not connect to live availability, take payment, send notifications, or
create an appointment in an external booking provider.
