# Laura Faichney artist website

Status: Available

## Job to be done

As someone looking for art for a home, business or event, I want to see Laura's creative services and artwork, then contact her directly about a project.

## Visible behavior

- A responsive home page introduces Laura's painting, mural, signage, facepainting and tutoring services.
- The service, gallery, about and contact pages are reachable through desktop navigation and a mobile menu.
- Services appear as five artwork cards on desktop and single clickable rows on mobile. The services page gives each one a description and a contact path.
- Service rows have generous vertical padding and a clear gap between thumbnails and copy. The list starts below the overflowing hero artwork with space before the first title. On phones, the right contact brush sits below the enquiry button and continues into the footer.
- The hero and mural feature use the supplied artwork and derived cutout. Each service has a generated category image, and the home biography uses a studio still life without people. The gallery retains fixed Picsum photography pending original assets. Phone and email links use Lucide icons and open the device's calling or email app.
- The home gold brush underline scales with the heading to cover the word “Brighter”.
- A transparent signature logo and subtle transparent brush accents follow the reference design. Decorative images are CSS backgrounds and do not enter the accessibility tree.
- The hero portrait has a transparent, irregular painted silhouette extending toward the header. Desktop uses a large portrait cropped at the section’s lower edge; tablet and mobile preserve the full face without a gradient fade. The home biography includes the supplied gold handwritten statement, “A brighter world through art”.
- About, Services, Gallery and Contact each open with a shared editorial hero layout, a unique transparent illustration, a scaling gold brush underline and expressive paint accents. Hero cutouts overlap the section edge on desktop and phone while staying within the viewport.
- All pages use one primary heading, visible focus states, meaningful image descriptions and reduced motion support.
- A “What Clients Say” section follows the home biography, displaying the single Sarah O’Connor quote explicitly supplied in the user's testimonial reference screenshot. It has no autoplay or inactive carousel controls.
- The client quote sits on a soft blush panel, separating it from the cream biography above and the navy contact section below. The full-colour contact brush continues from the lower left of the contact section into the footer at phone, tablet and desktop widths; on phones it begins below the contact details. The lighter brush accents around the hero, biography and contact section have stronger colour.
- The mural feature presents one botanical artwork: a large edge crop beside the copy on desktop, and the full centred illustration below the enquiry button on phones.

## Acceptance criteria

- Home, services, gallery, about and contact routes render at desktop, tablet and phone widths without horizontal scrolling.
- Phone body copy is at least 16px, and visible phone links and buttons have tap areas at least 44px high.
- The mobile service thumbnail, title and arrow remain together in one row.
- The mobile gallery has two columns and the mobile navigation is operable with keyboard and touch.
- The supplied artwork remains legible at the relevant crop and the hero's text does not overlap it.
- No invented testimonial, social profile, client portrait or business detail appears.
- The testimonial is visually distinct from the biography. The contact brush flows into the footer without covering contact details or causing horizontal scrolling, and footer navigation remains readable.
- At phone widths, the mural flower and leaves fit inside the section beneath the copy and action, without a faded duplicate.
- Each non-home page has its own descriptive, transparent-alpha hero asset. Hero artwork crosses the lower hero boundary at desktop and phone widths without causing horizontal page overflow or obscuring the copy.
- Every page emits a canonical URL, description, and Open Graph/Twitter metadata rooted at the production Pages origin unless `VITE_PUBLIC_SITE_URL` overrides it, without inventing a social image.
- `bun run --cwd apps/laura-faichney-web build:static` prerenders home, services, gallery, about and contact as static HTML with sitemap and robots, and `verify:static` rejects missing pages, broken internal links, runtime-only output, or crawler metadata gaps.
- The Cloudflare Pages project `laura-faichney-all-things-art` serves the static output at its production `pages.dev` origin.

## Scope

This is an independent TanStack Start site under `apps/laura-faichney-web`, with no CMS integration. It uses the supplied artwork, generated transparent design assets and fixed Picsum photography until Laura provides originals. Asset sources and generation prompts are recorded in `apps/laura-faichney-web/ASSETS.md`. Placeholder notices are omitted from the page content as requested. The screenshots guide layout and styling; they are not served as flattened page images. The testimonial copy comes from the user's supplied reference (`codex-clipboard-0j7NLo.png`, 2026-09-28); it is not independently verified. Facebook and Instagram content awaits verified source details.

## Verification

`bun run --cwd apps/laura-faichney-web test:e2e` checks all five routes at 320, 390, 640, 700, 900 and 1440 pixels, the mobile service and gallery layouts, logo loading, and keyboard menu dismissal. `bun run --cwd apps/laura-faichney-web test:unit` covers site metadata canonicals and page content. `bun run --cwd apps/laura-faichney-web build:static` verifies the prerendered Pages artifact. See `apps/laura-faichney-web/README.md` for Pages build settings and the `Deploy Laura Faichney` workflow.
