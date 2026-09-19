export type CompressedProxy = {
  url: string;
  stop: () => void;
};

const COMPRESSIBLE_CONTENT =
  /text\/html|javascript|text\/css|image\/svg|application\/json/;

/**
 * Starts a local reverse proxy that gzip-compresses text responses.
 *
 * `vite preview` serves without compression while every production host
 * compresses text. Auditing the uncompressed server understates real
 * delivery, which Lighthouse itself flags ("No compression applied").
 * The proxy changes only the transfer encoding; response bytes are equal.
 */
export function startCompressedProxy(upstreamBaseUrl: string): CompressedProxy {
  const upstream = upstreamBaseUrl.replace(/\/$/, '');
  const server = Bun.serve({
    port: 0,
    hostname: '127.0.0.1',
    async fetch(clientRequest) {
      const url = new URL(clientRequest.url);
      const upstreamResponse = await fetch(
        `${upstream}${url.pathname}${url.search}`,
        { headers: { 'accept-encoding': 'identity' } },
      ).catch(() => undefined);
      if (upstreamResponse === undefined) {
        return new Response('Bad gateway', { status: 502 });
      }
      const headers = new Headers(upstreamResponse.headers);
      headers.delete('content-length');
      headers.delete('content-encoding');
      const contentType = upstreamResponse.headers.get('content-type') ?? '';
      const clientEncodings =
        clientRequest.headers.get('accept-encoding') ?? '';
      const body = new Uint8Array(await upstreamResponse.arrayBuffer());
      if (
        COMPRESSIBLE_CONTENT.test(contentType) &&
        clientEncodings.includes('gzip')
      ) {
        headers.set('content-encoding', 'gzip');
        return new Response(Bun.gzipSync(body), {
          status: upstreamResponse.status,
          headers,
        });
      }
      return new Response(body, {
        status: upstreamResponse.status,
        headers,
      });
    },
  });
  return {
    url: `http://127.0.0.1:${server.port}`,
    stop: () => server.stop(),
  };
}
