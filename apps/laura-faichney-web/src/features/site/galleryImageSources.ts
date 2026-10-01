export function galleryHeroSrcSet(image: string) {
  return [320, 640, 960, 1374]
    .map(
      (width) =>
        `${width === 1374 ? image : image.replace('.webp', `-${width}.webp`)} ${width}w`,
    )
    .join(', ');
}

export function galleryPhotoSrcSet(id: number) {
  return [160, 320, 640]
    .map(
      (width) =>
        `/artwork/picsum-${id}${width === 640 ? '' : `-${width}`}.webp ${width}w`,
    )
    .join(', ');
}

export const collectionCoverSizes =
  '(max-width: 640px) calc((100vw - 48px) / 2), (max-width: 1328px) calc((100vw - 78px) / 2), 625px';
