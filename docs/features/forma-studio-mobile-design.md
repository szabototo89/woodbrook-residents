# Forma Studio mobile design

Status: Available

## Job to be done

As a prospective customer using a phone, comfortably scan Forma Studio's services and work, compare packages and start an enquiry without awkward wrapping or inaccessible navigation.

## Visible behavior

- The mobile hero uses a fluid headline, a full-width project action and a centred secondary work link. The layout stays consistent across narrow and larger phones.
- The café mockup caption appears below the photograph at a readable size, keeping the image unobstructed and its illustrative status clear.
- Service cards place their icon beside the heading and keep the description and disclosure underneath, reducing unnecessary scrolling while preserving readable text and touch targets.
- On short landscape screens, the open menu fits the available height and scrolls internally. Its close control remains reachable.
- Escape dismisses an open menu and restores focus to its control even when a touch interaction leaves keyboard focus outside the header.
- The journal headline scales with phone width; guides expand and the project action returns to contact.

## Acceptance criteria

- At 320, 360, 375, 390 and 430 CSS pixels, the project action fills its row and the work action is centred beneath it.
- Service headings and icons share a row, and service disclosures remain operable.
- Visible headings, paragraphs and controls fit the phone viewport without clipped horizontal content.
- Package actions reach contact; the approved email address and email action remain visible and usable.
- A 640 × 320 landscape menu stays within the viewport, allows its final link to be reached, and keeps the close control visible.
- Both mobile Chromium and WebKit pass navigation, disclosure, contact, keyboard and journal checks.
- Desktop behavior and layout remain verified by the existing browser suite.
- Component coverage stays above 90%; full repository hooks and `bun run build` pass.
- High-resolution desktop, mobile, narrow phone and landscape captures are visually inspected.

## Explicit scope

Responsive layout polish and menu dismissal for the existing home page and journal. No new services, pricing, content claims, enquiry backend, deployment or analytics. Browser checks use emulated viewports; they do not claim physical-device testing.

## Verification

Verified on 2026-10-11:

- 20 component/configuration tests pass, with 100% statements, branches, functions and lines.
- 41 browser tests pass across desktop Chromium, mobile Chromium and mobile WebKit. The seven phone-only cases intentionally skip the desktop project.
- Phone widths 320, 360, 375, 390 and 430px and a 640 × 320 landscape screen pass containment, actions, service alignment, navigation and enquiry checks.
- Repository-wide `bun run build` passes. App TypeScript and ESLint checks pass.
- Homepage Lighthouse performance is 100 desktop and 92 mobile; journal performance is 100 desktop and 98 mobile. Accessibility, best practices and SEO are 100 for both pages in both modes.
- High-resolution captures were inspected at desktop 1440 × 1000 (2×), WebKit phone 390 × 844 (3×) and Chromium phone 320 × 640 (3×), including services, contact, journal and landscape navigation. The existing café image remains labelled as illustrative.
- The 390px phone's first service card reduces from about 294px to 232px high while maintaining 16px body copy and a 44px disclosure target. The 320px hero reduces from about 711px to 638px. These describe the checked fixtures, not guaranteed dimensions for future copy.

The phone layout, landscape menu and out-of-header Escape tests were observed failing before the corresponding fixes. Mobile WebKit is now included in the app's regular Playwright suite. WebKit's keyboard traversal is tested using Option/Alt+Tab, matching its link-focus behavior ([WebKit documentation](https://bugs.webkit.org/show_bug.cgi?id=199671), accessed 2026-10-11).
