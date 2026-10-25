# Forma Studio approved copy

Status: Available

## Job to be done

As a prospective customer, read only approved business copy on `/` and `/blog`, so that a preview notice or unresolved placeholder never looks like the studio's real offer.

## Visible behavior

- Neither footer shows the removed statement "Forma Studio · Websites for local businesses". The homepage footer shows the approved service summary "Web design · Local SEO · Ongoing support"; the journal footer shows only "Back to Forma Studio home".
- The Site settings editor no longer offers a footer statement, so the removed copy cannot be reintroduced through the editor.
- Navigation, package actions and both email actions keep their destinations. Email actions still use the approved address from the contact configuration, with the project subject and editable brief.
- Metadata on both routes, the hero mockup caption and every guide source and check date are unchanged.

## Copy review

Reviewed on 2026-10-25 against the prerendered output of `/` and `/blog`, shared navigation, both footers and page metadata.

| Surface                | Item                                                     | Disposition                                                                                                                |
| ---------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Both footers           | "Forma Studio · Websites for local businesses"           | Removed from the page, the schema, the migration seed and the published site settings.                                     |
| Both pages             | "Design preview · Contact address to be confirmed"       | Not reproducible: absent from source, built HTML and production. Last recorded in the retired `apps/locale-web` app.       |
| Homepage footer        | "Web design · Local SEO · Ongoing support"               | Retained: it summarises the five published services and makes no claim.                                                    |
| Shared navigation      | Services, Work, How we work, Blog, Contact, Let's talk   | Retained: every destination resolves on both routes.                                                                       |
| Homepage hero          | Note and caption, including the illustrative café mockup | Retained: the caption discloses the mockup and credits Laura Faichney's live website.                                      |
| Homepage offer         | Services, packages, process, preparation, FAQs, contact  | Retained: unchanged published copy; the package section still qualifies scope, hosting and ongoing costs in a final quote. |
| Journal guides         | Three guides with sources, check dates and images        | Retained: each guide carries an HTTPS source and its 2026-10-03 check date.                                                |
| Journal guide metadata | Internal `editorialStatus: needs-review` marker          | Retained: the marker is not rendered and does not control publication; source dates are the visible evidence.              |
| Both pages, metadata   | Titles and descriptions                                  | Retained: no preview wording, placeholders or unresolved addresses.                                                        |
| Both pages, email      | `szabototo89@gmail.com` and prefilled brief              | Retained: approved address from the contact configuration; the links remain `mailto:` actions.                             |

The review found no other preview notice, unresolved placeholder or unapproved draft item in the public output. Business approval of prices, service scope and FAQ commitments remains a content-owner action and is not changed here.

## Acceptance criteria

- Given a production build, when `dist/client/index.html` and `dist/client/blog/index.html` are inspected, then neither reported line appears.
- Given the homepage or journal renders, then the footer keeps its approved copy and no preview notice.
- Given a visitor uses the shared navigation, then every link reaches an existing section or `/blog`.
- Given a visitor chooses an email action, then it opens the approved address with a subject and brief.
- Given stored site settings still contain the removed statement, then validation drops it instead of rendering it.
- Given the repository runs its checks, then unit tests, browser tests and `bun run build` pass.

## Explicit scope

Removal of the reported footer statement, the recorded copy review and the regression coverage. Sanity integration and Zod enforcement remain in [#3](https://github.com/szabototo89/woodbrook-residents/issues/3). New services, new prices, a visual redesign and enquiry services are excluded. No missing business detail is invented; the remaining copy is retained as published.
