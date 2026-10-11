# Forma Studio customer journey

Status: Available

## Job to be done

As a prospective small-business customer, learn what Forma Studio can help with, see a real example, understand the process and starting packages, and start a useful project conversation.

## Visible behavior

- A concise hero explains web design, local SEO and enquiry tools. Its primary action reaches contact; its secondary action reaches a dedicated work section.
- Each service exposes proposed deliverables through a keyboard-operable disclosure.
- Selected work shows an actual capture of Laura Faichney's website, describes observable capabilities and links to the live site. The separate café hero is labelled as an illustrative mockup.
- Every package offers a named discussion action. Starting prices are qualified by a final scope, hosting and ongoing-cost quote; the highlighted plan makes no popularity claim.
- “How we work” covers scope and quote, design feedback, launch and handover. A preparation panel explains what the visitor can bring.
- Email actions use the user-approved `szabototo89@gmail.com`, with an editable project brief. The address is visible for visitors who prefer to copy it. Nothing is sent automatically.
- Mobile navigation closes on selection and Escape; Escape returns keyboard focus. Text remains readable on tablet and phone layouts, and primary controls have comfortable touch targets.
- The fictional testimonial and redundant “View all FAQs” self-link are removed.

## Acceptance criteria

- Work links reveal a real portfolio section and a working live destination.
- Service details expand and collapse without navigating away.
- Each package leads to the contact panel.
- Email links address the approved inbox and include a project subject and editable brief.
- No fabricated customer praise, ratings, results or popularity claims appear.
- Desktop, tablet and small phone layouts fit the viewport. Service, package and process copy remains at least 14px; the mobile menu target is at least 44px in each dimension.
- FAQ, skip-link, navigation and reduced-motion behavior remain usable.
- Component tests, browser tests, repository quality hooks and `bun run build` pass; feature coverage stays above the existing 90% gate.
- Local production Lighthouse scores meet the existing 90 minimum in all categories for home and journal, desktop and mobile.
- High-resolution desktop and mobile screenshots are captured with Playwright and inspected.

## Explicit scope

Homepage and shared navigation improvements, journal contact consistency, research and truthful portfolio evidence. No deployment, analytics integration, invented studio biography, new pricing, enquiry backend, CMS integration or unverified outcome claims. Existing prices and draft service commitments still need business validation. Email delivery itself is not tested by sending a message.

## Verification

Verified on 2026-10-11:

- 19 component/configuration tests and 18 desktop/mobile Chromium tests pass. Feature and shared chrome coverage is 100% statements, branches, functions and lines (existing gate: 90%).
- The full repository pre-commit hook passes formatting, ESLint, TypeScript, unit, browser and end-to-end checks without bypassing hooks.
- The repository-wide `bun run build` passes.
- Homepage Lighthouse: desktop performance 100; mobile performance 92; accessibility, best practices and SEO 100 on both.
- Journal Lighthouse: desktop performance 100; mobile performance 98; accessibility, best practices and SEO 100 on both.
- Playwright captures at 1440 × 1000 with 2× scale and 390 × 844 with 3× scale include full pages, opening viewports, selected work and contact. Desktop and mobile captures were visually inspected.
- The portfolio destination returned HTTP 200; the actual project hero was captured for the local preview asset. Email destination and prefilled content were verified without sending a message.

Lighthouse results describe the local production preview, not field performance. See [the UX review](../reviews/forma-studio-ux-review.md) for findings, sources and follow-up decisions.

Further phone layout and WebKit verification are documented in [Forma Studio mobile design](forma-studio-mobile-design.md).
