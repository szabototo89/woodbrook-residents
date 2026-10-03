import type { LauraSnapshot } from './lauraSnapshot';
import type { CmsImage } from '../src/features/site/lauraSanity';
import { heroImageSrcSet } from '../src/features/site/heroImageSources';
import { createHash, randomUUID } from 'node:crypto';
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function imageCacheDirectory(mode: string): string {
  const directory =
    mode === 'test' || mode === 'audit' ? 'test-image-assets' : 'image-assets';
  return fileURLToPath(new URL(`../.cache/${directory}/`, import.meta.url));
}

type AssetDirectories = {
  cacheDirectory: string;
  publicDirectory: string;
  includeGallery?: boolean;
};

function isWebP(bytes: Uint8Array): boolean {
  const buffer = Buffer.from(bytes);
  return (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP' &&
    buffer.readUInt32LE(4) + 8 === buffer.length
  );
}

async function downloadImage(url: string, cachePath: string): Promise<void> {
  try {
    if (isWebP(await readFile(cachePath))) return;
  } catch {
    // Only a missing variant is downloaded; content hashes invalidate old assets.
  }
  const response = await fetch(url, {
    headers: { Accept: 'image/webp' },
  }).catch((error: unknown) => {
    throw new Error(`Site image request failed: ${url}`, { cause: error });
  });
  if (
    !response.ok ||
    response.headers.get('Content-Type')?.split(';')[0] !== 'image/webp'
  ) {
    throw new Error(`Site image download failed (${response.status}): ${url}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!isWebP(bytes))
    throw new Error(`Site image download was not a complete WebP: ${url}`);
  const temporaryPath = `${cachePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, bytes);
    await rename(temporaryPath, cachePath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

export async function cacheLauraImages(
  snapshot: LauraSnapshot,
  options: AssetDirectories,
): Promise<LauraSnapshot> {
  const result = structuredClone(snapshot);
  const galleryImages = options.includeGallery
    ? [...result.home.collections, ...result.gallery.collections].flatMap(
        (collection) =>
          collection.photos.flatMap((picture) => [
            picture.image,
            picture.fullImage,
          ]),
      )
    : [];
  const images: CmsImage[] = [
    result.home.hero.image,
    result.home.mural.image,
    result.home.about.image,
    result.about.hero.image,
    result.about.storyImage,
    result.services.hero.image,
    result.gallery.hero.image,
    ...result.home.services.map((service) => service.image),
    ...result.services.services.map((service) => service.image),
    ...galleryImages,
  ];
  await mkdir(options.cacheDirectory, { recursive: true });
  const files = new Set<string>();
  for (const image of images) {
    const source = new URL(image.url);
    if (
      source.origin !== 'https://cdn.sanity.io' ||
      !source.pathname.startsWith('/images/')
    ) {
      throw new Error(`Site image must be a Sanity image: ${image.url}`);
    }
    const dimensions = /-(\d+)x(\d+)\.[^.]+$/.exec(source.pathname);
    const crop = source.searchParams.get('rect')?.split(',').map(Number);
    const nativeWidth = crop?.[2] ?? Number(dimensions?.[1]);
    const nativeHeight = crop?.[3] ?? Number(dimensions?.[2]);
    const requestedWidth = Number(source.searchParams.get('w'));
    const originalHeight = Number(source.searchParams.get('h'));
    const originalWidth = Math.floor(
      Math.min(
        requestedWidth,
        nativeWidth,
        originalHeight > 0
          ? (nativeHeight * requestedWidth) / originalHeight
          : nativeWidth,
      ),
    );
    if (!Number.isInteger(originalWidth) || originalWidth < 1)
      throw new Error(`Site image has no valid width: ${image.url}`);
    const widths = [
      ...(galleryImages.includes(image)
        ? [160, 240, 320, 480, 640, 768, 960, 1280]
        : [320, 640, 768, 960, 1280]
      ).filter((width) => width < originalWidth),
      originalWidth,
    ];
    const variants: string[] = [];
    for (const width of widths) {
      const variant = new URL(source);
      variant.searchParams.delete('auto');
      variant.searchParams.set('fm', 'webp');
      variant.searchParams.set('q', '75');
      variant.searchParams.set('w', String(width));
      if (originalHeight > 0)
        variant.searchParams.set(
          'h',
          String(
            Math.max(
              1,
              Math.round(
                (width * originalHeight) / Number(source.searchParams.get('w')),
              ),
            ),
          ),
        );
      else variant.searchParams.set('fit', 'max');
      variant.searchParams.sort();
      const filename = `${createHash('sha256').update(variant.href).digest('hex').slice(0, 24)}.webp`;
      await downloadImage(
        variant.href,
        path.join(options.cacheDirectory, filename),
      );
      files.add(filename);
      const url = `/site-images/${filename}`;
      variants.push(`${url} ${width}w`);
      image.url = url;
    }
    image.srcSet = variants.join(', ');
    const optimizedAvif = heroImageSrcSet(source.href, 'avif');
    if (optimizedAvif) {
      const avifVariants: string[] = [];
      for (const entry of optimizedAvif.split(', ')) {
        const [assetPath, descriptor] = entry.split(' ');
        const bytes = await readFile(
          fileURLToPath(new URL(`../public${assetPath}`, import.meta.url)),
        );
        const filename = `${createHash('sha256').update(bytes).digest('hex').slice(0, 24)}.avif`;
        await writeFile(path.join(options.cacheDirectory, filename), bytes);
        files.add(filename);
        avifVariants.push(`/site-images/${filename} ${descriptor}`);
      }
      image.avifSrcSet = avifVariants.join(', ');
    }
  }
  const outputDirectory = path.join(options.publicDirectory, 'site-images');
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all(
    [...files].map((filename) =>
      copyFile(
        path.join(options.cacheDirectory, filename),
        path.join(outputDirectory, filename),
      ),
    ),
  );
  return result;
}
