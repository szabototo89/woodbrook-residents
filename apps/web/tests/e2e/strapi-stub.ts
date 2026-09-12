/**
 * Deterministic Strapi stub for Playwright e2e.
 *
 * Serves the same seeded editorial content the CMS bootstrap would publish,
 * shaped the way `StrapiContentSource` expects it (`{ data: [...] }` with
 * flat Strapi v5 documents). This keeps `test:e2e` hermetic: no live Strapi
 * database, no Google Sheets credentials, no network flakes.
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
} from '../../../cms/src/seed/content';

const port = Number(process.env.E2E_STRAPI_STUB_PORT ?? 1338);

type SeedDetail = { label: string; value: string; showOnCard?: boolean };
type SeedCollectionDate = { date: string; stream: string };
type SeedResource = (typeof resources)[number] & {
  details?: SeedDetail[];
  collectionDates?: SeedCollectionDate[];
};

function withDocumentId<T extends { slug: string }>(
  items: T[],
): Array<T & { documentId: string }> {
  return items.map((item) => ({
    ...item,
    documentId: `${item.slug}-seed`,
  }));
}

function toStrapiResource(resource: SeedResource, index: number) {
  const details = (resource.details ?? []).map((detail, detailIndex) => ({
    id: detailIndex + 1,
    label: detail.label,
    value: detail.value,
    showOnCard: detail.showOnCard ?? false,
  }));
  const collectionDates = (resource.collectionDates ?? []).map(
    (collectionDate, dateIndex) => ({
      id: dateIndex + 1,
      date: collectionDate.date,
      stream: collectionDate.stream,
    }),
  );

  return {
    ...resource,
    documentId: `${resource.slug}-seed`,
    displayOrder: resource.displayOrder ?? index,
    details,
    collectionDates,
  };
}

const payload: Record<string, unknown> = {
  '/api/site-setting': { data: siteSetting },
  '/api/updates': { data: withDocumentId(updates) },
  '/api/projects': { data: withDocumentId(projects) },
  '/api/events': { data: withDocumentId(events) },
  '/api/surveys': { data: withDocumentId(surveys) },
  '/api/resources': { data: resources.map(toStrapiResource) },
};

const server = createServer((request, response) => {
  const pathname = (request.url ?? '/').split('?')[0] ?? '/';
  const body = payload[pathname];

  if (request.method !== 'GET' || !body) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(body));
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(
    `e2e Strapi stub listening on http://127.0.0.1:${port}\n`,
  );
});
