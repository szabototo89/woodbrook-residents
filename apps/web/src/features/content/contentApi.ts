import { createServerFn } from '@tanstack/react-start';
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
    'resources?populate[details]=*&sort[0]=displayOrder:asc&sort[1]=title:asc&pagination[pageSize]=200',
  );
  return collectionEnvelopeSchema(resourceSchema).parse(response).data;
}

export const getHomeContent = createServerFn({ method: 'GET' }).handler(
  async (): Promise<HomeContent> => {
    try {
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
    } catch {
      return {
        availability: 'unavailable',
        updates: [],
        projects: [],
        events: [],
        surveys: [],
      };
    }
  },
);

export const getUpdates = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ContentCollection<Update>> => {
    try {
      return { availability: 'ready', items: await loadUpdates() };
    } catch {
      return { availability: 'unavailable', items: [] };
    }
  },
);

export const getProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ContentCollection<Project>> => {
    try {
      return { availability: 'ready', items: await loadProjects() };
    } catch {
      return { availability: 'unavailable', items: [] };
    }
  },
);

export const getEvents = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ContentCollection<CommunityEvent>> => {
    try {
      return { availability: 'ready', items: await loadEvents() };
    } catch {
      return { availability: 'unavailable', items: [] };
    }
  },
);

export const getSurveys = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ContentCollection<Survey>> => {
    try {
      return { availability: 'ready', items: await loadSurveys() };
    } catch {
      return { availability: 'unavailable', items: [] };
    }
  },
);

export const getResources = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ContentCollection<Resource>> => {
    try {
      return { availability: 'ready', items: await loadResources() };
    } catch {
      return { availability: 'unavailable', items: [] };
    }
  },
);

const slugInputSchema = z.object({ slug: z.string().min(1).max(160) });

export const getUpdateBySlug = createServerFn({ method: 'GET' })
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Update | undefined> => {
    try {
      const search = new URLSearchParams({
        'filters[slug][$eq]': data.slug,
        'pagination[pageSize]': '1',
      });
      const response = await fetchJson(`updates?${search.toString()}`);
      return collectionEnvelopeSchema(updateSchema).parse(response).data[0];
    } catch {
      return undefined;
    }
  });

export const getProjectBySlug = createServerFn({ method: 'GET' })
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Project | undefined> => {
    try {
      const search = new URLSearchParams({
        'filters[slug][$eq]': data.slug,
        'pagination[pageSize]': '1',
      });
      const response = await fetchJson(`projects?${search.toString()}`);
      return collectionEnvelopeSchema(projectSchema).parse(response).data[0];
    } catch {
      return undefined;
    }
  });

export const getEventBySlug = createServerFn({ method: 'GET' })
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<CommunityEvent | undefined> => {
    try {
      const search = new URLSearchParams({
        'filters[slug][$eq]': data.slug,
        'pagination[pageSize]': '1',
      });
      const response = await fetchJson(`events?${search.toString()}`);
      return collectionEnvelopeSchema(eventSchema).parse(response).data[0];
    } catch {
      return undefined;
    }
  });

export const getSurveyBySlug = createServerFn({ method: 'GET' })
  .validator(slugInputSchema)
  .handler(async ({ data }): Promise<Survey | undefined> => {
    try {
      const search = new URLSearchParams({
        'filters[slug][$eq]': data.slug,
        'pagination[pageSize]': '1',
      });
      const response = await fetchJson(`surveys?${search.toString()}`);
      return collectionEnvelopeSchema(surveySchema).parse(response).data[0];
    } catch {
      return undefined;
    }
  });
