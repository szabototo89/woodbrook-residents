# Laura Faichney artist website

Status: Available

## Job to be done

As someone looking for art for a home, business or event, I want to see Laura's creative services and artwork, then contact her directly about a project.

## Visible behavior

- A responsive home page introduces Laura's painting, mural, signage, facepainting and tutoring services.
- The service, gallery, about and contact pages are reachable through desktop navigation and a mobile menu.
- Services appear as five artwork cards on desktop and single clickable rows on mobile. The services page gives each one a description and a contact path.
- The hero, mural section and biography use the supplied artwork. The gallery and missing service thumbnails use fixed Picsum photography pending original assets. Phone and email links open the device's calling or email app.
- A transparent signature logo and subtle transparent brush accents follow the reference design. Decorative images are CSS backgrounds and do not enter the accessibility tree.
- The hero portrait has a transparent, irregular painted silhouette extending toward the header. Desktop uses a large portrait cropped at the section’s lower edge; tablet and mobile preserve the full face without a gradient fade. The home biography includes the supplied gold handwritten statement, “A brighter world through art”.
- All pages use one primary heading, visible focus states, meaningful image descriptions and reduced motion support.
- A “What Clients Say” section follows the home biography, displaying the single Sarah O’Connor quote explicitly supplied in the user's testimonial reference screenshot. It has no autoplay or inactive carousel controls.

## Acceptance criteria

- Home, services, gallery, about and contact routes render at desktop, tablet and phone widths without horizontal scrolling.
- The mobile service thumbnail, title and arrow remain together in one row.
- The mobile gallery has two columns and the mobile navigation is operable with keyboard and touch.
- The supplied artwork remains legible at the relevant crop and the hero's text does not overlap it.
- No invented testimonial, social profile, client portrait or business detail appears.

## Scope

This is an independent TanStack Start site under `apps/laura-faichney-web`, with no CMS integration. It uses the supplied artwork, generated transparent design assets and fixed Picsum photography until Laura provides originals. Asset sources and generation prompts are recorded in `apps/laura-faichney-web/ASSETS.md`. Placeholder notices are omitted from the page content as requested. The screenshots guide layout and styling; they are not served as flattened page images. The testimonial copy comes from the user's supplied reference (`codex-clipboard-0j7NLo.png`, 2026-09-28); it is not independently verified. Facebook and Instagram content awaits verified source details.

## Verification

`bun run --cwd apps/laura-faichney-web test:e2e` checks all five routes at 320, 390, 640, 700, 900 and 1440 pixels, the mobile service and gallery layouts, logo loading, and keyboard menu dismissal.
