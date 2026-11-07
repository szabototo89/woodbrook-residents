# Laura desktop page margins

Status: Available

## Job to be done

As a desktop visitor moving between About, Services and Contact, I want the content edges to stay aligned so the site feels consistent.

## Visible behavior

Above 900px, Services and Contact use About’s shared container: the viewport width minus 48px, capped at 1280px and centred. This applies to the header, hero copy, service list, enquiry panels, process, contact band and footer. Decorative hero artwork still reaches the right viewport edge.

## Acceptance criteria

- At 1024px, 1440px and 2048px, every Services and Contact container has the same left edge and width as About’s hero container.
- Both page titles share the same left edge as About’s content container.
- Neither page causes horizontal overflow at those widths.
- Existing phone and tablet margin rules and contact interactions remain usable.

## Scope

This is a desktop layout correction in `apps/laura-faichney-web`. No content, CMS schema or enquiry-submission behavior changes. See `docs/handoffs/laura-desktop-page-margins/index.mdx` for checks and screenshots.
