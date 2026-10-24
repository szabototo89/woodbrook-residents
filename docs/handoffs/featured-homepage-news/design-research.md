# Featured homepage news: design research

Reviewed 24 October 2026, before implementation. Baseline: `0adcbc9c26e0fbf885a04e42a75ce547ce9e2004`.

## Diagnosis

The supplied screenshot and a Playwright review of the existing homepage show three equally weighted news rows. Category pills identify subjects but do not convey editorial priority. The neighbouring event card has stronger visual contrast. `update.featured` already exists in Sanity, the public type and the source adapter, but the homepage takes only the three newest articles. An older editorial pick can therefore never reach the homepage. The schema description explicitly says the switch does not affect ordinary news lists.

The design must work with long headlines, Irish source names and no photograph. It must preserve the information-first hierarchy, the existing news detail URLs and source attribution. This research is a design review of published guidance, not a resident usability study.

## Evidence and application

All sources below were accessed on **24 October 2026**. The application column records design decisions inferred from the guidance, not measured outcomes for Woodbrook.

| Source                                                                                     | Relevant finding                                                                                                          | Application to Woodbrook                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [NN/g: Visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) | Contrast, scale and grouping establish importance; relying on colour alone is insufficient.                               | One forest-green lead card, a larger serif headline and a visible Featured news label establish priority.                          |
| [NN/g: Homepage principles](https://www.nngroup.com/articles/homepage-design-principles/)  | Concrete content examples help visitors understand a site's offering; dominant promotions can distort that understanding. | Keep the published headline and summary visible. Place the feature within the existing news section, below the shared search hero. |
| [Scottish Government: Cards](https://designsystem.gov.scot/components/card)                | A navigation card has one destination; its heading supplies the link and whole-card target. Images are optional.          | Use one native headline link with an extended pointer target, source/date text and a decorative action cue.                        |
| [GOV.UK: Images](https://design-system.service.gov.uk/styles/images/)                      | Images should answer a real user need; generic stock photos and repeated ambiguous icons are discouraged.                 | Preserve a supplied editorial photo and alt text. Design a complete text-only variant without invented imagery.                    |
| [GOV.UK: Colour](https://design-system.service.gov.uk/styles/colour/)                      | Functional colours should be consistent and text must meet contrast requirements.                                         | Reuse Woodbrook's forest and warm yellow palette, with readable white and pale metadata on a solid background.                     |
| [GOV.UK: Links](https://design-system.service.gov.uk/styles/links/)                        | Inverse links on dark backgrounds need sufficient contrast. Unnecessary new tabs can disorient users.                     | Keep the story link white, underline it on hover/focus and open its existing detail URL in the same tab.                           |
| [W3C: Carousels](https://www.w3.org/WAI/tutorials/carousels/)                              | Accessible carousels need keyboard operation, movement controls and understandable announcements.                         | A static editorial lead meets the brief without rotation or hidden slides. All selected stories remain visible.                    |
| [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                     | Content must remain usable without horizontal scrolling at 320 CSS pixels.                                                | Stack photo and text on phones; wrap metadata and long headings; test 320–1440px.                                                  |
| [W3C: Focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)       | Keyboard users need a persistent indication of the focused control.                                                       | Outline the entire featured card and verify Enter opens the story.                                                                 |
| [Sanity: Boolean](https://www.sanity.io/docs/studio/boolean-type)                          | Adding a boolean field does not populate old documents; missing values need a frontend default.                           | Retain the existing false-default switch and treat only true as selected. Existing true values become eligible.                    |
| [Sanity: Datetime](https://www.sanity.io/docs/studio/datetime-type)                        | Datetimes store an exact UTC instant and can display an editorial time zone.                                              | Add optional featuredUntil on the existing update document, displayed in Europe/Dublin.                                            |
| [Sanity: Validation](https://www.sanity.io/docs/studio/validation)                         | Studio validation does not validate API mutations.                                                                        | Keep runtime parsing in the existing adapter and validate the optional expiry in the shared schema.                                |

## Alternatives considered

| Direction                                    | Benefit                                  | Tradeoff and decision                                                                  |
| -------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- |
| Add a featured pill to an ordinary row       | Small layout change                      | Priority would remain weak beside the event card. Rejected.                            |
| Full-width photo hero above the landing page | Maximum prominence                       | Competes with search, depends on photography and lengthens the first screen. Rejected. |
| Rotating featured carousel                   | Can cycle several picks                  | Adds controls and hides stories. Rejected for this brief.                              |
| One solid-colour lead inside the news panel  | Strong hierarchy with or without a photo | Uses more height than a row. Selected; cap total stories at three.                     |

## Proposed contract before implementation

- Reuse featured and add optional featuredUntil; do not introduce a separate publishing object or duplicate article copy.
- Select the newest eligible published story from the entire snapshot, before the homepage limit. Preserve stable source order for equal dates.
- Exclude future-dated and expired stories from the feature slot. Expiry is exclusive: at that instant the story stops being eligible.
- Show the chosen feature and two newest other stories. Without an eligible feature, show the original three newest stories.
- Keep `/updates` in publication order. Expiring a feature never unpublishes its article.
- Show the full feature headline, summary, category, date, source and a Read the story cue. Retain photo alt text when present.
- Use the existing static build lifecycle: static output evaluates eligibility at build time and needs rebuilding to reflect an expiry. There is no new publishing scheduler.

## Review criteria

Verify selection outside the newest three; multiple selections; expiry boundaries; no selection; source immutability; article links and attribution; text-only and supplied-photo variants; visible keyboard focus; and no overflow at 320, 390, 768, 1024 and 1440 CSS pixels. Capture 2× desktop/mobile screenshots using labelled sample content. These checks cannot establish a measured improvement in resident task completion.
