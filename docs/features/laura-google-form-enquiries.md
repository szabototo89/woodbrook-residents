# Laura Google Form enquiries

Status: Available

## Job to be done

As a visitor interested in Laura’s artwork or services, I want to send an enquiry from the contact page on my phone or computer without leaving the contact page or opening an email app.

## Visible behavior

- The published Google Form matches the contact page: Your Name, Your Email, Phone (optional), Service Interested In, and Your Message. Only Phone is optional; Message accepts multiple lines.
- Service choices match the published Sanity titles: Commissioned Paintings, Murals (Indoor & Outdoor), Signage, Facepainting, Art Tutoring, and Other / not sure yet.
- Send Enquiry validates required fields and email format, then submits in the background. No navigation, popup, embedded result page or provider-specific explanation appears.
- The button shows Sending… while the request is pending. The page then shows “Your enquiry has been submitted. Thank you for getting in touch.” Entered details remain filled.
- Repeat clicks are prevented while sending and after submission; editing a field enables another enquiry. A network error or timeout preserves the enquiry and offers retry and direct email. No automatic retry is performed.
- Existing responsive layout, service preselection, keyboard access and live status announcements remain available.

## Acceptance criteria

- Correctly encoded field mappings preserve names, email, optional phone, published service titles, Unicode, punctuation and multiline messages in Google Form responses.
- Browser required/email validation and whitespace checks prevent incomplete enquiries. Existing field length limits remain enforced on the contact page.
- A background POST sends the verified field mapping without opening another tab or changing the contact-page URL. Pending requests prevent repeated clicks. Network failure leaves fields intact and allows a retry.
- Submission uses POST; private enquiry details are not encoded in the URL. No Google account, OAuth token, client secret or response-reading API is exposed by the website.
- Desktop and mobile Safari submission and 320–1440px layouts pass focused checks. A labelled live browser submission is independently verified through Google Workspace CLI.
- Root build and production static build pass. No Cloudflare function or website enquiry endpoint is required.

## Scope and operation

`EnquiryForm` prevents native form navigation, validates and reads the current fields at submit time, then calls `sendGoogleFormEnquiry`. This helper posts URL-encoded `entry` values directly using `fetch` with `mode: no-cors`, `credentials: omit` and a 15-second timeout. No API or Cloudflare function is deployed.

Google’s Forms REST API supports reading responses but has no response-creation method. The website submits through the public form’s native `formResponse` endpoint. Browser `fetch` with `no-cors` produces an opaque response whose status and body cannot be inspected. The inline message indicates the request was submitted; it cannot guarantee that Google accepted or stored it. Network errors can be detected, but validation errors, a closed form or a returned login page cannot be distinguished from a recorded response by the browser. The user explicitly requested removing provider copy and the external result page on 2026-10-02. This submission interface must be rechecked if Google changes it or the form questions are replaced. Keep future CMS service-title changes aligned with the Google Form choices.

Google Workspace CLI was used to edit, publish and independently verify the form. No response notification subscription, response spreadsheet, attachment upload, backend or new delivery-time promise is added.

User-supplied form, accessed 2026-10-02: https://docs.google.com/forms/d/1jmb2B-9rfVqJu1D4TeQIiPoI1IY3tffe3ub38hO_oV4/edit

Published form: https://docs.google.com/forms/d/e/1FAIpQLSdzi1qQfNPhVfYByQIrMl4_bv_nogGTDtO_9iYfjfFo7kRtyg/viewform

Technical references, accessed 2026-10-02:

- https://developers.google.com/workspace/forms/api/reference/rest
- https://developer.mozilla.org/en-US/docs/Web/API/Response/type

## Verification

On 2026-10-02, the actual contact-page Send button recorded `TEST — Direct browser submission` with `client-only-test@example.com`, optional phone, Other / not sure yet and a multiline Unicode message explicitly marked TEST ONLY. Google displayed “Your response has been recorded”; Google Workspace CLI independently verified the answers.

Five synthetic example.com responses remain from verification: two explicitly labelled TEST entries and three Jo / jo@example.com entries created by checks against an earlier build. Routine browser tests now intercept Google submissions and do not write real responses.

Earlier verification: all 55 Laura unit tests, 13 focused contact/mobile browser checks, the full repository `bun run build`, and the static production build passed. Responsive checks cover 320, 390, 640, 768, 935 and 1440px.

Inline submission verification on 2026-10-02: all 57 Laura unit tests and 13 focused contact/mobile checks passed, including a single background POST, pending-button disabling, no provider copy, no new tabs, unchanged URL, retained fields and network-error retry. The full repository build and production static build passed. The inline status preview was visually checked using the browser-test screenshot.
