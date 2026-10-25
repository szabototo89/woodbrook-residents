import type { ContentImage } from './schema';
export function imageUrl(image: ContentImage, width?: number) {
  if (!width) return image.asset.url;
  const url = new URL(image.asset.url);
  url.searchParams.set('w', String(width));
  url.searchParams.set('auto', 'format');
  return url.toString();
}
