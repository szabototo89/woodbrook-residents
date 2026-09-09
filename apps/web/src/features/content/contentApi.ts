import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { z } from 'zod';

import {
  eventSchema,
  projectSchema,
  resourceSchema,
  siteSettingSchema,
  surveySchema,
  updateSchema,
} from './contentSchemas';
import type {
  CommunityEvent,
  ContentCollection,
  HomeContent,
  Project,
  Resource,
  SiteSetting,
  Survey,
  Update,
} from './contentTypes';
import { loadCmsContent } from './loadCmsContent';

const contentMiddleware = __STATIC_SITE_BUILD__
  ? [staticFunctionMiddleware]
  : [];

const collectionEnvelopeSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({ data: z.array(itemSchema) });

const singleEnvelopeSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({ data: itemSchema.nullable() });

function getStrapiUrl() {
  return process.env.STRAPI_URL ?? 'http://localhost:1337';
}

async function fetchJson(path: string) {
  const response = await fetch(`${getStrapiUrl()}/api/${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed with status ${response.status}`);
  }

  return response.json();
}

async function loadSiteSetting(): Promise<SiteSetting | undefined> {
  const response = await fetchJson('site-setting');
  return (
    singleEnvelopeSchema(siteSettingSchema).parse(response).data ?? undefined
  );
}

async function loadUpdates(limit = 25): Promise<Update[]> {
  const response = await fetchJson(
    `updates?sort[0]=publishedOn:desc&pagination[pageSize]=${limit}`,
  );
  return collectionEnvelopeSchema(updateSchema).parse(response).data;
}

async function loadProjects(limit = 25): Promise<Project[]> {
  const response = await fetchJson(
    `projects?sort[0]=featured:desc&sort[1]=updatedOn:desc&pagination[pageSize]=${limit}`,
  );
  return collectionEnvelopeSchema(projectSchema).parse(response).data;
}

async function loadEvents(): Promise<CommunityEvent[]> {
  const response = await fetchJson(
    'events?sort[0]=startsAt:asc&pagination[pageSize]=25',
  );
  return collectionEnvelopeSchema(eventSchema).parse(response).data;
}

async function loadSurveys(): Promise<Survey[]> {
  const response = await fetchJson(
    'surveys?sort[0]=stage:asc&sort[1]=closesOn:desc&pagination[pageSize]=25',
  );
  return collectionEnvelopeSchema(surveySchema).parse(response).data;
}

async function loadResources(): Promise<Resource[]> {
  const response = await fetchJson(
    'resources?populate[details]=*&populate[collectionDates]=*&sort[0]=displayOrder:asc&sort[1]=title:asc&pagination[pageSize]=200',
  );
  return collectionEnvelopeSchema(resourceSchema).parse(response).data;
}

export const getHomeContent = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler(async (): Promise<HomeContent> => {
    return loadCmsContent<HomeContent>(
      async () => {
        const [siteSetting, updates, projects, events, surveys] =
          await Promise.all([
            loadSiteSetting(),
            loadUpdates(3),
            loadProjects(3),
            loadEvents(),
            loadSurveys(),
          ]);

        return {
          availability: 'ready',
          siteSetting,
          updates,
          projects,
          events,
          surveys,
        };
      },
      {
        availability: 'unavailable',
        updates: [],
        projects: [],
        events: [],
        surveys: [],
      },
      __STATIC_SITE_BUILD__,
    );
  });

export const getUpdates = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler(async (): Promise<ContentCollection<Update>> =>
    loadCmsContent<ContentCollection<Update>>(
      async () => ({ availability: 'ready', items: await loadUpdates() }),
      { availability: 'unavailable', items: [] },
      __STATIC_SITE_BUILD__,
    ),
  );

export const getProjects = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler(async (): Promise<ContentCollection<Project>> =>
    loadCmsContent<ContentCollection<Project>>(
      async () => ({ availability: 'ready', items: await loadProjects() }),
      { availability: 'unavailable', items: [] },
      __STATIC_SITE_BUILD__,
    ),
  );

export const getEvents = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler(async (): Promise<ContentCollection<CommunityEvent>> =>
    loadCmsContent<ContentCollection<CommunityEvent>>(
      async () => ({ availability: 'ready', items: await loadEvents() }),
      { availability: 'unavailable', items: [] },
      __STATIC_SITE_BUILD__,
    ),
  );

export const getSurveys = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler(async (): Promise<ContentCollection<Survey>> =>
    loadCmsContent<ContentCollection<Survey>>(
      async () => ({ availability: 'ready', items: await loadSurveys() }),
      { availability: 'unavailable', items: [] },
      __STATIC_SITE_BUILD__,
    ),
  );

export const getResources = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler(async (): Promise<ContentCollection<Resource>> =>
    loadCmsContent<ContentCollection<Resource>>(
      async () => ({ availability: 'ready', items: await loadResources() }),
      { availability: 'unavailable', items: [] },
      __STATIC_SITE_BUILD__,
    ),
  );

const slugInputSchema = z.object({ slug: z.string().min(1).max(160) });

export const getUpdateBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Update | undefined> => {
    return loadCmsContent(
      async () => {
        const search = new URLSearchParams({
          'filters[slug][$eq]': data.slug,
          'pagination[pageSize]': '1',
        });
        const response = await fetchJson(`updates?${search.toString()}`);
        return collectionEnvelopeSchema(updateSchema).parse(response).data[0];
      },
      undefined,
      __STATIC_SITE_BUILD__,
    );
  });

export const getProjectBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Project | undefined> => {
    return loadCmsContent(
      async () => {
        const search = new URLSearchParams({
          'filters[slug][$eq]': data.slug,
          'pagination[pageSize]': '1',
        });
        const response = await fetchJson(`projects?${search.toString()}`);
        return collectionEnvelopeSchema(projectSchema).parse(response).data[0];
      },
      undefined,
      __STATIC_SITE_BUILD__,
    );
  });

export const getEventBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<CommunityEvent | undefined> => {
    return loadCmsContent(
      async () => {
        const search = new URLSearchParams({
          'filters[slug][$eq]': data.slug,
          'pagination[pageSize]': '1',
        });
        const response = await fetchJson(`events?${search.toString()}`);
        return collectionEnvelopeSchema(eventSchema).parse(response).data[0];
      },
      undefined,
      __STATIC_SITE_BUILD__,
    );
  });

export const getSurveyBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Survey | undefined> => {
    return loadCmsContent(
      async () => {
        const search = new URLSearchParams({
          'filters[slug][$eq]': data.slug,
          'pagination[pageSize]': '1',
        });
        const response = await fetchJson(`surveys?${search.toString()}`);
        return collectionEnvelopeSchema(surveySchema).parse(response).data[0];
      },
      undefined,
      __STATIC_SITE_BUILD__,
    );
  });

export const getResourceBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Resource | undefined> => {
    return loadCmsContent(
      async () => {
        const search = new URLSearchParams({
          'filters[slug][$eq]': data.slug,
          'populate[details]': '*',
          'populate[collectionDates]': '*',
          'pagination[pageSize]': '1',
        });
        const response = await fetchJson(`resources?${search.toString()}`);
        return collectionEnvelopeSchema(resourceSchema).parse(response).data[0];
      },
      undefined,
      __STATIC_SITE_BUILD__,
    );
  });
