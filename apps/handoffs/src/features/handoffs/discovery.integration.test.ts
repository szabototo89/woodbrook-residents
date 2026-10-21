import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'vite';
import { expect, test, vi } from 'vitest';
import { watchHandoffDocuments } from './watchHandoffDocuments';

test('the development catalog discovers added and removed handoff folders outside its app root', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'handoff-discovery-'));
  const app = join(fixture, 'app');
  const docs = join(fixture, 'docs/handoffs');
  await mkdir(app);
  await mkdir(join(docs, 'existing'), { recursive: true });
  await writeFile(join(docs, 'existing/index.mdx'), '# Existing fixture');
  await writeFile(
    join(app, 'catalog.ts'),
    "export const documents = import.meta.glob('../docs/handoffs/*/index.mdx', {eager: true});",
  );
  const server = await createServer({
    root: app,
    configFile: false,
    plugins: [watchHandoffDocuments(docs)],
    server: { middlewareMode: true, watch: { usePolling: true, interval: 25 } },
    logLevel: 'silent',
  });
  try {
    expect((await server.transformRequest('/catalog.ts'))?.code).toContain(
      'existing/index.mdx',
    );
    await mkdir(join(docs, 'new-handoff'));
    await writeFile(join(docs, 'new-handoff/index.mdx'), '# New fixture');
    await writeFile(join(docs, 'notes.txt'), 'Not a handoff');
    await vi.waitFor(
      async () => {
        expect((await server.transformRequest('/catalog.ts'))?.code).toContain(
          'new-handoff/index.mdx',
        );
      },
      { timeout: 4000 },
    );
    await rm(join(docs, 'new-handoff'), { recursive: true });
    await vi.waitFor(
      async () => {
        expect(
          (await server.transformRequest('/catalog.ts'))?.code,
        ).not.toContain('new-handoff/index.mdx');
      },
      { timeout: 4000 },
    );
  } finally {
    await server.close();
    await rm(fixture, { recursive: true, force: true });
  }
});
