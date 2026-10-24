# News filtering and sorting

Status: Available

## Job to be done

When I browse News, I want to narrow articles by category and change their publication order, so I can find relevant stories and older information.

## Visible behavior

- `/updates` has labelled Category and Sort by dropdowns. Categories use the existing article taxonomy.
- All categories and Newest first are the defaults. This view retains the existing featured story above the remaining newest-first grid.
- Selecting a category or Oldest first displays matching articles in publication order, including the featured article once as an ordinary card.
- Category and sort selections appear in the URL. Reloads, shared URLs and browser Back/Forward restore both controls and results.
- A live article count reflects the visible results. An empty category shows No matching news with guidance and a Reset filters button.
- Reset filters restores both defaults. Invalid URL values safely fall back to those defaults.
- All published articles participate, including articles beyond the previous 25-item limit. Homepage selection is unchanged.
- Native dropdowns support keyboard input and stack on narrow screens.

## Acceptance criteria

- Transport shows only transport articles; Planning includes the featured planning article once.
- Oldest first orders all articles from oldest to newest by publication instant. Equal timestamps retain source order.
- Changing category preserves sort; changing sort preserves category.
- A saved URL restores the selection on runtime pages and after static-page hydration without a markup mismatch.
- An unmatched category shows zero articles, no article cards and a working reset.
- Empty publication and unavailable-content states keep their existing explanations.
- Controls and cards remain usable without horizontal overflow from 320px through 1440px.

## Scope

Included: category filtering, two date orders, validated URL state, full published collection, counts, reset, responsive controls and regression tests.

Excluded: text search within News, pagination, date-range filters, CMS changes, live content edits and production deployment. The existing site-wide search remains available.
