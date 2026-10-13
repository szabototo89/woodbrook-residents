# Read-only Markdown updates

Status: Available

## Job to be done

When I open a community update, I want its headings, lists, emphasis, quotes, and links to be formatted, so I can understand the update and follow its sources easily.

## User-visible behavior

- Update detail pages render the existing body string as read-only CommonMark Markdown.
- Headings, paragraphs, bold and italic text, ordered and unordered lists, blockquotes, links, images, and code display with readable article styling on desktop and mobile.
- Plain-text bodies remain readable. Blank lines separate paragraphs, and Markdown hard breaks create explicit line breaks.
- Existing titles, summaries, image credits, source information, reviewed dates, and navigation remain available.
- Embedded HTML is omitted and unsafe link protocols are filtered by the renderer.

## Acceptance criteria

- Given an update body contains Markdown, when a resident opens its detail page, then headings, emphasis, lists, quotes, and links render as semantic content rather than literal Markdown syntax.
- Given a plain-text update body, when it is displayed, then its paragraphs remain readable.
- Given embedded HTML or a JavaScript link, when the body renders, then HTML does not execute and the unsafe URL is not emitted.
- Given a desktop or mobile viewport, when a resident reads an update, then formatting stays within the article width and source information remains visible.
- Given an update detail page, when a resident reads it, then there is no editor or editable content field.

## Scope

Included: update detail body rendering using [react-markdown](https://github.com/remarkjs/react-markdown), existing content from either configured source, and responsive article styling.

Excluded: changing stored content, Markdown editing, raw HTML, GitHub-specific extensions, and formatting other content types or update summaries.

## Library choice

The official react-markdown documentation was reviewed on 13 October 2026. It supports CommonMark, renders React elements directly, and provides safe default URL handling. Its built-in syntax covers the supplied press release, so no plugin is needed.
