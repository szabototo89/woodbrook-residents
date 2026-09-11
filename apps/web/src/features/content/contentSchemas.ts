import { z } from 'zod';

import {
  projectCategories,
  projectStages,
  providerTypes,
  resourceCategories,
  surveyStages,
  updateKinds,
} from './contentTaxonomy';

const optionalString = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);

export const siteSettingSchema = z.object({
  name: z.string().describe('Public name of the community website.'),
  location: z.string().describe('Area served by the community website.'),
  tagline: z.string().describe('Short statement of the website purpose.'),
  introduction: z.string().describe('Homepage introduction for residents.'),
  contactEmail: optionalString.describe(
    'Optional public contact email address.',
  ),
});

export const updateSchema = z.object({
  documentId: z.string().describe('Stable source-independent record ID.'),
  title: z.string().describe('Public update title.'),
  slug: z.string().describe('URL-safe update route slug.'),
  kind: z
    .enum(updateKinds)
    .describe('Editorial category used to label the update.'),
  summary: z.string().describe('Short update summary used on cards.'),
  body: z.string().describe('Long-form update content.'),
  publishedOn: z.string().describe('ISO date when the update was published.'),
  sourceName: z.string().describe('Name of the factual source.'),
  sourceUrl: z.string().describe('Public URL of the factual source.'),
  sourceReviewedOn: z
    .string()
    .describe('ISO date when the factual source was last checked.'),
  imagePath: optionalString.describe(
    'Optional local path or public image URL.',
  ),
  imageAlt: optionalString.describe('Alternative text for the update image.'),
  imageCredit: optionalString.describe('Visible image attribution.'),
  imageCreditUrl: optionalString.describe(
    'Optional URL for image attribution.',
  ),
  featured: z
    .boolean()
    .default(false)
    .describe('Whether the update is eligible for prominent placement.'),
});

export const projectSchema = z.object({
  documentId: z.string().describe('Stable source-independent record ID.'),
  title: z.string().describe('Public project title.'),
  slug: z.string().describe('URL-safe project route slug.'),
  category: z
    .enum(projectCategories)
    .describe('Subject category used to group the project.'),
  stage: z
    .enum(projectStages)
    .describe('Current public lifecycle stage of the project.'),
  summary: z.string().describe('Short project summary used on cards.'),
  details: z.string().describe('Long-form project description.'),
  updatedOn: z.string().describe('ISO date of the latest project review.'),
  nextStep: optionalString.describe('Latest known next action or milestone.'),
  sourceName: z.string().describe('Name of the official project source.'),
  sourceUrl: z.string().describe('Public URL of the official project source.'),
  sourceReviewedOn: z
    .string()
    .describe('ISO date when the project source was last checked.'),
  imagePath: optionalString.describe(
    'Optional local path or public image URL.',
  ),
  imageAlt: optionalString.describe('Alternative text for the project image.'),
  imageCredit: optionalString.describe('Visible image attribution.'),
  imageCreditUrl: optionalString.describe(
    'Optional URL for image attribution.',
  ),
  featured: z
    .boolean()
    .default(false)
    .describe('Whether the project is eligible for prominent placement.'),
});

export const eventSchema = z.object({
  documentId: z.string().describe('Stable source-independent record ID.'),
  title: z.string().describe('Public event title.'),
  slug: z.string().describe('URL-safe event route slug.'),
  summary: z.string().describe('Short public event description.'),
  startsAt: z.string().describe('ISO date-time when the event starts.'),
  endsAt: optionalString.describe(
    'Optional ISO date-time when the event ends.',
  ),
  location: z.string().describe('Human-readable event venue or location.'),
  bookingUrl: optionalString.describe('Optional registration or booking URL.'),
  sourceUrl: z.string().describe('Public URL of the event source.'),
  sourceReviewedOn: z
    .string()
    .describe('ISO date when the event source was last checked.'),
});

export const surveySchema = z.object({
  documentId: z.string().describe('Stable source-independent record ID.'),
  title: z.string().describe('Public consultation title.'),
  slug: z.string().describe('URL-safe consultation route slug.'),
  stage: z.enum(surveyStages).describe('Current consultation lifecycle stage.'),
  summary: z.string().describe('Short public consultation summary.'),
  opensOn: optionalString.describe('Optional ISO consultation opening date.'),
  closesOn: optionalString.describe('Optional ISO consultation closing date.'),
  responseUrl: optionalString.describe(
    'Optional URL for submitting a response.',
  ),
  sourceName: z.string().describe('Name of the consultation source.'),
  sourceUrl: z.string().describe('Public URL of the consultation source.'),
  sourceReviewedOn: z
    .string()
    .describe('ISO date when the consultation source was last checked.'),
  relatedProjectId: optionalString.describe(
    'Optional stable ID of a related published project.',
  ),
});

const resourceDetailSchema = z.object({
  id: z.number().describe('Source-provided or generated detail identifier.'),
  label: z.string().describe('Public label for the resource detail.'),
  value: z.string().describe('Public value for the resource detail.'),
  showOnCard: z
    .boolean()
    .default(false)
    .describe('Whether this detail is visible on directory cards.'),
});

const collectionDateSchema = z.object({
  id: z.number().describe('Source-provided or generated collection date ID.'),
  date: z.string().describe('ISO date for the waste collection.'),
  stream: z
    .enum(['recycling', 'waste-compost'])
    .describe('Waste stream collected on this date.'),
});

export const resourceSchema = z.object({
  documentId: z.string().describe('Stable source-independent record ID.'),
  title: z.string().describe('Public service or provider name.'),
  slug: z.string().describe('URL-safe local-information route slug.'),
  category: z
    .enum(resourceCategories)
    .describe('Directory category used for filtering.'),
  serviceType: z.string().describe('Human-readable type of service.'),
  providerType: z
    .enum(providerTypes)
    .describe('Kind of organisation providing the service.'),
  description: z.string().describe('Short public service description.'),
  url: optionalString.describe('Optional provider website URL.'),
  phone: optionalString.describe('Optional public telephone number.'),
  email: optionalString.describe('Optional public email address.'),
  outOfHours: z
    .boolean()
    .default(false)
    .describe('Whether a separate out-of-hours contact is available.'),
  featured: z
    .boolean()
    .default(false)
    .describe('Whether the resource is eligible for local highlighting.'),
  details: z
    .array(resourceDetailSchema)
    .default([])
    .describe('Additional public label and value details.'),
  collectionDates: z
    .array(collectionDateSchema)
    .default([])
    .describe('Structured waste collection dates, when applicable.'),
  documentUrl: optionalString.describe('Optional supporting document URL.'),
  documentLabel: optionalString.describe('Public label for the document link.'),
  displayOrder: z.number().describe('Numeric directory display priority.'),
  sourceName: z.string().describe('Name of the local-information source.'),
  sourceUrl: z.string().describe('Public URL of the local-information source.'),
  sourceReviewedOn: z
    .string()
    .describe('ISO date when the local-information source was checked.'),
});

export const contentSnapshotSchema = z.object({
  siteSetting: siteSettingSchema
    .optional()
    .describe('Optional global site identity and contact settings.'),
  updates: z
    .array(updateSchema)
    .describe('Published updates in display order.'),
  projects: z
    .array(projectSchema)
    .describe('Published projects in display order.'),
  events: z.array(eventSchema).describe('Published events in display order.'),
  surveys: z
    .array(surveySchema)
    .describe('Published consultations in display order.'),
  resources: z
    .array(resourceSchema)
    .describe('Published local-information entries in display order.'),
});
