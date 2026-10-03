import { parseImageUrl, sanityImageSrcSet } from './galleryImageSources';

// Each key is the SHA-1 of the matching original in public/artwork.
// A newly published CMS asset uses CDN derivatives until local copies exist.
const localArtwork: Record<string, string> = {
  '3325501aef2b0082139bad8fabec12e8d19c1e8a': 'portrait-cutout',
  '039ccadcad11f40cb3edf73e3badd086e040239c': 'about-hero-cutout',
  '7da19494c0d4338fc98b7b0373afa921a5b32f3f': 'services-hero-cutout',
  d9bb83bbbb07c39f42f8c62a2c96a096c4c0e457: 'gallery-hero-cutout',
};

export function heroImageSrcSet(
  image: string,
  format: 'webp' | 'avif' = 'webp',
): string | undefined {
  if (image === '/artwork/contact-studio-cutout.webp') {
    return [320, 480, 512, 640, 960, 1374]
      .map(
        (width) =>
          `/artwork/contact-studio-cutout-${width}.${format} ${width}w`,
      )
      .join(', ');
  }
  const source = parseImageUrl(image);
  if (!source) return undefined;
  const hash =
    source.origin === 'https://cdn.sanity.io'
      ? /^\/images\/uag6kepo\/production\/([a-f0-9]{40})-/.exec(
          source.pathname,
        )?.[1]
      : undefined;
  const originalAppearance = [...source.searchParams].every(
    ([name, value]) =>
      ['w', 'auto', 'fm', 'q'].includes(name) ||
      (name === 'fit' && value === 'max'),
  );
  const local = hash && originalAppearance ? localArtwork[hash] : undefined;
  return local
    ? [320, 400, 480, 640, 768, 960, 1374]
        .map((width) => `/artwork/${local}-${width}.${format} ${width}w`)
        .join(', ')
    : format === 'avif'
      ? undefined
      : sanityImageSrcSet(image, [320, 400, 480, 640, 768, 960]);
}
