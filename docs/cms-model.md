# Strapi content model

The model intentionally uses six collection types and one single type. It avoids categories-as-collections, polymorphic page builders, and deeply nested components until there is a proven editorial need.

| Type         | Purpose                                               | Key fields                                                                                      |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Site setting | Stable site identity and contact details              | name, location, tagline, introduction, contact email                                            |
| Update       | News, notices, and planning explainers                | title, slug, kind, summary, body, published date, source, image metadata, featured              |
| Project      | Track a neighbourhood initiative over time            | title, slug, category, stage, summary, details, updated date, next step, source, image metadata |
| Event        | Publish a real community date                         | title, slug, summary, start/end, location, booking URL                                          |
| Survey       | Point residents to an active or archived consultation | title, slug, stage, summary, open/close dates, response URL, source                             |
| Resource     | Curated local service or contact                      | title, category, description, URL, phone, email, display order                                  |
| Issue report | Private structured resident submission                | category, location, details, reporter contact, consent, state                                   |

All editorial types use Draft & Publish. Issue reports do not, because they are private operational records rather than public articles. The public role receives read access only to editorial types and create-only access to issue reports.
