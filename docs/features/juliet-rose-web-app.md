# Juliet Rose web application skeleton

Status: Available

## Job to be done

When developing the Juliet Rose website, start from the approved proposal in a dedicated TanStack Start application with a reliable verification baseline and no unrelated community-platform code.

## Visible behavior

- The homepage implements the Juliet Rose proposal with hero, treatment categories, featured treatments, gift cards, studio details, and booking policy.
- Treatment category and featured treatment cards are full-card booking links whose visible copy provides their accessible names.
- Desktop and mobile navigation expose the same page sections, and the mobile menu reports its open state to assistive technology.
- Booking actions stay in the app, while gift-card actions open the in-app gift-card guide before continuing to the existing Juliet Rose checkout.
- Cormorant Garamond matches the approved proposal across the Juliet Rose wordmark and display headings, while DM Sans keeps body copy and controls warm and direct.
- Headings use warm charcoal, body copy uses a slightly softer charcoal, and burgundy remains reserved for accents and actions.
- Treatment sections use content-sized heading rows and consistent spacing between labels, headings, card grids, and card copy.

## Acceptance criteria

- `apps/juliet-rose-web` runs as an independent TanStack Start app.
- The app contains no resident-hub routes, CMS source adapters, community content, or inherited tracking configuration.
- Product code is divided into shared chrome, page-section components, and simple typed content collections.
- Unit, browser-component, desktop/mobile E2E, metadata, static-build, PageSpeed, Search Console, Lighthouse, formatting, linting, type checking, and production-build infrastructure remain available.
- The repository-level verification and build commands include the Juliet Rose app.

## Scope

This capability provides the homepage proposal and engineering skeleton. It does not add a CMS, treatment-management interface, checkout, authentication, analytics, deployment, or new business claims.
