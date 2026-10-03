import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { LauraSanitySource, type LauraSanityConfig } from './lauraSanitySource';
import type {
  AboutData,
  GalleryData,
  HomeData,
  ServicesData,
} from '../src/features/site/lauraSanity';
import { cacheLauraImages, imageCacheDirectory } from './lauraImageAssets';

export type LauraSnapshot = {
  home: HomeData;
  about: AboutData;
  services: ServicesData;
  gallery: GalleryData;
};

const snapshotUrl = new URL('../.cache/laura-content.json', import.meta.url);

export async function loadLauraSnapshot(
  source: Pick<
    LauraSanitySource,
    'loadHome' | 'loadAbout' | 'loadServices' | 'loadGallery'
  > = new LauraSanitySource(),
): Promise<LauraSnapshot> {
  const [home, about, services, gallery] = await Promise.all([
    source.loadHome(),
    source.loadAbout(),
    source.loadServices(),
    source.loadGallery(),
  ]);
  return { home, about, services, gallery };
}

export async function generateLauraSnapshot(
  config: LauraSanityConfig,
  mode = 'production',
): Promise<LauraSnapshot> {
  const content = await loadLauraSnapshot(new LauraSanitySource(config));
  const snapshot = await cacheLauraImages(content, {
    cacheDirectory: imageCacheDirectory(mode),
    publicDirectory: fileURLToPath(new URL('../public/', import.meta.url)),
  });
  await mkdir(fileURLToPath(new URL('../.cache/', import.meta.url)), {
    recursive: true,
  });
  await writeFile(snapshotUrl, JSON.stringify(snapshot));
  return snapshot;
}

export async function readLauraSnapshot(): Promise<LauraSnapshot> {
  // Generated and validated by this build; never refresh from Sanity at runtime.
  return JSON.parse(await readFile(snapshotUrl, 'utf8'));
}
