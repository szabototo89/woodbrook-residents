import { expect, test } from 'bun:test';

import { startCompressedProxy } from './compressed-preview';

const PNG_BYTES = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);

function startUpstream() {
  return Bun.serve({
    port: 0,
    hostname: '127.0.0.1',
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === '/') {
        return new Response('<html><body>hello</body></html>', {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        });
      }
      if (url.pathname === '/app.js') {
        return new Response('console.log("hi");', {
          headers: { 'content-type': 'text/javascript; charset=utf-8' },
        });
      }
      if (url.pathname === '/missing') {
        return new Response('nope', { status: 404 });
      }
      return new Response(PNG_BYTES, {
        headers: { 'content-type': 'image/png' },
      });
    },
  });
}

async function gunzip(bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

import { connect } from 'node:net';

async function fetchRaw(
  url: string,
  acceptEncoding: string,
): Promise<{ headers: string; body: Uint8Array<ArrayBuffer> }> {
  const parsed = new URL(url);
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    const socket = connect(Number(parsed.port), parsed.hostname, () => {
      socket.write(
        `GET ${parsed.pathname} HTTP/1.1\r\nHost: ${parsed.host}\r\nAccept-Encoding: ${acceptEncoding}\r\nConnection: close\r\n\r\n`,
      );
    });
    socket.on('data', (chunk: Buffer) => chunks.push(chunk));
    socket.on('close', () => resolve());
    socket.on('error', reject);
  });
  const raw = Buffer.concat(chunks);
  const separator = Buffer.from('\r\n\r\n');
  const headerEnd = raw.indexOf(separator);
  return {
    headers: raw.subarray(0, headerEnd).toString('latin1'),
    body: new Uint8Array(raw.subarray(headerEnd + separator.length)),
  };
}

test('compressed preview gzips text responses when the client accepts it', async () => {
  const upstream = startUpstream();
  const proxy = startCompressedProxy(`http://127.0.0.1:${upstream.port}`);
  try {
    const { headers, body } = await fetchRaw(`${proxy.url}/`, 'gzip');
    const lowerHeaders = headers.toLowerCase();
    expect(lowerHeaders).toContain('content-encoding: gzip');
    expect(lowerHeaders).toContain('text/html');
    expect(await gunzip(body)).toBe('<html><body>hello</body></html>');
  } finally {
    proxy.stop();
    upstream.stop();
  }
});

test('compressed preview leaves already-compressed bytes untouched', async () => {
  const upstream = startUpstream();
  const proxy = startCompressedProxy(`http://127.0.0.1:${upstream.port}`);
  try {
    const response = await fetch(`${proxy.url}/photo.png`, {
      headers: { 'accept-encoding': 'gzip' },
    });
    expect(response.headers.get('content-encoding')).toBeNull();
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(PNG_BYTES);
  } finally {
    proxy.stop();
    upstream.stop();
  }
});

test('compressed preview reports a bad gateway while upstream is down', async () => {
  const proxy = startCompressedProxy('http://127.0.0.1:1');
  try {
    const response = await fetch(`${proxy.url}/`);
    expect(response.status).toBe(502);
  } finally {
    proxy.stop();
  }
});

test('compressed preview passes responses through without gzip support', async () => {
  const upstream = startUpstream();
  const proxy = startCompressedProxy(`http://127.0.0.1:${upstream.port}`);
  try {
    const response = await fetch(`${proxy.url}/app.js`, {
      headers: { 'accept-encoding': 'identity' },
    });
    expect(response.headers.get('content-encoding')).toBeNull();
    expect(await response.text()).toBe('console.log("hi");');

    const missing = await fetch(`${proxy.url}/missing`);
    expect(missing.status).toBe(404);
  } finally {
    proxy.stop();
    upstream.stop();
  }
});
