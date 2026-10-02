export function galleryPictureSizes(image: string): string {
  const dimensions = /-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i.exec(image);
  const width = Number(dimensions?.[1]);
  const height = Number(dimensions?.[2]);
  // Images are contained in a 4:3 frame. Portraits occupy less than its width.
  const fraction =
    width > 0 && height > 0 ? Math.min(1, width / height / (4 / 3)) : 1;
  const ratio = Number(fraction.toFixed(6));
  const desktopRatio = Number(((fraction * 2) / 3).toFixed(6));
  return `(max-width: 640px) calc((100vw - 40px) * ${ratio}), (max-width: 1023px) calc((100vw - 48px) * ${ratio}), (max-width: 1328px) calc((100vw - 96px) * ${desktopRatio}), ${Math.round(821 * fraction)}px`;
}
