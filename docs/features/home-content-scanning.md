# Homepage news and project scanning

Status: Available

## Job to be done

When I scan local news and community projects, I want to distinguish items by their headline, topic, date and progress, so I can quickly choose the detail page that matters to me.

## Visible behavior

- News and project rows without an editorial image start with their text. They do not reserve space for a repeated document or hammer icon.
- Published images and their supplied alternative text remain supported. The interface does not invent photographs or infer imagery from words in a headline.
- Project rows show their published category and a separate, explicitly labelled progress badge.
- News rows show their category, publication date and source. Publication dates remain visible on phones.
- Headlines wrap in full; summaries remain short previews. The three selected news items remain available on mobile as well as desktop.
- Each row has one detail link. Its target covers the row, including the trailing chevron, with a visible row outline on keyboard focus and a subtle hover background.

## Acceptance criteria

- Given an item without an image, its headline starts at the row's left edge with no empty media column or repeated placeholder graphic.
- Given a published image, its URL and alternative text are preserved.
- Given a project, its category and progress are both readable without interpreting an icon or colour.
- Given a news item, its publication date remains visible at 320, 390, 768, 1024 and 1440 CSS pixels.
- Given a long headline, the full headline wraps rather than being visually truncated.
- Given keyboard focus on an item's only link, the row displays a focus outline. Clicking the row's chevron opens that same detail URL.
- Given a phone viewport, all three selected news items are available and neither panel overflows horizontally.

## Research and diagnosis

Reviewed 22 October 2026. These are design recommendations from published research and public design systems, not results of a resident usability study.

| Finding                                                                                                                                        | Evidence                                                                                             | Application                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Identical icons provide no distinction between unrelated subjects. Similarity can imply a relationship and slow identification of differences. | [NN/g: Similarity Principle in Visual Design](https://www.nngroup.com/articles/gestalt-similarity/)  | Remove the repeated hammer and document tiles rather than swapping in arbitrary pictures.                               |
| Icon meaning depends on experience; labels improve comprehension.                                                                              | [NN/g: Icon Usability](https://www.nngroup.com/articles/icon-usability/)                             | Use the existing published project category as visible text. Do not guess categories from titles.                       |
| Readers scan headings to find relevant content.                                                                                                | [NN/g: Text Scanning Patterns](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/) | Reclaim headline width and remove headline line clamping. Keep the established typography and consistent alignment.     |
| Public services should use images for a clear user need, avoid generic stock photography, and avoid one icon representing several meanings.    | [GOV.UK: Images](https://design-system.service.gov.uk/styles/images/)                                | Use the editorial image when present and a deliberate text layout otherwise.                                            |
| Card elements are optional; headings and summaries can suffice. Navigation cards should have one destination without nested controls.          | [Scottish Government: Card](https://designsystem.gov.scot/components/card)                           | Keep one native link per row and extend its pointer target across the row.                                              |
| Redundant imagery can add audible clutter.                                                                                                     | [W3C: Decorative Images](https://www.w3.org/WAI/tutorials/images/decorative/)                        | Remove redundant media; keep the navigation chevron hidden from assistive technology. Preserve supplied photo alt text. |
| Keyboard users need a visible indication of focus.                                                                                             | [W3C: Understanding Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)   | Display a visible outline around the focused row.                                                                       |

The supplied screenshots also show clipped summaries and long project titles. Summaries remain previews, while full headlines, explicit categories and dates provide the identifying information before a resident opens an item. Both panels retain the site's existing visual language.

## Scope

Included: homepage news and project rows, responsive layout, pointer and keyboard navigation, regression tests and desktop/mobile review screenshots.

Excluded: changing editorial facts, publication order, CMS schemas, listing/detail-page redesigns, stock or generated imagery, and claims of measured usability improvement. Separate stories may legitimately share a category; categories do not claim that each story has a unique subject.

## Verification

- TDD: the added component regression failed against the repeated fallback icons, then passed after implementation.
- Web unit suite: 357 tests passed, with per-file coverage thresholds satisfied.
- Playwright: 20 homepage panel, desktop and mobile layout tests passed, including row navigation, visible focus, dates, categories, full headings and layouts at 320–1440 CSS pixels.
- Web TypeScript and focused ESLint checks passed.
- `bun run build` passed.
- Desktop (1440 CSS pixels) and mobile (390 CSS pixels) section screenshots were captured at 2× resolution and visually inspected. Screenshots use the existing source-linked test fixtures with photos removed to represent the reported no-photo state; they are sample previews rather than current live news.
