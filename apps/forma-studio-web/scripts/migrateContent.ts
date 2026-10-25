import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import legacy from '../migration/legacy-content.json';
import { parseFormaContent } from '../src/features/content/schema';
import {
  FORMA_PROJECT_ID,
  FORMA_DATASET,
  fetchFormaContent,
} from '../src/features/content/fetchContent';
import { migrationDocuments } from './migrationDocuments';

const token = process.env.FORMA_SANITY_WRITE_TOKEN;
if (!token)
  throw new Error('Set FORMA_SANITY_WRITE_TOKEN in an ignored env file.');
const base = `https://${FORMA_PROJECT_ID}.api.sanity.io/v2026-10-01`;
async function request(
  path: string,
  options: RequestInit = {},
): Promise<unknown> {
  const response = await fetch(`${base}/${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (!response.ok)
    throw new Error(
      `Forma migration request failed (HTTP ${response.status}).`,
    );
  return response.json();
}
const assetResponse = z.object({
  document: z
    .object({
      _id: z
        .string()
        .describe(
          'Sanity image document ID returned after uploading an original Forma image.',
        ),
      url: z
        .url()
        .describe(
          'Public CDN URL returned for the uploaded image; used to validate the migration snapshot.',
        ),
      metadata: z
        .object({
          dimensions: z
            .object({
              width: z
                .number()
                .describe(
                  'Original uploaded image width in pixels, supplied by Sanity asset metadata.',
                ),
              height: z
                .number()
                .describe(
                  'Original uploaded image height in pixels, supplied by Sanity asset metadata.',
                ),
            })
            .describe(
              'Original dimensions extracted by Sanity; the migration never guesses image sizes.',
            ),
        })
        .describe(
          'Sanity-generated image metadata required to construct the validated snapshot.',
        ),
    })
    .describe('Uploaded asset document returned by the Sanity Images API.'),
});
const files = [
  'forma-studio-logo.webp',
  'laura-website-1200.webp',
  'laura-project.jpg',
];
const uploads = await Promise.all(
  files.map(async (file) => {
    const result = assetResponse.parse(
      await request(
        `assets/images/${FORMA_DATASET}?filename=${encodeURIComponent(file)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': file.endsWith('.jpg') ? 'image/jpeg' : 'image/webp',
          },
          body: await readFile(
            new URL(`../public/images/${file}`, import.meta.url),
          ),
        },
      ),
    );
    return {
      filename: file,
      asset: {
        _id: result.document._id,
        url: result.document.url,
        ...result.document.metadata.dimensions,
      },
    };
  }),
);
function resolveAssets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveAssets);
  if (value !== null && typeof value === 'object') {
    if ('asset' in value && 'alt' in value) {
      const input = z
        .object({
          alt: z
            .string()
            .describe(
              'Existing accessible image description carried unchanged into the migrated document.',
            ),
          asset: z
            .object({
              _id: z
                .string()
                .describe(
                  'Original local image filename used to look up the uploaded Sanity asset.',
                ),
            })
            .describe(
              'Legacy asset placeholder; replaced by the matching uploaded asset before validation.',
            ),
        })
        .parse(value);
      return {
        alt: input.alt,
        asset: uploads.find((upload) => upload.filename === input.asset._id)
          ?.asset,
      };
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveAssets(item)]),
    );
  }
  return value;
}
const content = parseFormaContent(resolveAssets(legacy));
const existingResponse = z.object({
  result: z
    .array(
      z.object({
        _id: z
          .string()
          .describe(
            'Published Sanity document ID found during an earlier run of this migration.',
          ),
        legacyId: z
          .string()
          .describe(
            'Original content identifier used to find the existing document without overwriting editor changes.',
          ),
      }),
    )
    .describe(
      'Published work and guides already imported; reuse their IDs on reruns.',
    ),
});
const query = encodeURIComponent(
  '*[_type in ["selectedWork","journalGuide"] && defined(legacyId) && !(_id in path("drafts.**"))]{_id,legacyId}',
);
const existing = existingResponse.parse(
  await request(
    `data/query/${FORMA_DATASET}?perspective=published&query=${query}`,
  ),
).result;
const ids = new Map(existing.map((doc) => [doc.legacyId, doc._id]));
const resolveId = (id: string) => {
  const current = ids.get(id);
  if (current) return current;
  const created = randomUUID();
  ids.set(id, created);
  return created;
};
const documents = migrationDocuments(content, resolveId);
await request(`data/mutate/${FORMA_DATASET}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mutations: documents.map((document) => ({ createIfNotExists: document })),
  }),
});
await fetchFormaContent();
console.log(
  `Forma migration complete: ${documents.length} create-if-missing documents; existing documents preserved; published snapshot validated.`,
);
