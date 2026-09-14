import { contentFixture } from './contentFixture.js';

const webRoot = 'dist/web';

function resolveAssetPath(pathname: string) {
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (!relativePath || relativePath.split('/').includes('..')) return undefined;
  return `${webRoot}/${relativePath}`;
}

Bun.serve({
  hostname: '127.0.0.1',
  port: 4317,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/mobile-content') {
      return Response.json(contentFixture);
    }

    const assetPath = resolveAssetPath(decodeURIComponent(pathname));
    if (!assetPath) return new Response('Bad request', { status: 400 });

    const asset = Bun.file(assetPath);
    if (!(await asset.exists()))
      return new Response('Not found', { status: 404 });
    return new Response(asset);
  },
});
