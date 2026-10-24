# Featured story on News

Status: Available

## Job to be done

When I browse News, I want to see the editor's most recent featured story before the other articles, so I can identify the selected local news quickly.

## Visible behavior

- With All categories and Newest first selected, `/updates` shows the same forest-green Featured news card as the homepage, followed by a Latest news heading and the remaining article grid.
- Both pages select the most recently published eligible featured article. Editing a story does not change its priority; its publication date decides.
- Other marked stories remain ordinary cards in publication order. The selected story appears once per page.
- The shared rule excludes expired and future-dated features. If there is no eligible feature, News shows its existing chronological grid.
- A featured article can be selected at any age. News now loads all published articles for [category filtering and date sorting](news-filtering-sorting.md); changed selections include the feature once in the ordinary results.
- The featured card retains its category, publication date, summary, source, optional editorial image and one keyboard-accessible detail link.
- No additional Sanity switch is needed. The existing Feature on homepage control now describes its effect on both pages.

## Acceptance criteria

- Given several featured articles, both pages select the newest by publication date, independent of input order.
- Given an expired selection, the next eligible pick wins; if none exists, the ordinary grid returns.
- Given a featured story in the default view, it is absent from the Latest news grid and other articles remain newest first.
- Given only one featured story, no empty-state message or redundant Latest news heading appears.
- Given a 320–1440px viewport, headlines and metadata remain visible without horizontal overflow.
- Keyboard focus outlines the featured card; Enter opens its existing detail URL. The featured headline is an h2 on News and an h3 within the homepage news section.

## Scope

Included: shared selection, a separate featured article in the News loader response, shared news-domain card, responsive listing layout, regression tests and visual evidence.

Excluded: live content edits, publishing schedules, pagination, multiple feature slots, and changes to article detail pages. The existing optional expiry and static rebuild requirements remain in effect. Equal publication dates retain source order.
