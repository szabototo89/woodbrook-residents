import { z } from 'zod';

const optionalString = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);

export const siteSettingSchema = z.object({
  name: z.string(),
  location: z.string(),
  tagline: z.string(),
  introduction: z.string(),
  contactEmail: optionalString,
});

export const updateSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  kind: z.enum(['news', 'planning', 'transport', 'community']),
  summary: z.string(),
  body: z.string(),
  publishedOn: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string(),
  sourceReviewedOn: z.string(),
  imagePath: optionalString,
  imageAlt: optionalString,
  imageCredit: optionalString,
  imageCreditUrl: optionalString,
  featured: z.boolean().default(false),
});

export const projectSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.enum([
    'transport',
    'housing',
    'parks',
    'public-realm',
    'community',
  ]),
  stage: z.enum(['monitoring', 'consultation', 'active', 'completed']),
  summary: z.string(),
  details: z.string(),
  updatedOn: z.string(),
  nextStep: optionalString,
  sourceName: z.string(),
  sourceUrl: z.string(),
  sourceReviewedOn: z.string(),
  imagePath: optionalString,
  imageAlt: optionalString,
  imageCredit: optionalString,
  imageCreditUrl: optionalString,
  featured: z.boolean().default(false),
});

export const eventSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  startsAt: z.string(),
  endsAt: optionalString,
  location: z.string(),
  bookingUrl: optionalString,
  sourceUrl: z.string(),
  sourceReviewedOn: z.string(),
});

export const surveySchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  stage: z.enum(['upcoming', 'open', 'closed']),
  summary: z.string(),
  opensOn: optionalString,
  closesOn: optionalString,
  responseUrl: optionalString,
  sourceName: z.string(),
  sourceUrl: z.string(),
  sourceReviewedOn: z.string(),
});

export const resourceSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  category: z.enum([
    'transport',
    'council',
    'community',
    'safety',
    'waste',
    'recreation',
  ]),
  description: z.string(),
  url: optionalString,
  phone: optionalString,
  email: optionalString,
  displayOrder: z.number(),
  sourceReviewedOn: z.string(),
});
