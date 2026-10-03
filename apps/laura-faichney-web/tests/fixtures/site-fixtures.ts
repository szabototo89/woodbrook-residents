import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import content from './site-content.json' with { type: 'json' };

const artworkRoot = new URL('../../public/artwork/', import.meta.url);
const images: Record<string, string> = {
  '3325501aef2b0082139bad8fabec12e8d19c1e8a': 'portrait-cutout.png',
  '56f7a815e06b8dc32777f6d44672f91e95d605f1': 'pink-botanical.png',
  '5b7739acb7674b9e33bd37b480f6effabe3cc0b1': 'about-studio.webp',
  '039ccadcad11f40cb3edf73e3badd086e040239c': 'about-hero-cutout.webp',
  '6dc8b4ce1ddd05917a67627ed1140f7230f2ac9d': 'colour-portrait.png',
  '7da19494c0d4338fc98b7b0373afa921a5b32f3f': 'services-hero-cutout.webp',
  d9bb83bbbb07c39f42f8c62a2c96a096c4c0e457: 'gallery-hero-cutout.webp',
  e31807d572fbe68ee33f28c40a908bc8591bef0d:
    'service-commissioned-paintings.webp',
  '058c63ac168bd4c0b7f8b54317215cf08d20f5e9': 'service-murals.webp',
  '25d211d18daea4f4b44d5ed5b957d59b60702f5b': 'service-signage.webp',
  a22b8eb712a411006a5402b1bc6e03556c5dd119: 'service-facepainting.webp',
  d9dafbf2f23ada70f12f69701ad2aaeffe6d05fd: 'service-art-tutoring.webp',
  '86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2': 'picsum-106.webp',
  d854d44adc674ded75531906c9fb813b0bed4dca: 'picsum-1080.webp',
  c1949059522fb58517fa0e2696ce24ca46565f89: 'picsum-180.webp',
  c11c7d1590363c8864a94a5a0c86e96539fe6c09: 'picsum-24.webp',
  '7da3b550ea1bcb7889533d8199ddbb20796928b3': 'picsum-42.webp',
};

const imageResponses = new Map<string, Promise<Buffer>>();

export async function fixtureResponse(
  input: RequestInfo | URL,
): Promise<Response> {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (
    url.hostname === 'uag6kepo.api.sanity.io' &&
    url.pathname.includes('/data/query/production')
  ) {
    const query = url.searchParams.get('query') ?? '';
    const entry = Object.entries(content).find(([id]) =>
      query.includes(`_id == "${id}"`),
    );
    if (entry) return Response.json({ result: entry[1] });
  }
  if (
    url.origin === 'https://cdn.sanity.io' &&
    url.pathname.startsWith('/images/uag6kepo/production/')
  ) {
    const hash = url.pathname.split('/').at(-1)?.split('-')[0] ?? '';
    const filename = images[hash];
    if (filename) {
      const bytes =
        imageResponses.get(url.href) ??
        sharp(fileURLToPath(new URL(filename, artworkRoot)))
          .resize({
            width: Number(url.searchParams.get('w')) || undefined,
            height: Number(url.searchParams.get('h')) || undefined,
            withoutEnlargement: true,
          })
          .webp({ quality: 75 })
          .toBuffer();
      imageResponses.set(url.href, bytes);
      return new Response(new Uint8Array(await bytes), {
        headers: {
          'Content-Type': 'image/webp',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
  throw new Error(`No local fixture for ${url.href}`);
}
