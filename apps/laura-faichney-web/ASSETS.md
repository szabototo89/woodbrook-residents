# Laura site image sources

All current assets are for the design implementation. Laura will supply originals. The site has no CMS.

## Supplied artwork

- `public/artwork/colour-portrait.png`: supplied file `ChatGPT-kép 2026. szept. 28. 16_00_39-1.png`.
- `public/artwork/pink-botanical.png`: supplied file `ChatGPT-kép 2026. szept. 28. 16_00_45-6.png`.

## Picsum photography

Fixed images were downloaded as WebP on 2026-09-28, as requested. They stay stable between page loads. No placeholder notices are displayed in page content, at the user's request.

| Local file                        | Source                                     |
| --------------------------------- | ------------------------------------------ |
| `public/artwork/picsum-24.webp`   | https://picsum.photos/id/24/640/480.webp   |
| `public/artwork/picsum-42.webp`   | https://picsum.photos/id/42/640/480.webp   |
| `public/artwork/picsum-106.webp`  | https://picsum.photos/id/106/640/480.webp  |
| `public/artwork/picsum-1080.webp` | https://picsum.photos/id/1080/640/480.webp |
| `public/artwork/picsum-180.webp`  | https://picsum.photos/id/180/640/480.webp  |

## Generated transparent assets

### Hero portrait cutout

Saved to `public/artwork/portrait-cutout.png` (1374 × 1145, true alpha). Edited with the built-in imagegen tool on 2026-09-28 using the supplied portrait as the edit target and homepage mockup as an edge-style reference. The home hero uses the natural painted silhouette, without a CSS gradient fade.

Prompt:

> Use case: background-extraction. Asset type: transparent artist-portfolio hero artwork.
> Input 1 is the EDIT TARGET: the vivid painted portrait supplied by the user. Input 2 is a website mockup showing the desired rough painterly silhouette and edge treatment for the hero; use it ONLY as a framing and edge-style guide.
> Extract the painted woman's face and the hand resting against the left side of her face from Input 1 as a standalone transparent cutout. Preserve the painting itself: its closed eyes and thick dark eyelashes, nose, red lips with visible white teeth, hand, expression, paint texture, and original vivid coral, pink, teal, ultramarine, orange and yellow brushwork. Do not replace her with a new face. Keep both eyes, nose and lips clearly recognisable, with the supporting hand on the left.
> Remove the surrounding rectangular painted background. Let the silhouette around forehead, face, jaw and hand break into irregular dry-brush paint edges and a few fine stray strokes, similar to the hero in Input 2. Edges should be crisp painterly fragments with true transparency between strokes, NOT a soft rectangular fade or gradient. Crop below the chin/hand so the composition is a close portrait rather than a full torso. Wide near-square composition approximately 6:5, full face centered slightly right, thin transparent margin around the silhouette.
> Output ONLY the extracted artwork on a genuinely transparent alpha background. No cream or white backdrop, no coloured fog, no rectangle, no letters, no logo, no UI.

### Handwritten statement

Saved to `public/decoration/brighter-world-motto.png`. Generated with the built-in imagegen tool from the user's separately supplied gold handwriting reference. The text is supplied by the user.

Prompt:

> Use case: text-localization / logo-brand. Asset type: transparent decorative handwritten statement for an artist website.
> Recreate the supplied reference image as a clean high-resolution transparent PNG. Exact text, arranged in loose flowing handwritten lines:
> "A brighter
> world through
> art"
> A delicate hand-drawn open heart flourish sits below and to the right.
> Match the reference closely: fine casual modern signature-style pen lettering, slender uneven hand-drawn strokes, warm muted metallic ochre/gold ink (#c99b48), natural upward slant, tall expressive ascenders and descenders. The word "art" is larger and centered under the first two lines. Elegant airy line spacing. Preserve the organic personal handwriting, not a serif font or formal calligraphy. Portrait-ish near-square composition, tightly framed with modest transparent padding. Genuine transparent alpha background. No cream paper, no white box, no shadows, no texture outside the gold handwriting, no extra words, no border, no website UI.

Created with the built-in imagegen tool on 2026-09-28 using the supplied homepage mockup as reference. All generated files have an alpha channel. The signature is a provisional recreation, not an original logo supplied by Laura. The footer uses a monochrome CSS treatment of the same logo.

### Signature logo

Saved to `public/brand/laura-faichney-signature.png`.

Prompt:

> Use case: logo-brand. Asset type: transparent website header logo.
> Reference image: use ONLY the Laura Faichney logo at the top left of the supplied website mockup as the design reference.
> Create a clean, high-resolution transparent PNG logo closely matching that small reference: the exact words "Laura Faichney" in delicate, flowing, energetic handwritten signature lettering, thin hot-pink/coral strokes (#ef4766), with the long sweeping initial L, tall looping F, natural connected cursive, and a long fine finishing flourish. It must look like a handwritten artist signature, not italic serif type.
> Below the signature, centered, put the exact text "ALL THINGS ART" in small deep-navy (#0d2942) uppercase sans-serif letters with generous letter spacing.
> Wide horizontal composition about 3.2:1, tightly framed with only modest transparent padding. Preserve the reference's elegant informal thin-line character. Actual transparent alpha background; no cream, white, checkerboard, gradients, shadows, frame, paint splashes, extra words, or website elements. This is a standalone logo asset, not a page mockup. Ensure the name is spelled exactly Laura Faichney.

### blush-brush

Saved to `public/decoration/blush-gold-brush.png`.

Prompt:

> Use case: background-extraction / illustration-story. Asset type: transparent decorative website background overlay. Reference: ONLY the subtle pale blush-pink and gold dry-brush textures at the outer edges of the hero and about section in the supplied artist website mockup. Create a standalone airy cluster of diagonal dry paintbrush strokes, dusty blush pink, pale coral and a very small amount of muted ochre gold. Fine bristle streaks, rough feathered broken edges, lots of open transparent space between strokes, handmade acrylic paint texture. The strokes run bottom-left to top-right in a loose tapered sweep, with paint concentrated in the lower-left and fading into transparent space toward upper-right. Soft and restrained rather than a bold splash. Landscape 3:2 composition. Genuine transparent alpha background, no cream or paper rectangle, no shadow, no text, no logo, no people, no other objects, no website UI. Intended to sit subtly along the outer edge of a warm off-white web section.

### colour-brush

Saved to `public/decoration/colour-brush.png`.

Prompt:

> Use case: illustration-story. Asset type: transparent artist website section-edge background overlay. Use the supplied reference website's lower-left contact background brush marks as the style reference. Create a standalone narrow loose cluster of expressive acrylic dry-brush strokes travelling diagonally top-left to bottom-right. Dominant vivid coral pink and magenta, with a few ultramarine blue and teal strokes and fine warm gold bristle streaks. Keep a generous amount of transparent space and delicate ragged feathering; paint concentrated on the left edge, thin strokes fading outward to the right. Preserve a refined handmade texture, not a cartoon paint splat. Portrait 2:3 composition. Genuine transparent alpha background, no white/cream/paper rectangle, no lettering, no logo, no people, no objects, no UI. It is decorative artwork for the outer corner of a contact section, not a complete website image.
