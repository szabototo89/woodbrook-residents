# Featured homepage news

Status: Available

## Job to be done

When I visit Woodbrook, I want to see the editor's selected local story immediately, so I can understand its headline, date and source before opening it.

## Visible behavior

- Editors open an Update in Sanity Studio, enable **Feature on homepage**, optionally set **Feature until**, and publish.
- The newest eligible featured article occupies a forest-green card inside What’s new in Woodbrook. It shows a Featured news label, category, publication date, full headline, summary, source and Read the story cue.
- The article has one native headline link. Its pointer target covers the card and its keyboard focus has a visible outline.
- Supplied photos and alternative text remain supported. No-photo articles use the full card width for text.
- Two newest other stories appear under More local news. Without an eligible feature, the original three newest stories appear.
- If several articles are selected, publication date decides the winner. Equal dates retain source order.
- A future publication date is ineligible for featuring. At the expiry instant the article stops being eligible; it remains published on News and its detail URL.
- The News page also leads with the selected feature; its remaining article grid stays newest first. See [Featured story on News](./featured-news-listing.md).

## Acceptance criteria

- A feature outside the newest three articles can still reach the homepage.
- The selected feature appears once, with up to two other stories. With no eligible feature, up to three ordinary stories appear.
- Expiry excludes the exact end instant. A remaining eligible pick takes over; otherwise the ordinary latest-news layout returns.
- Metadata and full headlines remain readable without horizontal scrolling at 320, 390, 768, 1024 and 1440 CSS pixels.
- Keyboard users can focus the single story link and use Enter to open its existing `/updates/<slug>` URL.
- Empty and unavailable content continue to show their established messages.

## Scope

Included: the existing Sanity Update publishing lifecycle, optional featuredUntil datetime, public validation and mapping, homepage selection and presentation, tests, research and screenshot evidence.

Excluded: changing live editorial data, redesigning article detail pages, multiple featured slots, carousels, a new scheduler, and deployment. Feature selection and expiry use published Sanity records.

## Publishing and compatibility

Existing featured=true values become eligible automatically. Existing missing/false values remain unfeatured; featuredUntil is optional, so no migration is required. Review old selected stories before deploying. Sanity displays expiry in Europe/Dublin and stores a UTC instant.

Runtime page loads evaluate expiry when loading homepage content. Static builds evaluate it at build time and require a rebuild to change the selected story. An already-open page does not rotate or refresh the feature automatically.

## Research

The [design research](../handoffs/featured-homepage-news/design-research.md) records the source review, alternatives and decisions made before implementation. These are design inferences, not findings from resident usability testing.
