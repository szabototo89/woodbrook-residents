import { z } from 'zod';

const collectionSchema = z.object({
  title: z.string().min(1).describe('Published collection title'),
  slug: z
    .object({ current: z.string().min(1).describe('Collection URL slug') })
    .describe('Sanity slug'),
  description: z.string().describe('Collection introduction'),
  photos: z
    .array(
      z.object({ alt: z.string().min(1).describe('Accessible picture name') }),
    )
    .min(1)
    .describe('Collection pictures'),
});

export async function galleryCollections() {
  const query =
    '*[_type == "galleryCollection"] | order(order asc){title, slug, description, "photos": photos[]->{ "alt": imageAlt }}';
  const response = await fetch(
    `https://uag6kepo.api.sanity.io/v2025-09-01/data/query/production?query=${encodeURIComponent(query)}`,
  );
  if (!response.ok)
    throw new Error(`Laura gallery query failed: ${response.status}`);
  const { result } = z
    .object({
      result: z
        .array(collectionSchema)
        .min(1)
        .describe('Published collections'),
    })
    .parse(await response.json());
  return result.map((collection) => ({
    ...collection,
    slug: collection.slug.current,
    photos: collection.photos.map((photo) => photo.alt),
  }));
}

export async function browsableCollections() {
  const collections = (await galleryCollections()).filter(
    (collection) => collection.photos.length > 1,
  );
  if (collections.length === 0)
    throw new Error(
      'A collection with multiple pictures is required for browsing tests',
    );
  return collections;
}
