# Forma Studio content editing

Status: Available

## Job to be done

As a Forma editor, update website copy and images in a dedicated content editor, then publish and rebuild the site without changing application code.

## Visible behavior

- [Forma Studio content](https://forma-studio-content.sanity.studio/) provides Homepage, Journal page, Site settings, Selected work and Journal guides editors.
- Every custom field has a plain-language description explaining its purpose and where visitors see it. Labels such as Process heading and Image description avoid internal field names.
- Homepage services, packages, process steps and FAQs publish together. Work and guides publish independently and appear in their page's chosen order.
- Images include descriptions for screen readers. Guide sources retain their URLs and the dates they were checked.
- Publishing plus a successful rebuild updates `/` and `/blog`, including metadata, navigation and email enquiry links, while preserving the existing design and interactions.
- Site settings no longer offer a footer statement. The Studio shows only the footer service summary, so a removed statement cannot be reintroduced through the editor.
- A bad field or missing published reference stops the build with a useful field path. The previous deployment stays online.

## Acceptance criteria

- Editors can change all modeled page copy, contact details, metadata and images through Studio.
- Every custom Studio field has contextual help; the code contract has detailed descriptions for reviewers and coding agents.
- All consumed CMS data passes Zod at runtime; types are inferred from the validated contract.
- Empty required text, unsupported icons, unsafe links, invalid emails/dates, missing assets, broken references and draft/version documents are rejected.
- Both routes retain complete prerendered HTML and accessible interactions on desktop and phone, without browser content-API requests.
- Offline unit tests, browser tests and the repository build pass. Publishing and rebuild instructions are documented.

## Explicit scope

The implementation uses Sanity project `ms27me7o`, dataset `production`, separate from Woodbrook and Laura. It preserves the current mailto enquiry flow. It adds no account, payment, booking or enquiry-storage service.

Publishing does not deploy by itself. Run the existing Deploy Forma Studio workflow on `main` after publishing. Its new `forma-sanity-update` dispatch event supports an optional automated webhook; creating its dedicated GitHub credential and activating delivery remain operator setup.

See the [content guide](../../apps/forma-studio-web/src/features/content/README.md) for document ownership, data flow, schema changes, migration and exact webhook configuration.
