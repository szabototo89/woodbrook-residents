import path from 'node:path';

const COMPRESSIBLE_CONTENT = /text\/|javascript|image\/svg|application\/json/;

export async function staticResponse(
  request: Request,
  directory: string,
): Promise<Response> {
  const root = path.resolve(directory);
  const pathname = decodeURIComponent(new URL(request.url).pathname);
  const candidate = path.resolve(root, `.${pathname}`);
  if (!candidate.startsWith(`${root}${path.sep}`) && candidate !== root)
    return new Response('Not found', { status: 404 });
  const file = Bun.file(
    path.extname(candidate) ? candidate : path.join(candidate, 'index.html'),
  );
  if (!(await file.exists())) return new Response('Not found', { status: 404 });
  const headers = new Headers({
    'content-type': file.type,
    vary: 'Accept-Encoding',
  });
  const rules = Bun.file(path.join(root, '_headers'));
  const configuration = (await rules.exists()) ? await rules.text() : '';
  const matching = [
    ...configuration.matchAll(/^(\/[^\n]+)\n\s+Cache-Control: ([^\n]+)/gm),
  ].find(([, pattern]) =>
    pattern!.endsWith('*')
      ? pathname.startsWith(pattern!.slice(0, -1))
      : pathname === pattern,
  );
  headers.set('cache-control', matching?.[2] ?? 'no-cache');
  if (request.method === 'HEAD') return new Response(null, { headers });
  const body = await file.arrayBuffer();
  if (
    COMPRESSIBLE_CONTENT.test(file.type) &&
    request.headers.get('accept-encoding')?.includes('gzip')
  ) {
    headers.set('content-encoding', 'gzip');
    return new Response(Bun.gzipSync(body), { headers });
  }
  return new Response(body, { headers });
}

export function startStaticPreview(directory: string, port: number) {
  const server = Bun.serve({
    hostname: '127.0.0.1',
    port,
    fetch: (request) => staticResponse(request, directory),
  });
  return {
    url: `http://127.0.0.1:${server.port}`,
    stop: () => server.stop(true),
  };
}
