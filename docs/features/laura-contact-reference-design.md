# Laura contact reference design

Status: Available

## Job to be done

As someone considering a painting, mural, sign or creative event, I want to explain my idea to Laura, understand what information helps, and start an enquiry from my phone or computer.

## Visible behavior

- `/contact` follows the supplied reference’s cream paper, navy headings, pink actions, gold underlines, floral paintbrush hero, softly framed enquiry panels, service cards, three-step process and navy contact band.
- The hero presents published phone and email links alongside the location wording supplied in the reference. Start a Project scrolls to the enquiry form and focuses the name field.
- Send a Message collects name, email, optional phone, service and message. Required fields and email format are validated, including names and messages containing only whitespace.
- Services and contact details come from Sanity. Existing service enquiry URLs preselect their published service. Unrecognised service values leave the selection empty; visitors can choose Other / not sure yet.
- Send Enquiry opens a populated email draft addressed to the published contact email. The page explains this before submission and announces that the visitor must send the email in their email app. Fields remain filled and an Open email draft link is available afterward. No delivery confirmation is claimed.
- What to Include suggests service, size, timeframe, venue and inspiration. No unverified response-time promise is added.
- Three illustrated cards group commissioned paintings, murals/signage, and facepainting/art tutoring, using published descriptions and images. Cards select a representative service in the form; Explore all creative services opens the full services page.
- Desktop enquiry panels sit side by side; at 768px and below they stack. Phones use a compact hero image, single-column fields, a full-width submit button, stacked cards and ordered process steps.

## Acceptance criteria

- One primary heading introduces the page; Send a Message, What to Include, Ways I Can Help and How It Works follow in reading order.
- The page has no horizontal overflow at 320, 390, 640, 768, 935 and 1440px. Form controls use at least 16px text and 44px touch areas; mobile body copy remains readable.
- Labels, autocomplete, email and telephone input types, required indicators, native validation, visible keyboard focus and a live status region support accessible enquiries.
- Phone and email actions use published settings. Complete enquiries preserve names, reply addresses, optional phone numbers, selected service names and multiline messages in safely encoded email drafts.
- The new hero is a transparent local asset with responsive WebP variants; decoration never blocks controls or obscures content.
- Focused unit/browser checks, desktop/mobile visual inspection, and `bun run build` pass before this capability is marked Available.

## Scope and sources

This change targets `/contact` in `apps/laura-faichney-web`. Shared components are reused, with contact-specific styling. No CMS schema, enquiry backend, storage, attachment upload, analytics or delivery service is introduced. Existing footer social placeholders retain their previous behavior.

Design and Dublin/Ireland location wording: user-supplied `clipboard-2026-10-02-132844-B3A91A77.png` (Image #1), accessed 2026-10-02. Published contact and service content: the existing Sanity content loaded by the app. Hero artwork is an illustrative generated asset, not a verified Laura commission; its prompt and provenance are recorded in `apps/laura-faichney-web/ASSETS.md`.

## Verification

Verified on 2026-10-02: all 53 Laura unit tests and 40 focused contact, mobile Safari, services and responsive browser checks passed. The responsive checks cover viewport bounds up to 1440px, including 700px and 900px tablet widths, 44px tap areas, 16px phone copy, required/email/whitespace validation, correcting invalid entries, service preselection, encoded email drafts and keyboard/touch form access. Final 935px desktop and 320px/390px phone renders were visually inspected. `bun run build` passed for the whole repository, including formatting, lint and type checks.
