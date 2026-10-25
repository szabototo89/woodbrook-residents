# Forma Studio shared UI

Scope: `apps/forma-studio-web` only. Keep feature content in `features/` and pass it through typed props. The base for this inventory is `c31cd3e`.

## Pattern inventory and decisions

| Pattern                                                                 | Consumers                                                                           | Shared owner                  | Intentional exceptions and reason                                                                                                                                |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page shell, skip link and main focus target                             | HomePage, BlogPage                                                                  | SiteLayout                    | `page="blog"` retains `blog-shell` and homepage section URLs.                                                                                                    |
| Navigation and menu                                                     | Both pages through SiteLayout                                                       | Existing SiteHeader           | Blog marks its current link and prefixes homepage anchors. Menu keeps Escape dismissal and focus return.                                                         |
| Footer                                                                  | Both pages through SiteLayout                                                       | SiteFooter                    | Home shows the service line; journal shows a home link. Retains the approved copy from merged #4; the removed footer field is never read.                        |
| Surfaces, borders, radii and padding                                    | Services, work, packages, preparation, FAQ, contact, guides                         | Existing Card                 | Featured guide/work cards use `padding="none"`. Popular packages use Card's ring. Journal tablet spacing is preserved below.                                     |
| Arrow actions                                                           | SiteHeader, home hero/packages/preparation/contact, SelectedWork, blog back/contact | ActionLink                    | Button/text, arrow direction and icon size are explicit. Plain email, work-anchor, source and navigation links retain their own semantics.                       |
| Side-by-side section titles                                             | Home services/process and SelectedWork                                              | SectionHeading                | Optional eyebrow preserves the title grouping; only services/process show a decorative description arrow. Other titles have different layout and heading levels. |
| Decorative icon discs                                                   | Home services, journal guide placeholders                                           | IconBadge                     | Service: 31px icon, 1.4 stroke, lighter disc, 18px gap; guide: 30px, 1.3 stroke, darker disc, 22px gap. Service discs shrink on phones.                          |
| Native disclosures                                                      | Service inclusions and journal guides                                               | Disclosure                    | Service retains a native marker/list; guide uses an arrow and prose/source slot. They can open independently.                                                    |
| Exclusive FAQ accordion                                                 | Home FAQ                                                                            | Feature-owned Faq             | Button headings, named answer regions and one-open-at-a-time behavior differ from native disclosures. No generic accordion is introduced.                        |
| Package checks, process numbers, browser preview bar, decorative leaves | Home sections                                                                       | Feature-owned markup          | Each conveys a different meaning and has no repeated cross-feature responsibility.                                                                               |
| Contact panels                                                          | Home, journal                                                                       | Card + ActionLink composition | Home has an enquiry mailto, email and note; journal links to `/#contact`. Decorations, copy size and alignment remain feature CSS.                               |
| Multiline headings                                                      | Hero, packages, journal intro                                                       | Feature-owned markup          | Different heading levels and responsive line breaks; keep their content structure explicit.                                                                      |

Decision: retain every observed visual difference in this engineering task. No redesign or commercial-content decision is implied. At 761–960px, ordinary journal guide cards keep 28px padding while Card's medium token is 24px. At 761–1179px, journal contact keeps 40px padding while the large token is 32px. These existing cascade effects are explicit media-query exceptions. Featured guide copy also retains its independent inset.

## Typed contracts

All props are named TypeScript interfaces beside the exported component. Defaults are part of the contract.

| Component      | Props and supported variants                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SiteLayout     | `children: ReactNode`; `page?: 'home' \| 'blog'` defaults to home. Owns the only skip link, header, focusable main and footer.                                                                                                                                  |
| SiteFooter     | `page: 'home' \| 'blog'`. Reads the existing validated content. Called by SiteLayout.                                                                                                                                                                           |
| SiteHeader     | Existing `page?: 'home' \| 'blog'`. Owns responsive menu state and section destinations.                                                                                                                                                                        |
| Card           | Existing `as?: 'section' \| 'article' \| 'div'`, `variant?: 'panel' \| 'white' \| 'muted'`, `padding?: 'none' \| 'md' \| 'lg'`, `popular?: boolean`; HTML attributes and children.                                                                              |
| ActionLink     | Required `href: string`, `children: ReactNode`; `variant?: 'button' \| 'text'` defaults to button; `arrow?: 'right' \| 'up-right' \| 'left'` defaults right; `iconSize?: number` defaults 16; native anchor attributes. Icons are hidden from accessible names. |
| SectionHeading | Required `id`, `title`, `description` strings; optional `eyebrow: string`, `descriptionArrow: boolean` (default off). Emits h2; connect the parent section's `aria-labelledby` to `id`.                                                                         |
| IconBadge      | Required `icon: LucideIcon`, `variant: 'service' \| 'guide'`. Entire badge is decorative; meaningful labels belong in adjacent copy.                                                                                                                            |
| Disclosure     | Required `variant: 'service' \| 'guide'`, `summary: string`, `children: ReactNode`. Native details/summary owns keyboard behavior; callers provide list or prose content.                                                                                       |

Use `className` on Card/ActionLink only for feature placement or recorded exceptions. Do not repeat their surface, arrow or interaction markup in consumers. Shared CSS remains in `src/styles.css`; feature classes retain layout and copy styles.

## Composition examples

```tsx
<SiteLayout page="blog">
  <Card variant="panel" aria-labelledby="contact-title">
    <h2 id="contact-title">Discuss your project</h2>
    <ActionLink href="/#contact">Let’s talk</ActionLink>
  </Card>
</SiteLayout>

<section aria-labelledby="services-title">
  <SectionHeading id="services-title" title="Services" description="What we offer" descriptionArrow />
  <Card as="article" variant="muted">
    <IconBadge variant="service" icon={Leaf} />
    <h3>Website design</h3>
    <Disclosure variant="service" summary="What’s included">
      <ul><li>A clear enquiry journey</li></ul>
    </Disclosure>
  </Card>
</section>

<ActionLink variant="text" arrow="up-right" iconSize={17} href={project.url}>
  {project.action}
</ActionLink>
```

The examples use sample copy; production strings still come from the existing content snapshot. No CMS schema, publishing contract, dependency or application route changes are part of this refactor.
