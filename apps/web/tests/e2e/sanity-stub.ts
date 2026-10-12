/**
 * Deterministic Sanity stub for Playwright e2e.
 *
 * Serves the same seeded editorial content as Sanity GROQ query results
 * (`{ result: ... }`). This keeps `test:e2e` hermetic: no live Sanity
 * dataset, no Google Sheets credentials, no network flakes.
 *
 * Started automatically by `playwright.config.ts` via `webServer`.
 */
import { createServer } from 'node:http';

import {
  events,
  projects,
  resources,
  siteSetting,
  surveys,
  updates,
} from './seed-content';

const port = Number(process.env.E2E_SANITY_STUB_PORT ?? 1380);

function withId<T extends { slug: string }>(
  items: T[],
): Array<T & { _id: string; slug: { current: string } }> {
  return items.map((item) => ({
    ...item,
    _id: `${item.slug}-seed`,
    slug: { current: item.slug },
  }));
}

function toSanityResource(resource: (typeof resources)[number], index: number) {
  return {
    ...resource,
    _id: `${resource.slug}-seed`,
    slug: { current: resource.slug },
    displayOrder: resource.displayOrder ?? index,
  };
}

const results = {
  siteSetting,
  updates: withId(updates),
  projects: withId(projects),
  events: withId(events),
  surveys: withId(surveys),
  resources: resources.map(toSanityResource),
};

function resultForQuery(query: string): unknown {
  if (query.includes('_type == "siteSetting"')) return results.siteSetting;
  if (query.includes('_type == "update"')) return results.updates;
  if (query.includes('_type == "project"')) return results.projects;
  if (query.includes('_type == "event"')) return results.events;
  if (query.includes('_type == "survey"')) return results.surveys;
  if (query.includes('_type == "resource"')) return results.resources;
  return [];
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  const isQuery =
    request.method === 'GET' && url.pathname.includes('/data/query/');
  if (!isQuery) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
    return;
  }

  const query = url.searchParams.get('query') ?? '';
  const result = resultForQuery(query);

  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify({ result }));
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(
    `e2e Sanity stub listening on http://127.0.0.1:${port}\n`,
  );
});
