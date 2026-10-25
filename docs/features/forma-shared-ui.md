# Forma Studio shared UI

Status: Available

## Job to be done

As a visitor, browse the homepage and journal with consistent navigation, actions and disclosure behavior on desktop and mobile. As a maintainer, update repeated presentation in one component without changing the site's design or business content.

## Visible behavior

- Both pages share a skip link, focusable main, responsive header and footer structure.
- Home retains its footer service line; the journal retains its home link.
- Arrow actions retain their visible labels, native link semantics and destinations, including the enquiry email brief.
- Service details and journal guides use native disclosures that can open independently. FAQs remain a feature-specific exclusive accordion.
- Typography, spacing, borders, icon treatments and responsive layouts retain the base design. Existing journal tablet spacing differences remain explicit exceptions.
- No new routes, content fields or cross-application library are introduced.

## Acceptance criteria

- Record every selected pattern, its consumers, typed props, examples and intentional exceptions in [the component guide](../../apps/forma-studio-web/src/components/README.md).
- Home and journal consume shared `SiteLayout`, `SiteFooter`, `ActionLink`, `IconBadge` and `Disclosure`; home services/process and work consume `SectionHeading`.
- Existing `Card` and `SiteHeader` remain shared owners. Remove duplicate Card surfaces/padding where equivalent; preserve recorded tablet exceptions.
- Test native links, heading levels, accessible names, skip-link focus, keyboard disclosures, menu operation and exclusive FAQs.
- Compare both pages before/after at 1440px and 390px; capture 2× Playwright screenshots with no horizontal overflow.
- Pass unit coverage, typecheck, lint, app and repository builds, and relevant Chromium/WebKit browser regressions.
- Supply a temporary Cloudflare preview from the latest PR commit and a separate [handoff](../handoffs/forma-shared-ui/index.mdx).

## Explicit scope

This task standardises repeated UI in Forma Studio only. Content changes in #4 and content contracts from #3 are separate work. No CMS data or validation behavior changes. Merged PR #10 supplies the approved footer contract; this refactor does not restore the removed field.

## Dependency decision

The user chose to wait for issue #4. PR #10 merged at `c31cd3e`; this branch incorporates that main commit and preserves its approved footer behavior.
