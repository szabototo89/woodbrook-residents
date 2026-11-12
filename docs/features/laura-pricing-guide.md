# Laura pricing guide

Status: In progress

## Job to be done

When considering creative work, I want to scan indicative prices, scope and quote requirements, so I can budget and send a relevant enquiry.

## Visible behavior

Prices appears after Services in shared navigation and the footer. Services links to `/prices`. The page follows the supplied desktop/mobile references: centred introduction, gold line symbols, paired price lists on desktop, stacked categories on phones, optional artwork strip and pink contact invitation.

The Prices singleton in Laura Studio owns independently named and ordered categories. They do not have to match Services. Each category supports multiple fixed, starting, range or quote-only rows, with adjacent scope, inclusions, qualifications and quote guidance. No rates means an explicit quote message. Optional service references preselect the existing enquiry form; unlinked categories use a general enquiry.

## Acceptance criteria

- Published category names, row order and commercial copy survive static generation and JavaScript-free visits.
- Fixed/from prices require positive amounts, currency and scope; ranges require ordered positive bounds; quote rows require guidance and no numeric fields.
- Missing required page content or malformed pricing aborts fresh builds without using an old snapshot.
- Direct visits, refreshes and enquiry links work with Sanity API endpoints blocked.
- At 320, 390, 640, 900 and 1440 CSS pixels, prices remain readable without horizontal overflow; the first price is visible at 390×844.
- Linked category enquiries select the published service after hydration.

## Scope

Includes Studio editing, build-time validation, metadata, sitemap/static checks, responsive presentation and links into the existing form. Categories own price content because the user explicitly requested grouping independent of Services, superseding issue #35’s original per-service storage proposal.

Excludes checkout, payment, booking, calculators, submission changes and production rate approval. Test/preview prices are illustrative and visibly labelled. Production remains unchanged until the owner supplies approved categories, rates and terms and publishes the required Prices singleton.

Sources: [issue #35](https://github.com/szabototo89/woodbrook-residents/issues/35), user-provided desktop/mobile reference images and category clarification, 12 November 2026.
