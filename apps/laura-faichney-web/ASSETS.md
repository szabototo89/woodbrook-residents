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

## Generated service and About images

Created with the built-in imagegen tool on 2026-09-28, then encoded as WebP at their original 1448 × 1086 dimensions. These are illustrative preview assets, not verified client commissions. The About image is a studio still life without people; the generated adult portrait was rejected and is not used. Gallery photography remains unchanged at the user's request.

### commissioned-paintings

Saved file: `public/artwork/service-commissioned-paintings.webp`.

Selected generator output: `exec-f9fd5a3f-e8c9-42ac-93d1-599293708e65.png`.

Prompt:

> Use case: stylized-concept. Asset type: commissioned paintings service thumbnail. Use the supplied cow painting as visual inspiration for a NEW hand-painted acrylic composition. A friendly cow looking toward the viewer, crowned with an abundant garland of bright pink, red, yellow, blue and lilac wildflowers and green leaves. Expressive large dark eyes, soft pale muzzle, painterly patches of vivid coral, turquoise, navy, lilac and pink on its coat. Light turquoise-blue painted background. Match the cheerful bold palette, visible handmade brushwork and approachable folk-pop character of the reference; avoid photorealism and smooth digital airbrushing. Landscape 4:3, both ears, eyes, muzzle and flower crown clearly readable inside the central crop. Only painting fills the frame, no easel, room, photo border, text, logo or signature.

### murals

Saved file: `public/artwork/service-murals.webp`.

Selected generator output: `exec-640b6935-d012-4785-9d87-259c200a4b13.png`.

Prompt:

> Use case: stylized-concept. Asset type: mural service thumbnail for an artist website. Close detail of a beautiful hand-painted botanical wall mural: one large lush pink peony and a second smaller peony, elegant olive and deep green leaves with warm ochre highlights, against a rich deep navy painted wall. Visible brushstrokes, contemporary premium artist portfolio photography, beautifully lit with soft natural light. Landscape 4:3 composition, large central flower and foliage fill frame, slight subtle wall texture. No people, no furniture, no text, no logo, no watermark. Opaque background.

### signage

Saved file: `public/artwork/service-signage.webp`.

Selected generator output: `exec-0170108d-6da5-41bb-a53c-dbeaec02d339.png`.

Prompt:

> Use case: photorealistic-natural. Asset type: signage service thumbnail for a refined artist portfolio website. Close-up editorial photograph of a handmade matte charcoal-black wooden welcome sign. Exact and only text: "Welcome", beautifully hand-painted in warm gold flowing casual calligraphy, clearly readable. A few natural green eucalyptus and ivy leaves softly frame two corners. Warm daylight, shallow depth of field, rich deep background, beautiful real paint texture. Landscape 4:3 composition, entire word safely within central area, sign angled only slightly. No other text, no logo, no watermark.

### facepainting

Saved file: `public/artwork/service-facepainting.webp`.

Selected generator output: `exec-3d448d56-b84e-4add-856b-fa1c231b58a4.png`.

Prompt:

> Use case: photorealistic-natural. Asset type: facepainting service thumbnail for a warm artist portfolio website. Natural close-up photograph of a cheerful fictional young child with a beautifully detailed butterfly facepaint design around the eyes and across the cheeks: pink, lilac and turquoise wings, fine navy curved outlines, tiny white highlights. Auburn-brown hair tucked away from the face, gentle happy smile, face turned slightly right. Soft warm daylight, softly blurred neutral garden background, professional editorial photography. Landscape 4:3 framing with the full butterfly and face comfortably visible in central crop. No text, no logo, no watermark. This is illustrative concept photography, not a real client.

### art-tutoring

Saved file: `public/artwork/service-art-tutoring.webp`.

Selected generator output: `exec-97c4eb75-737e-4c6c-838e-bb245a9dfb6f.png`.

Prompt:

> Use case: photorealistic-natural. Asset type: art tutoring service thumbnail for a refined artist portfolio. Close-up editorial photograph of five well-used artist paintbrushes with wooden handles and brass ferrules, leaning diagonally from a simple ceramic pot. In the background, soft-focus watercolour paint wells and a palette with bright pink, golden yellow, teal and navy pigments on a cream studio table. Focus on the brush tips and ferrules, warm natural window light, inviting handmade creative atmosphere. Landscape 4:3 composition, brushes large enough to read at thumbnail size. No people, no text, no logo, no watermark.

### about-studio

Saved file: `public/artwork/about-studio.webp`.

Selected generator output: `exec-45a58aba-4a66-44df-8452-07200fce2d69.png`.

Prompt:

> Use case: photorealistic-natural. Asset type: About section image for an artist website. An inviting artist's studio still life with NO PEOPLE: well-used brushes in a paint-splattered cream ceramic pot on a wooden worktable, vibrant pink, turquoise, yellow and navy paint on a palette, a linen apron draped over a nearby chair, and colourful handmade canvases leaning against a warm cream studio wall. A bright flower-crowned cow painting and a geometric hot-pink and navy pop-art painting are softly visible behind the brushes, inspired by the user's supplied art direction. Natural side window light, honest paint splashes and tactile materials, warm premium editorial photography, not a sterile stock image. Landscape 4:3 composition, main brush pot and canvas details inside central square-safe crop. Strictly no person, no human face, no hands, no photo portrait, no words, no logo, no signature, no watermark.

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
