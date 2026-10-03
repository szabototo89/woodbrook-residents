# Laura homepage announcement

Status: Available

## Job to be done

When Laura has an update to share, she can highlight it on her homepage so visitors notice it and can follow an optional next step.

## Visible behavior

- A single optional announcement sits directly below the site header and above the artwork-led hero, so visitors see the update first.
- The card uses the existing cream and blush palette, gold accent, navy serif heading, and pink action button. It shares the homepage container alignment.
- It shows “From the studio”, an editor-supplied heading and message, and an optional button. Message line breaks are preserved.
- On phones, the message and button stack with readable text and a minimum 44px tap target. On wider screens, the action sits beside the message.
- In Laura’s Sanity Studio, open **Home → Homepage announcement**. Fill in the heading and message, optionally add button text and a site path or HTTP(S) address, and enable **Show announcement**.
- An unset or disabled announcement renders no section or extra spacing. Turning it off retains the editor’s text.
- Studio validation requires a heading and message for enabled announcements and both text and destination for an added button. The website validates enabled content before building.
- Publish the Home document, then rebuild and deploy the website to show or hide the announcement, following the existing content workflow.

## Acceptance criteria

- An enabled announcement appears below the header and before the hero, with an accessible section name and a level-two heading.
- An announcement without a button remains a complete informational section.
- Existing Home documents without the new field build successfully and retain their layout.
- A disabled announcement with unfinished content is ignored; an enabled announcement with missing required content fails validation.
- Internal paths and HTTP(S) links work; script URLs and protocol-relative destinations are rejected.
- At 320, 390, 640, 700, 900 and 1440px, the card and text stay within the viewport and do not overlap adjacent sections.
- The optional action works with the keyboard and without JavaScript.

## Scope

Included: one optional field on the existing Home singleton, build-time mapping, responsive homepage presentation, and test-only sample content.

Excluded: seeded production announcements, multiple notices, scheduling or expiry, dismissal controls, popups, a news archive, automatic publishing, and changes to other pages.
