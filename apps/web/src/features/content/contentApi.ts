import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { z } from 'zod';

import {
  findBySlug,
  getCollection,
  getHomeContentFromSnapshot,
  getSiteSettingFromSnapshot,
} from './contentQueries';
import { getContentSnapshot } from './contentSnapshot';
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
import { loadContent } from './loadContent';

const contentMiddleware = __STATIC_SITE_BUILD__
  ? [staticFunctionMiddleware]
  : [];
const loadSnapshot = () => getContentSnapshot(__STATIC_SITE_BUILD__);

export const getSiteSetting = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<SiteSetting | undefined> =>
    loadContent(
      async () => getSiteSettingFromSnapshot(await loadSnapshot()),
      undefined,
      __STATIC_SITE_BUILD__,
    ),
  );

export const getHomeContent = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<HomeContent> =>
    loadContent(
      async () => getHomeContentFromSnapshot(await loadSnapshot()),
      {
        availability: 'unavailable',
        updates: [],
        projects: [],
        events: [],
        surveys: [],
      },
      __STATIC_SITE_BUILD__,
    ),
  );

function loadCollection<T>(select: () => Promise<T[]>, limit = 25) {
  return loadContent<ContentCollection<T>>(
    async () => ({
      availability: 'ready',
      items: getCollection(await select(), limit),
    }),
    { availability: 'unavailable', items: [] },
    __STATIC_SITE_BUILD__,
  );
}

export const getUpdates = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<ContentCollection<Update>> =>
    loadCollection(async () => (await loadSnapshot()).updates),
  );

export const getProjects = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<ContentCollection<Project>> =>
    loadCollection(async () => (await loadSnapshot()).projects),
  );

export const getEvents = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<ContentCollection<CommunityEvent>> =>
    loadCollection(async () => (await loadSnapshot()).events),
  );

export const getSurveys = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<ContentCollection<Survey>> =>
    loadCollection(async () => (await loadSnapshot()).surveys),
  );

export const getResources = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .handler((): Promise<ContentCollection<Resource>> =>
    loadCollection(async () => (await loadSnapshot()).resources, 200),
  );

const slugInputSchema = z
  .object({
    slug: z.string().min(1).max(160).describe('Public content route slug.'),
  })
  .describe('Validated detail-page route input.');

function loadBySlug<T extends { slug: string }>(
  select: () => Promise<T[]>,
  slug: string,
) {
  return loadContent(
    async () => findBySlug(await select(), slug),
    undefined,
    __STATIC_SITE_BUILD__,
  );
}

export const getUpdateBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(({ data }): Promise<Update | undefined> =>
    loadBySlug(async () => (await loadSnapshot()).updates, data.slug),
  );

export const getProjectBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(({ data }): Promise<Project | undefined> =>
    loadBySlug(async () => (await loadSnapshot()).projects, data.slug),
  );

export const getEventBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(({ data }): Promise<CommunityEvent | undefined> =>
    loadBySlug(async () => (await loadSnapshot()).events, data.slug),
  );

export const getSurveyBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(({ data }): Promise<Survey | undefined> =>
    loadBySlug(async () => (await loadSnapshot()).surveys, data.slug),
  );

export const getResourceBySlug = createServerFn({ method: 'GET' })
  .middleware(contentMiddleware)
  .validator(slugInputSchema)
  .handler(({ data }): Promise<Resource | undefined> =>
    loadBySlug(async () => (await loadSnapshot()).resources, data.slug),
  );
