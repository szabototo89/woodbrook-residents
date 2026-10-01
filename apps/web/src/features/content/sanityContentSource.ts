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
    name: z
      .unknown()
      .optional()
      .transform((value) => (typeof value === 'string' ? value : ''))
      .describe('Raw site name value.'),
    location: z
      .unknown()
      .optional()
      .transform((value) => (typeof value === 'string' ? value : ''))
      .describe('Raw site location value.'),
    tagline: z
      .unknown()
      .optional()
      .transform((value) => (typeof value === 'string' ? value : ''))
      .describe('Raw site tagline value.'),
    introduction: z
      .unknown()
      .optional()
      .transform((value) => (typeof value === 'string' ? value : ''))
      .describe('Raw site introduction value.'),
    contactEmail: z
      .unknown()
      .optional()
      .transform((value) => (typeof value === 'string' ? value : undefined))
      .describe('Optional raw contact email value.'),
  })
  .nullable();

type SanityRecord = Record<string, unknown>;

function isRecord(value: unknown): value is SanityRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const sanityRequiredText = z
  .unknown()
  .optional()
  .transform((value) => (typeof value === 'string' ? value : ''))
  .describe('Lenient required text coerced from unknown.');

const sanityOptionalText = z
  .unknown()
  .optional()
  .transform((value) =>
    typeof value === 'string' && value.length > 0 ? value : undefined,
  )
  .describe('Lenient optional text coerced from unknown.');

const sanityOptionalTextPreserveEmpty = z
  .unknown()
  .optional()
  .transform((value) => (typeof value === 'string' ? value : undefined))
  .describe('Lenient optional text preserving empty strings.');

const sanityBoolean = z
  .unknown()
  .optional()
  .transform((value) => value === true)
  .describe('Lenient boolean coerced from unknown.');

const sanityDocumentId = z
  .unknown()
  .optional()
  .transform((value) => {
    const raw = typeof value === 'string' ? value : '';
    const id = raw.length > 0 ? raw : 'missing-id';
    return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id;
  })
  .describe('Lenient Sanity document ID with drafts prefix stripped.');

const sanitySlug = z
  .unknown()
  .optional()
  .transform((value) => {
    if (typeof value === 'string') return value;
    if (isRecord(value)) {
      const current = value.current;
      return typeof current === 'string' ? current : '';
    }
    return '';
  })
  .describe('Lenient Sanity slug coerced from string or slug object.');

const sanityImageRef = z
  .unknown()
  .optional()
  .transform((value) => {
    if (!isRecord(value)) return undefined;
    const asset = value.asset;
    if (!isRecord(asset)) return undefined;
    const ref = asset._ref;
    return typeof ref === 'string' ? ref : undefined;
  })
  .describe('Lenient Sanity image asset reference.');

const sanityRelatedProjectId = z
  .unknown()
  .optional()
  .transform((value) => {
    if (typeof value === 'string') return value;
    if (isRecord(value)) {
      const ref = value._ref;
      if (typeof ref === 'string') return ref;
      const id = value._id;
      if (typeof id === 'string') return id;
    }
    return undefined;
  })
  .describe('Lenient related project ID from string or reference.');

const sanityDisplayOrder = z
  .unknown()
  .optional()
  .transform((value) => (typeof value === 'number' ? value : 100))
  .describe('Lenient display order with fallback priority.');

const sanityRecordList = z
  .unknown()
  .optional()
  .transform((value) => (Array.isArray(value) ? value.filter(isRecord) : []))
  .describe('Lenient list of Sanity records.');

const sanityUpdateRawSchema = z.object({
  _id: sanityDocumentId.describe('Raw Sanity update document ID.'),
  title: sanityRequiredText.describe('Raw update title value.'),
  slug: sanitySlug.describe('Raw update slug value.'),
  kind: sanityRequiredText.describe('Raw update kind value.'),
  summary: sanityRequiredText.describe('Raw update summary value.'),
  body: sanityRequiredText.describe('Raw update body value.'),
  publishedOn: sanityRequiredText.describe('Raw update published date.'),
  sourceName: sanityRequiredText.describe('Raw update source name.'),
  sourceUrl: sanityRequiredText.describe('Raw update source URL.'),
  sourceReviewedOn: sanityRequiredText.describe(
    'Raw update source review date.',
  ),
  image: z.unknown().optional().describe('Raw Sanity image value.'),
  featured: sanityBoolean.describe('Raw update featured flag.'),
});

const sanityProjectRawSchema = z.object({
  _id: sanityDocumentId.describe('Raw Sanity project document ID.'),
  title: sanityRequiredText.describe('Raw project title value.'),
  slug: sanitySlug.describe('Raw project slug value.'),
  category: sanityRequiredText.describe('Raw project category value.'),
  stage: sanityRequiredText.describe('Raw project stage value.'),
  summary: sanityRequiredText.describe('Raw project summary value.'),
  details: sanityRequiredText.describe('Raw project details value.'),
  updatedOn: sanityRequiredText.describe('Raw project updated date.'),
  nextStep: sanityOptionalText.describe('Raw project next step value.'),
  sourceName: sanityRequiredText.describe('Raw project source name.'),
  sourceUrl: sanityRequiredText.describe('Raw project source URL.'),
  sourceReviewedOn: sanityRequiredText.describe(
    'Raw project source review date.',
  ),
  image: z.unknown().optional().describe('Raw Sanity image value.'),
  featured: sanityBoolean.describe('Raw project featured flag.'),
});

const sanityEventRawSchema = z.object({
  _id: sanityDocumentId.describe('Raw Sanity event document ID.'),
  title: sanityRequiredText.describe('Raw event title value.'),
  slug: sanitySlug.describe('Raw event slug value.'),
  summary: sanityRequiredText.describe('Raw event summary value.'),
  startsAt: sanityRequiredText.describe('Raw event start date.'),
  endsAt: sanityOptionalText.describe('Raw event end date.'),
  location: sanityRequiredText.describe('Raw event location value.'),
  bookingUrl: sanityOptionalText.describe('Raw event booking URL.'),
  sourceUrl: sanityRequiredText.describe('Raw event source URL.'),
  sourceReviewedOn: sanityRequiredText.describe(
    'Raw event source review date.',
  ),
  featured: sanityBoolean.describe('Raw event featured flag.'),
});

const sanitySurveyRawSchema = z.object({
  _id: sanityDocumentId.describe('Raw Sanity survey document ID.'),
  title: sanityRequiredText.describe('Raw survey title value.'),
  slug: sanitySlug.describe('Raw survey slug value.'),
  stage: sanityRequiredText.describe('Raw survey stage value.'),
  summary: sanityRequiredText.describe('Raw survey summary value.'),
  opensOn: sanityOptionalText.describe('Raw survey opening date.'),
  closesOn: sanityOptionalText.describe('Raw survey closing date.'),
  responseUrl: sanityOptionalText.describe('Raw survey response URL.'),
  sourceName: sanityRequiredText.describe('Raw survey source name.'),
  sourceUrl: sanityRequiredText.describe('Raw survey source URL.'),
  sourceReviewedOn: sanityRequiredText.describe(
    'Raw survey source review date.',
  ),
  relatedProject: sanityRelatedProjectId.describe('Raw related project value.'),
});

const sanityDetailListSchema = z
  .unknown()
  .optional()
  .transform((value) => {
    if (!Array.isArray(value)) return [];
    return value.map((entry, index) => {
      const record: SanityRecord = isRecord(entry) ? entry : {};
      const label = typeof record.label === 'string' ? record.label : '';
      const detailValue = typeof record.value === 'string' ? record.value : '';
      return {
        id: index,
        label,
        value: detailValue,
        showOnCard: record.showOnCard === true,
      };
    });
  })
  .describe('Lenient resource detail list with index IDs.');

const sanityCollectionDateListSchema = z
  .unknown()
  .optional()
  .transform((value) => {
    if (!Array.isArray(value)) return [];
    return value.map((entry, index) => {
      const record: SanityRecord = isRecord(entry) ? entry : {};
      const date = typeof record.date === 'string' ? record.date : '';
      const stream = typeof record.stream === 'string' ? record.stream : '';
      return { id: index, date, stream };
    });
  })
  .describe('Lenient collection date list with index IDs.');

const sanityResourceRawSchema = z.object({
  _id: sanityDocumentId.describe('Raw Sanity resource document ID.'),
  title: sanityRequiredText.describe('Raw resource title value.'),
  slug: sanitySlug.describe('Raw resource slug value.'),
  category: sanityRequiredText.describe('Raw resource category value.'),
  serviceType: sanityRequiredText.describe('Raw resource service type.'),
  providerType: sanityRequiredText.describe('Raw resource provider type.'),
  description: sanityRequiredText.describe('Raw resource description.'),
  url: sanityOptionalText.describe('Raw resource URL.'),
  phone: sanityOptionalText.describe('Raw resource phone number.'),
  email: sanityOptionalText.describe('Raw resource email address.'),
  outOfHours: sanityBoolean.describe('Raw resource out-of-hours flag.'),
  featured: sanityBoolean.describe('Raw resource featured flag.'),
  details: sanityDetailListSchema.describe('Raw resource details list.'),
  collectionDates: sanityCollectionDateListSchema.describe(
    'Raw resource collection dates.',
  ),
  documentUrl: sanityOptionalText.describe('Raw resource document URL.'),
  documentLabel: sanityOptionalText.describe('Raw resource document label.'),
  displayOrder: sanityDisplayOrder.describe('Raw resource display order.'),
  sourceName: sanityRequiredText.describe('Raw resource source name.'),
  sourceUrl: sanityRequiredText.describe('Raw resource source URL.'),
  sourceReviewedOn: sanityRequiredText.describe(
    'Raw resource source review date.',
  ),
});

function createImageUrl(
  client: SanityClient,
  ref: string | undefined,
): string | undefined {
  if (!ref) return undefined;
  try {
    return imageUrlBuilder(client)
      .image({ asset: { _ref: ref } })
      .url();
  } catch {
    return undefined;
  }
}

function normalizeImageFields(
  client: SanityClient,
  meta: { alt?: string; credit?: string; creditUrl?: string; ref?: string },
) {
  return {
    imagePath: createImageUrl(client, meta.ref),
    imageAlt: meta.alt,
    imageCredit: meta.credit,
    imageCreditUrl: meta.creditUrl,
  };
}

function parseImageMeta(image: unknown) {
  const record: SanityRecord = isRecord(image) ? image : {};
  return {
    alt: sanityOptionalTextPreserveEmpty.parse(record.alt),
    credit: sanityOptionalTextPreserveEmpty.parse(record.credit),
    creditUrl: sanityOptionalTextPreserveEmpty.parse(record.creditUrl),
    ref: sanityImageRef.parse(image),
  };
}

function mapUpdate(client: SanityClient, item: unknown) {
  const raw = sanityUpdateRawSchema.parse(item);
  const meta = parseImageMeta(raw.image);
  return {
    documentId: raw._id,
    title: raw.title,
    slug: raw.slug,
    kind: raw.kind,
    summary: raw.summary,
    body: raw.body,
    publishedOn: raw.publishedOn,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    sourceReviewedOn: raw.sourceReviewedOn,
    ...normalizeImageFields(client, meta),
    featured: raw.featured,
  };
}

function mapProject(client: SanityClient, item: unknown) {
  const raw = sanityProjectRawSchema.parse(item);
  const meta = parseImageMeta(raw.image);
  return {
    documentId: raw._id,
    title: raw.title,
    slug: raw.slug,
    category: raw.category,
    stage: raw.stage,
    summary: raw.summary,
    details: raw.details,
    updatedOn: raw.updatedOn,
    nextStep: raw.nextStep,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    sourceReviewedOn: raw.sourceReviewedOn,
    ...normalizeImageFields(client, meta),
    featured: raw.featured,
  };
}

function mapEvent(item: unknown) {
  const raw = sanityEventRawSchema.parse(item);
  return {
    documentId: raw._id,
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary,
    startsAt: raw.startsAt,
    endsAt: raw.endsAt,
    location: raw.location,
    bookingUrl: raw.bookingUrl,
    sourceUrl: raw.sourceUrl,
    sourceReviewedOn: raw.sourceReviewedOn,
    featured: raw.featured,
  };
}

function mapSurvey(item: unknown) {
  const raw = sanitySurveyRawSchema.parse(item);
  return {
    documentId: raw._id,
    title: raw.title,
    slug: raw.slug,
    stage: raw.stage,
    summary: raw.summary,
    opensOn: raw.opensOn,
    closesOn: raw.closesOn,
    responseUrl: raw.responseUrl,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    sourceReviewedOn: raw.sourceReviewedOn,
    relatedProjectId: raw.relatedProject,
  };
}

function mapResource(item: unknown) {
  const raw = sanityResourceRawSchema.parse(item);
  return {
    documentId: raw._id,
    title: raw.title,
    slug: raw.slug,
    category: raw.category,
    serviceType: raw.serviceType,
    providerType: raw.providerType,
    description: raw.description,
    url: raw.url,
    phone: raw.phone,
    email: raw.email,
    outOfHours: raw.outOfHours,
    featured: raw.featured,
    details: raw.details,
    collectionDates: raw.collectionDates,
    documentUrl: raw.documentUrl,
    documentLabel: raw.documentLabel,
    displayOrder: raw.displayOrder,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    sourceReviewedOn: raw.sourceReviewedOn,
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
    const updates = sanityRecordList.parse(updatesRaw);
    const projects = sanityRecordList.parse(projectsRaw);
    const events = sanityRecordList.parse(eventsRaw);
    const surveys = sanityRecordList.parse(surveysRaw);
    const resources = sanityRecordList.parse(resourcesRaw);

    const snapshot: ContentSnapshot = {
      siteSetting: site ?? undefined,
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
