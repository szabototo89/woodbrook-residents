export function galleryHeroSrcSet(image: string) {
  if (!/^\/artwork\/gallery(?:-detail)?-hero-cutout\.webp$/.test(image)) {
    return sanityImageSrcSet(image, [320, 640, 960]);
  }
  return [320, 640, 960, 1374]
    .map(
      (width) =>
        `${width === 1374 ? image : image.replace('.webp', `-${width}.webp`)} ${width}w`,
    )
    .join(', ');
}

export function galleryPhotoSrcSet(image: string) {
  const local = /^\/artwork\/picsum-(106|1080|180|24|42)\.webp$/.exec(image);
  if (!local) return sanityImageSrcSet(image, [160, 320, 640, 960]);
  const id = local[1];
  return [160, 320, 640]
    .map(
      (width) =>
        `/artwork/picsum-${id}${width === 640 ? '' : `-${width}`}.webp ${width}w`,
    )
    .join(', ');
}

function sanityImageSrcSet(image: string, candidates: number[]) {
  const source = parseImageUrl(image);
  if (
    !source ||
    source.origin !== 'https://cdn.sanity.io' ||
    !source.pathname.startsWith('/images/')
  )
    return undefined;
  const originalWidth = Number(source.searchParams.get('w'));
  if (!Number.isInteger(originalWidth) || originalWidth < 1) return undefined;
  const originalHeight = Number(source.searchParams.get('h'));
  return [...candidates.filter((width) => width < originalWidth), originalWidth]
    .map((width) => {
      const variant = new URL(source);
      variant.searchParams.set('w', String(width));
      if (originalHeight > 0)
        variant.searchParams.set(
          'h',
          String(
            Math.max(1, Math.round((width * originalHeight) / originalWidth)),
          ),
        );
      return `${variant.href} ${width}w`;
    })
    .join(', ');
}

function parseImageUrl(image: string) {
  try {
    return new URL(image);
  } catch {
    return undefined;
  }
}

export const collectionCoverSizes =
  '(max-width: 527px) calc(100vw - 40px), (max-width: 640px) calc((100vw - 48px) / 2), (max-width: 827px) calc((100vw - 78px) / 2), (max-width: 1097px) calc((100vw - 108px) / 3), (max-width: 1328px) calc((100vw - 138px) / 4), 297.5px';
