# Forma Studio card consistency

Status: Available

## Job to be done

As a visitor browsing Forma Studio on any screen size, see cards and panels with consistent spacing so sections feel like one coherent site rather than loosely related boxes.

## Visible behavior

- A reusable `Card` component (`apps/forma-studio-web/src/components/Card.tsx`) provides three surfaces — `panel` (sage outer sections), `white` (inner cards on sage), and `muted` (cards on white) — with two padding sizes: `lg` for outer panels (40px desktop / 32px tablet / 28px 20px phones) and `md` for inner cards (28px desktop / 24px smaller screens), plus `none` for image-led cards.
- The homepage (services, work showcase, packages, project preparation, FAQ, contact) and the journal (guide cards, contact panel) all render through `Card`, so sibling cards share the same padding at every breakpoint.
- The popular package keeps exactly the same padding as its siblings: its emphasis uses an outline ring instead of a thicker border, so the badge no longer shifts the card's content by a pixel.
- Panel backgrounds, borders, and corner radii are normalised: outer panels use the shared sage panel with a 16px radius, inner white cards share one border and a 14px radius, and cards on white share one muted surface.

## Acceptance criteria

- `Card` unit tests cover the three variants, default padding, custom class merging, and identical popular/regular padding.
- Existing homepage, journal, and configuration unit tests pass with 100% statement/branch/function/line coverage of the Forma Studio web app.
- TypeScript, ESLint, Prettier, the production app build, and all desktop/mobile Playwright browser tests pass.
- Desktop (1440px) and mobile (390px) screenshots of the work/packages region were inspected for even spacing.

## Explicit scope

- Covers spacing, surface, border, and radius consistency for existing cards and panels. Copy, pricing, enquiry flow, and page structure are unchanged.
- Does not introduce a design system beyond the single `Card` component; future card-like UI should reuse it rather than add new card styles.

## Verification

Verified on 2026-10-11:

- 24 unit/configuration tests pass (including 3 new `Card` tests); coverage is 100% across statements, branches, functions, and lines.
- TypeScript, ESLint, Prettier, and the production app build pass.
- 11 desktop, 18 mobile (Chromium), and 18 mobile-safari Playwright tests pass with no horizontal overflow.
- Desktop and mobile screenshots of the packages region inspected; outer panels and inner cards now share uniform padding and the popular card aligns with its siblings.
