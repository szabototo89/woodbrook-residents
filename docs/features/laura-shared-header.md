# Laura shared header

Status: Available

## Job to be done

As someone browsing Laura’s work, I want the same logo and top menu on every page so navigation feels consistent.

## Visible behavior

- Every page uses one `SiteHeader` component in the root layout.
- Desktop headers use a 220px logo and an 82px header, matching About. Menu spacing, margins and the Get in Touch button stay in the same positions across pages.
- Tablet headers use a 175px logo and compact menu spacing. Phones use a 180px logo, a 69px header and a menu button.
- The active link is underlined. Collection pages keep Gallery active. On phones, Escape closes the menu and returns focus to its button; choosing a link closes the menu.

## Acceptance criteria

- Header, logo, navigation and contact-button bounds match About on all five pages at 320, 390, 640, 641, 768, 900, 1024, 1440 and 2048px.
- The menu fits within the viewport, including immediately above the phone breakpoint.
- The phone menu opens, closes with Escape, follows the selected page and exposes the active link.
- The shared styles are included in development and in the inline production stylesheet, without browser-only loading.

## Scope

`apps/laura-faichney-web/src/components/SiteHeader.tsx` owns the menu markup and behavior. `SiteHeader.css` owns its layout and responsive styles. Page styles do not override the header. Page content, footer styling, CMS data and enquiry behavior retain their existing responsibilities.
