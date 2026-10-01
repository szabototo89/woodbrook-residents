import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { z } from 'zod';

import type { ContentSource } from './contentSource';
import {
  eventSchema,
  projectSchema,
  resourceSchema,
  surveySchema,
  updateSchema,
} from './contentSchemas';
import type { ContentSnapshot } from './contentTypes';
import {
  eventsQuery,
  projectsQuery,
  resourcesQuery,
  siteSettingQuery,
  surveysQuery,
  updatesQuery,
} from './sanityQueries';

export type SanityContentConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token?: string;
  useCdn?: boolean;
};

const sanityEnvelopeSchema = z.object({
  result: z.unknown().describe('Raw Sanity query result payload.'),
});

const sanitySiteSettingSchema = z
  .object({
    name: z.unknown().describe('Raw site name value.'),
    location: z.unknown().describe('Raw site location value.'),
    tagline: z.unknown().describe('Raw site tagline value.'),
    introduction: z.unknown().describe('Raw site introduction value.'),
    contactEmail: z
      .unknown()
      .optional()
      .describe('Optional raw contact email value.'),
  })
  .nullable();

type SanityRecord = Record<string, unknown>;

function isRecord(value: unknown): value is SanityRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordList(value: unknown): SanityRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord);
}

function stringField(value: SanityRecord, key: string): string {
  const field = value[key];
  return typeof field === 'string' ? field : '';
}

function optionalStringField(
  value: SanityRecord,
  key: string,
): string | undefined {
  const field = value[key];
  return typeof field === 'string' && field.length > 0 ? field : undefined;
}

function normalizeDocumentId(id: string): string {
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id;
}

function normalizeSlug(slug: unknown): string {
  if (typeof slug === 'string') return slug;
  if (isRecord(slug)) {
    const current = slug.current;
    return typeof current === 'string' ? current : '';
  }
  return '';
}

function imageRef(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  const asset = value.asset;
  if (!isRecord(asset)) return undefined;
  const ref = asset._ref;
  return typeof ref === 'string' ? ref : undefined;
}

function createImageUrl(
  client: SanityClient,
  image: unknown,
): string | undefined {
  const ref = imageRef(image);
  if (!ref) return undefined;
  try {
    return imageUrlBuilder(client)
      .image({ asset: { _ref: ref } })
      .url();
  } catch {
    return undefined;
  }
}

function optionalText(value: SanityRecord, key: string): string | undefined {
  const field = value[key];
  return typeof field === 'string' ? field : undefined;
}

function normalizeImageFields(client: SanityClient, image: unknown) {
  const record = isRecord(image) ? image : {};
  return {
    imagePath: createImageUrl(client, image),
    imageAlt: optionalText(record, 'alt'),
    imageCredit: optionalText(record, 'credit'),
    imageCreditUrl: optionalText(record, 'creditUrl'),
  };
}

function mapUpdate(client: SanityClient, item: SanityRecord) {
  return {
    documentId: normalizeDocumentId(stringField(item, '_id') || 'missing-id'),
    title: stringField(item, 'title'),
    slug: normalizeSlug(item.slug),
    kind: stringField(item, 'kind'),
    summary: stringField(item, 'summary'),
    body: stringField(item, 'body'),
    publishedOn: stringField(item, 'publishedOn'),
    sourceName: stringField(item, 'sourceName'),
    sourceUrl: stringField(item, 'sourceUrl'),
    sourceReviewedOn: stringField(item, 'sourceReviewedOn'),
    ...normalizeImageFields(client, item.image),
    featured: item.featured === true,
  };
}

function mapProject(client: SanityClient, item: SanityRecord) {
  return {
    documentId: normalizeDocumentId(stringField(item, '_id') || 'missing-id'),
    title: stringField(item, 'title'),
    slug: normalizeSlug(item.slug),
    category: stringField(item, 'category'),
    stage: stringField(item, 'stage'),
    summary: stringField(item, 'summary'),
    details: stringField(item, 'details'),
    updatedOn: stringField(item, 'updatedOn'),
    nextStep: optionalStringField(item, 'nextStep'),
    sourceName: stringField(item, 'sourceName'),
    sourceUrl: stringField(item, 'sourceUrl'),
    sourceReviewedOn: stringField(item, 'sourceReviewedOn'),
    ...normalizeImageFields(client, item.image),
    featured: item.featured === true,
  };
}

function mapEvent(item: SanityRecord) {
  return {
    documentId: normalizeDocumentId(stringField(item, '_id') || 'missing-id'),
    title: stringField(item, 'title'),
    slug: normalizeSlug(item.slug),
    summary: stringField(item, 'summary'),
    startsAt: stringField(item, 'startsAt'),
    endsAt: optionalStringField(item, 'endsAt'),
    location: stringField(item, 'location'),
    bookingUrl: optionalStringField(item, 'bookingUrl'),
    sourceUrl: stringField(item, 'sourceUrl'),
    sourceReviewedOn: stringField(item, 'sourceReviewedOn'),
    featured: item.featured === true,
  };
}

function relatedProjectId(item: SanityRecord): string | undefined {
  const related = item.relatedProject;
  if (typeof related === 'string') return related;
  if (isRecord(related)) {
    const ref = related._ref;
    if (typeof ref === 'string') return ref;
    const id = related._id;
    if (typeof id === 'string') return id;
  }
  return undefined;
}

function mapSurvey(item: SanityRecord) {
  return {
    documentId: normalizeDocumentId(stringField(item, '_id') || 'missing-id'),
    title: stringField(item, 'title'),
    slug: normalizeSlug(item.slug),
    stage: stringField(item, 'stage'),
    summary: stringField(item, 'summary'),
    opensOn: optionalStringField(item, 'opensOn'),
    closesOn: optionalStringField(item, 'closesOn'),
    responseUrl: optionalStringField(item, 'responseUrl'),
    sourceName: stringField(item, 'sourceName'),
    sourceUrl: stringField(item, 'sourceUrl'),
    sourceReviewedOn: stringField(item, 'sourceReviewedOn'),
    relatedProjectId: relatedProjectId(item),
  };
}

function mapDetail(entry: unknown, index: number) {
  const record = isRecord(entry) ? entry : {};
  return {
    id: index,
    label: stringField(record, 'label'),
    value: stringField(record, 'value'),
    showOnCard: record.showOnCard === true,
  };
}

function mapCollectionDate(entry: unknown, index: number) {
  const record = isRecord(entry) ? entry : {};
  return {
    id: index,
    date: stringField(record, 'date'),
    stream: stringField(record, 'stream'),
  };
}

function detailList(value: unknown) {
  return Array.isArray(value) ? value.map(mapDetail) : [];
}

function collectionDateList(value: unknown) {
  return Array.isArray(value) ? value.map(mapCollectionDate) : [];
}

function displayOrder(value: SanityRecord): number {
  const order = value.displayOrder;
  return typeof order === 'number' ? order : 100;
}

function mapResource(item: SanityRecord) {
  return {
    documentId: normalizeDocumentId(stringField(item, '_id') || 'missing-id'),
    title: stringField(item, 'title'),
    slug: normalizeSlug(item.slug),
    category: stringField(item, 'category'),
    serviceType: stringField(item, 'serviceType'),
    providerType: stringField(item, 'providerType'),
    description: stringField(item, 'description'),
    url: optionalStringField(item, 'url'),
    phone: optionalStringField(item, 'phone'),
    email: optionalStringField(item, 'email'),
    outOfHours: item.outOfHours === true,
    featured: item.featured === true,
    details: detailList(item.details),
    collectionDates: collectionDateList(item.collectionDates),
    documentUrl: optionalStringField(item, 'documentUrl'),
    documentLabel: optionalStringField(item, 'documentLabel'),
    displayOrder: displayOrder(item),
    sourceName: stringField(item, 'sourceName'),
    sourceUrl: stringField(item, 'sourceUrl'),
    sourceReviewedOn: stringField(item, 'sourceReviewedOn'),
  };
}

export class SanityContentSource implements ContentSource {
  readonly name = 'sanity' as const;
  private readonly imageClient: SanityClient;

  constructor(private readonly config: SanityContentConfig) {
    // Used only for image URL building (no network). Queries use plain
    // fetch against the Sanity Query API so tests can stub global fetch.
    this.imageClient = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      useCdn: false,
    });
  }

  private queryUrl(groq: string): string {
    const host =
      this.config.useCdn === true ? 'apicdn.sanity.io' : 'api.sanity.io';
    const base = `https://${this.config.projectId}.${host}/v${this.config.apiVersion}/data/query/${this.config.dataset}`;
    return `${base}?query=${encodeURIComponent(groq)}`;
  }

  private async query(label: string, groq: string): Promise<unknown> {
    const response = await fetch(this.queryUrl(groq), {
      headers: {
        Accept: 'application/json',
        ...(this.config.token
          ? { Authorization: `Bearer ${this.config.token}` }
          : {}),
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Sanity request to ${label} failed: ${message}`, {
        cause: error,
      });
    });

    if (!response.ok) {
      throw new Error(
        `Sanity request to ${label} failed with status ${response.status}.`,
      );
    }

    const body = sanityEnvelopeSchema.parse(await response.json());
    return body.result;
  }

  async loadSnapshot(): Promise<ContentSnapshot> {
    const [
      siteSettingRaw,
      updatesRaw,
      projectsRaw,
      eventsRaw,
      surveysRaw,
      resourcesRaw,
    ] = await Promise.all([
      this.query('siteSetting', siteSettingQuery),
      this.query('updates', updatesQuery),
      this.query('projects', projectsQuery),
      this.query('events', eventsQuery),
      this.query('surveys', surveysQuery),
      this.query('resources', resourcesQuery),
    ]);

    const site = sanitySiteSettingSchema.parse(siteSettingRaw);
    const updates = recordList(updatesRaw);
    const projects = recordList(projectsRaw);
    const events = recordList(eventsRaw);
    const surveys = recordList(surveysRaw);
    const resources = recordList(resourcesRaw);

    const snapshot: ContentSnapshot = {
      siteSetting: site
        ? {
            name: typeof site.name === 'string' ? site.name : '',
            location: typeof site.location === 'string' ? site.location : '',
            tagline: typeof site.tagline === 'string' ? site.tagline : '',
            introduction:
              typeof site.introduction === 'string' ? site.introduction : '',
            contactEmail:
              typeof site.contactEmail === 'string'
                ? site.contactEmail
                : undefined,
          }
        : undefined,
      updates: updates.map((item) =>
        updateSchema.parse(mapUpdate(this.imageClient, item)),
      ),
      projects: projects.map((item) =>
        projectSchema.parse(mapProject(this.imageClient, item)),
      ),
      events: events.map((item) => eventSchema.parse(mapEvent(item))),
      surveys: surveys.map((item) => surveySchema.parse(mapSurvey(item))),
      resources: resources.map((item) =>
        resourceSchema.parse(mapResource(item)),
      ),
    };

    return snapshot;
  }
}
