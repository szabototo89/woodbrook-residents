import {
  priceCategoryError,
  type PriceCategory,
} from '../../../shared/lauraPricing';
import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { z } from 'zod';

import {
  selectHomeGalleryCollections,
  splitTitleLines,
  type CmsImage,
  type CmsHero,
  type CmsService,
  type CmsGalleryItem,
  type CmsGalleryCollection,
  type CmsSettings,
  type HomeData,
  type AboutData,
  type ServicesData,
  type GalleryData,
  type PricesData,
} from '../src/features/site/lauraSanity';

export type LauraSanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

export type LauraSanityEnv = Record<string, string | undefined>;

const DEFAULT_PROJECT_ID = 'uag6kepo';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2025-09-01';

function isStringEntry(entry: [string, unknown]): entry is [string, string] {
  return typeof entry[1] === 'string';
}

function processEnv(): LauraSanityEnv {
  if (typeof process === 'undefined' || !process.env) return {};
  return Object.fromEntries(Object.entries(process.env).filter(isStringEntry));
}

function defaultEnv(): LauraSanityEnv {
  const meta = import.meta.env;
  const metaEntries = meta ? Object.entries(meta).filter(isStringEntry) : [];
  return { ...processEnv(), ...Object.fromEntries(metaEntries) };
}

function pick(env: LauraSanityEnv, ...names: string[]): string {
  return names.map((name) => env[name]?.trim()).find((value) => value) ?? '';
}

export function resolveLauraSanityConfig(
  env: LauraSanityEnv = defaultEnv(),
): LauraSanityConfig {
  return {
    projectId:
      pick(env, 'VITE_SANITY_PROJECT_ID', 'SANITY_PROJECT_ID') ||
      DEFAULT_PROJECT_ID,
    dataset:
      pick(env, 'VITE_SANITY_DATASET', 'SANITY_DATASET') || DEFAULT_DATASET,
    apiVersion:
      pick(env, 'VITE_SANITY_API_VERSION', 'SANITY_API_VERSION') ||
      DEFAULT_API_VERSION,
  };
}

// Normalize absent CMS content once, before it reaches page components.
const textSchema = z
  .string()
  .nullish()
  .transform((value) => value?.trim() ?? '');
const optionalNumberSchema = z
  .number()
  .nullish()
  .transform((value) => value ?? undefined);
const optionalObject = <T extends z.ZodRawShape>(shape: T) =>
  z.preprocess((value) => value ?? {}, z.object(shape).catchall(z.unknown()));
const listSchema = <T extends z.ZodType>(schema: T) =>
  z
    .array(schema.nullish())
    .nullish()
    .transform((value) =>
      (value ?? []).filter((item): item is z.output<T> => item != null),
    );
const timestampFields = {
  _createdAt: textSchema,
  _updatedAt: textSchema,
};
function displayOrder(item: {
  order?: number;
  _createdAt: string;
  _updatedAt: string;
}): number {
  if (item.order !== undefined) return item.order;
  return (
    [item._createdAt, item._updatedAt]
      .map((timestamp) => Date.parse(timestamp))
      .find(Number.isFinite) ?? Number.MAX_SAFE_INTEGER
  );
}

const sanityImageSchema = optionalObject({
  asset: z
    .object({ _ref: textSchema.describe('Sanity image asset reference') })
    .nullish()
    .describe('Image asset pointer'),
  hotspot: z
    .object({
      x: optionalNumberSchema.describe('Horizontal focal point'),
      y: optionalNumberSchema.describe('Vertical focal point'),
      height: optionalNumberSchema.describe('Focal point height'),
      width: optionalNumberSchema.describe('Focal point width'),
    })
    .nullish()
    .transform((value) =>
      value &&
      value.x !== undefined &&
      value.y !== undefined &&
      value.height !== undefined &&
      value.width !== undefined
        ? { x: value.x, y: value.y, height: value.height, width: value.width }
        : undefined,
    )
    .describe('Editor-chosen focal point for crops'),
});

export type SanityImageValue = z.infer<typeof sanityImageSchema>;

const heroSchema = optionalObject({
  eyebrow: textSchema.describe('Small heading above the banner title'),
  title: textSchema.describe('Banner heading, one line per row'),
  description: textSchema.describe('Banner introduction paragraph'),
  image: sanityImageSchema.describe('Banner artwork'),
  imageAlt: textSchema.describe('Banner artwork alt text'),
  ctaLabel: textSchema.describe('Banner button text, if any'),
});

const seoSchema = optionalObject({
  title: textSchema.describe('Search listing title'),
  description: textSchema.describe('Search listing description'),
});

const announcementSchema = z.preprocess(
  (value) =>
    value &&
    typeof value === 'object' &&
    'enabled' in value &&
    value.enabled === true
      ? value
      : undefined,
  z
    .object({
      title: textSchema.describe('Announcement heading'),
      message: textSchema.describe('Announcement message'),
      link: z
        .object({
          label: textSchema.describe('Announcement action text'),
          href: z
            .union([
              z
                .string()
                .trim()
                .regex(/^\/(?![/\\])/),
              z.url({ protocol: /^https?$/ }),
              z.literal(''),
            ])
            .nullish()
            .transform((value) => value ?? '')
            .describe('Site path or HTTP(S) link'),
        })
        .nullish()
        .transform((value) => value ?? undefined)
        .describe('Optional announcement action'),
    })
    .optional()
    .transform((value) =>
      value?.title && value.message
        ? {
            ...value,
            link: value.link?.label && value.link.href ? value.link : undefined,
          }
        : undefined,
    ),
);

const settingsSchema = optionalObject({
  contactEmail: textSchema.describe('Shared contact email address'),
  contactPhone: textSchema.describe('Shared contact phone number'),
  contactMailtoSubject: textSchema.describe('Prefilled email subject'),
  contactEyebrow: textSchema.describe('Contact strip tagline'),
  contactHeading: textSchema.describe('Contact strip heading'),
  contactCopy: textSchema.describe('Contact strip invitation'),
});

const serviceSchema = optionalObject({
  title: textSchema.describe('Service name'),
  slug: optionalObject({
    current: textSchema.describe('URL-safe service name'),
  }).describe('Stable web address name'),
  description: textSchema.describe('Short service description'),
  image: sanityImageSchema.describe('Service photo'),
  imageAlt: textSchema.describe('Service photo alt text'),
  ...timestampFields,
  order: optionalNumberSchema.describe('Display order, lower first'),
});

const galleryItemSchema = optionalObject({
  image: sanityImageSchema.describe('Artwork photo'),
  imageAlt: textSchema.describe('Artwork alt text'),
  saleStatus: z
    .enum(['for-sale', 'not-for-sale', 'none'])
    .optional()
    .catch(undefined)
    .describe('Optional published sale availability; none hides the badge'),
  ...timestampFields,
  order: optionalNumberSchema.describe('Display order, lower first'),
});

const galleryCollectionSchema = optionalObject({
  title: textSchema.describe('Collection title'),
  slug: optionalObject({
    current: textSchema.describe('URL-safe collection name'),
  }).describe('Stable web address name'),
  description: textSchema.describe('Collection description'),
  ...timestampFields,
  order: optionalNumberSchema.describe('Display order, lower first'),
  photos: listSchema(galleryItemSchema.describe('Collection picture')).describe(
    'Pictures in browsing order',
  ),
});

const homeQuery = `{
  "home": *[_id == "homePage"][0],
  "settings": *[_id == "siteSettings"][0],
  "services": *[_type == "service"] | order(order asc),
  "collections": *[_type == "galleryCollection"] | order(order asc) {
    title, slug, description, order, _createdAt, _updatedAt,
    "photos": photos[]-> { image, imageAlt, saleStatus, order, _createdAt, _updatedAt }
  }
}`;

const aboutQuery = `{
  "about": *[_id == "aboutPage"][0],
  "settings": *[_id == "siteSettings"][0]
}`;

const servicesQuery = `{
  "page": *[_id == "servicesPage"][0],
  "settings": *[_id == "siteSettings"][0],
  "services": *[_type == "service"] | order(order asc)
}`;

const galleryQuery = `{
  "page": *[_id == "galleryPage"][0],
  "settings": *[_id == "siteSettings"][0],
  "collections": *[_type == "galleryCollection"] | order(order asc) {
    title, slug, description, order, _createdAt, _updatedAt,
    "photos": photos[]-> { image, imageAlt, saleStatus, order, _createdAt, _updatedAt }
  }
}`;

const settingsQuery = `*[_id == "siteSettings"][0]`;

const imageClients = new Map<string, SanityClient>();

function imageClientFor(config: LauraSanityConfig): SanityClient {
  const key = `${config.projectId}/${config.dataset}`;
  const existing = imageClients.get(key);
  if (existing) return existing;
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: false,
  });
  imageClients.set(key, client);
  return client;
}

export function artworkUrl(
  config: LauraSanityConfig,
  image: unknown,
  width: number,
  height?: number,
): string | undefined {
  const parsed = sanityImageSchema.safeParse(image);
  if (!parsed.success || !parsed.data.asset?._ref) return undefined;
  const source: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number; height: number; width: number };
  } = { asset: { _ref: parsed.data.asset._ref } };
  if (parsed.data.hotspot) {
    source.hotspot = parsed.data.hotspot;
  }
  try {
    const base = imageUrlBuilder(imageClientFor(config))
      .image(source)
      .width(width)
      .auto('format');
    const sized =
      height === undefined
        ? base
        : base.height(height).fit('crop').crop('focalpoint');
    return sized.url();
  } catch {
    return undefined;
  }
}

function mapImage(
  config: LauraSanityConfig,
  image: unknown,
  alt: string,
  width: number,
  height?: number,
): CmsImage {
  const url = artworkUrl(config, image, width, height);
  return { url: url ?? '', alt };
}

function mapHero(
  config: LauraSanityConfig,
  fallbackTitle: string,
  hero: z.infer<typeof heroSchema>,
  width: number,
  height?: number,
): CmsHero {
  return {
    eyebrow: hero.eyebrow,
    titleLines: splitTitleLines(hero.title || fallbackTitle),
    description: hero.description,
    image: mapImage(config, hero.image, hero.imageAlt, width, height),
    ctaLabel: hero.ctaLabel,
  };
}

function mapService(
  config: LauraSanityConfig,
  item: z.infer<typeof serviceSchema>,
): CmsService {
  return {
    title: item.title || 'Creative service',
    slug: item.slug.current,
    description: item.description,
    image: mapImage(config, item.image, item.imageAlt, 1448, 1086),
    order: displayOrder(item),
  };
}

function mapGalleryItem(
  config: LauraSanityConfig,
  item: z.infer<typeof galleryItemSchema>,
  collectionTitle: string,
): CmsGalleryItem {
  return {
    alt: item.imageAlt || `${collectionTitle} — artwork`,
    saleStatus: item.saleStatus,
    image: mapImage(
      config,
      item.image,
      item.imageAlt || `${collectionTitle} — artwork`,
      640,
      480,
    ),
    fullImage: mapImage(
      config,
      item.image,
      item.imageAlt || `${collectionTitle} — artwork`,
      1280,
    ),
    order: displayOrder(item),
  };
}

function mapGalleryCollection(
  config: LauraSanityConfig,
  item: z.infer<typeof galleryCollectionSchema>,
): CmsGalleryCollection {
  return {
    title: item.title || 'Untitled collection',
    slug: item.slug.current,
    description: item.description,
    order: displayOrder(item),
    photos: item.photos
      .map((photo) =>
        mapGalleryItem(config, photo, item.title || 'Untitled collection'),
      )
      .filter((photo) => photo.image.url && photo.fullImage.url)
      .sort((a, b) => a.order - b.order),
  };
}

function mapSettings(settings: z.infer<typeof settingsSchema>): CmsSettings {
  return {
    email: settings.contactEmail,
    phone: settings.contactPhone,
    mailtoSubject: settings.contactMailtoSubject,
    eyebrow: settings.contactEyebrow,
    heading: settings.contactHeading,
    copy: settings.contactCopy,
  };
}

function parseDoc<T>(label: string, schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'document'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Sanity ${label} is invalid: ${detail}`);
  }
  return parsed.data;
}

const homeSchema = optionalObject({
  home: z.unknown().optional().describe('Published homePage singleton'),
  settings: z.unknown().optional().describe('Published siteSettings singleton'),
  services: listSchema(z.unknown()).describe('Raw service documents'),
  collections: listSchema(z.unknown()).describe(
    'Raw gallery collection documents',
  ),
});

export class LauraSanitySource {
  constructor(
    private readonly config: LauraSanityConfig = resolveLauraSanityConfig(),
  ) {}

  private queryUrl(groq: string): string {
    const base = `https://${this.config.projectId}.api.sanity.io/v${this.config.apiVersion}/data/query/${this.config.dataset}`;
    return `${base}?perspective=published&query=${encodeURIComponent(groq)}`;
  }

  private async query<T>(
    label: string,
    groq: string,
    schema: z.ZodType<T>,
  ): Promise<T> {
    const response = await fetch(this.queryUrl(groq), {
      headers: { Accept: 'application/json' },
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

    const body = z
      .object({ result: z.unknown().describe('GROQ response payload') })
      .parse(await response.json());
    return parseDoc(label, schema, body.result);
  }

  async loadHome(): Promise<HomeData> {
    const data = await this.query('home page', homeQuery, homeSchema);
    const home = parseDoc(
      'homePage',
      optionalObject({
        hero: heroSchema.describe('Home page banner'),
        announcement: announcementSchema.describe(
          'Optional homepage announcement',
        ),
        servicesHeading: textSchema.describe('Services section heading'),
        muralEyebrow: textSchema.describe('Mural section tagline'),
        muralHeading: textSchema.describe('Mural section heading'),
        muralCopy: textSchema.describe('Mural section text'),
        muralCtaLabel: textSchema.describe('Mural button text'),
        muralImage: sanityImageSchema.describe('Mural section artwork'),
        muralImageAlt: textSchema.describe('Mural artwork alt text'),
        galleryHeading: textSchema.describe('Gallery preview heading'),
        aboutImage: sanityImageSchema.describe('About preview photo'),
        aboutImageAlt: textSchema.describe('About preview photo alt text'),
        aboutHeading: textSchema.describe('About preview heading'),
        aboutCopy: textSchema.describe('About preview text'),
        testimonialQuote: textSchema.describe('Client quote'),
        testimonialAuthor: textSchema.describe('Quote author name'),
        testimonialRole: textSchema.describe('Quote author role'),
        seo: seoSchema.describe('Home search listing'),
      }),
      data.home,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );
    const services = data.services
      .map((item) =>
        mapService(this.config, parseDoc('service', serviceSchema, item)),
      )
      .filter((item) => item.slug)
      .sort((a, b) => a.order - b.order);
    const galleryPreview = selectHomeGalleryCollections(
      data.collections
        .map((item) =>
          mapGalleryCollection(
            this.config,
            parseDoc('galleryCollection', galleryCollectionSchema, item),
          ),
        )
        .filter((item) => item.slug && item.photos.length > 0)
        .sort((a, b) => a.order - b.order),
    );

    return {
      hero: mapHero(this.config, 'Laura Faichney', home.hero, 1374),
      announcement: home.announcement,
      servicesHeading: home.servicesHeading,
      mural: {
        eyebrow: home.muralEyebrow,
        heading: home.muralHeading,
        copy: home.muralCopy,
        ctaLabel: home.muralCtaLabel,
        image: mapImage(this.config, home.muralImage, home.muralImageAlt, 1254),
      },
      galleryHeading: home.galleryHeading,
      about: {
        heading: home.aboutHeading,
        copy: home.aboutCopy,
        image: mapImage(
          this.config,
          home.aboutImage,
          home.aboutImageAlt,
          1448,
          1086,
        ),
      },
      testimonial: {
        quote: home.testimonialQuote,
        author: home.testimonialAuthor,
        role: home.testimonialRole,
      },
      seo: home.seo,
      services,
      collections: galleryPreview,
      settings,
    };
  }

  async loadAbout(): Promise<AboutData> {
    const data = await this.query(
      'about page',
      aboutQuery,
      optionalObject({
        about: z.unknown().optional().describe('Published aboutPage singleton'),
        settings: z
          .unknown()
          .optional()
          .describe('Published siteSettings singleton'),
      }),
    );
    const about = parseDoc(
      'aboutPage',
      optionalObject({
        hero: heroSchema.describe('About page banner'),
        values: listSchema(
          optionalObject({
            icon: textSchema.describe('Strength symbol key'),
            title: textSchema.describe('Strength title'),
            text: textSchema.describe('Strength sentence'),
          }).describe('About strength entry'),
        ).describe('About strengths'),
        storyHeading: textSchema.describe('Story heading'),
        storyBody: textSchema.describe('Story text'),
        storyImage: sanityImageSchema.describe('Story portrait'),
        storyImageAlt: textSchema.describe('Story portrait alt text'),
        seo: seoSchema.describe('About search listing'),
      }),
      data.about,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );

    return {
      hero: mapHero(this.config, 'About', about.hero, 1374),
      values: about.values
        .filter((value) => value.title || value.text)
        .map((value) => ({
          icon: value.icon,
          title: value.title,
          text: value.text,
        })),
      storyHeading: about.storyHeading,
      storyBody: about.storyBody,
      storyImage: mapImage(
        this.config,
        about.storyImage,
        about.storyImageAlt,
        1122,
      ),
      seo: about.seo,
      settings,
    };
  }

  async loadServices(): Promise<ServicesData> {
    const data = await this.query(
      'services page',
      servicesQuery,
      optionalObject({
        page: z
          .unknown()
          .optional()
          .describe('Published servicesPage singleton'),
        settings: z
          .unknown()
          .optional()
          .describe('Published siteSettings singleton'),
        services: listSchema(z.unknown()).describe('Raw service documents'),
      }),
    );
    const page = parseDoc(
      'servicesPage',
      optionalObject({
        hero: heroSchema.describe('Services page banner'),
        seo: seoSchema.describe('Services search listing'),
      }),
      data.page,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );
    const services = data.services
      .map((item) =>
        mapService(this.config, parseDoc('service', serviceSchema, item)),
      )
      .filter((item) => item.slug)
      .sort((a, b) => a.order - b.order);

    return {
      hero: mapHero(this.config, 'Services', page.hero, 1374),
      seo: page.seo,
      services,
      settings,
    };
  }

  async loadPrices(): Promise<PricesData> {
    const requiredText = z.string().trim().min(1);
    const data = await this.query(
      'pricesPage',
      `{
      "page": *[_id == "pricesPage"][0] {
        ..., categories[] { ..., "serviceSlug": service->slug.current }
      }
    }`,
      z.object({
        page: z
          .object({
            eyebrow: textSchema.describe('Small heading above the page title'),
            title: requiredText.describe('Prices page heading'),
            introduction: requiredText.describe('Short introduction'),
            fallbackQuote: requiredText.describe(
              'Label for a category without rates',
            ),
            fallbackGuidance: requiredText.describe(
              'Quote requirements for a category without rates',
            ),
            enquiryLabel: requiredText.describe(
              'Category enquiry link wording',
            ),
            contactHeading: requiredText.describe('Contact invitation heading'),
            contactCopy: requiredText.describe('Contact invitation copy'),
            inspiration: listSchema(
              optionalObject({
                image: sanityImageSchema.describe(
                  'Optional inspiration artwork',
                ),
                imageAlt: requiredText.describe('Describe the artwork'),
              }),
            )
              .refine(
                (images) => images.length <= 3,
                'Use at most three inspiration pictures.',
              )
              .describe('Optional gallery inspiration pictures'),
            sharedNotes: listSchema(requiredText).describe(
              'Visible shared pricing qualifications',
            ),
            categories: z
              .array(
                z.custom<PriceCategory>().superRefine((category, context) => {
                  const error = priceCategoryError(category);
                  if (error) {
                    context.addIssue({ code: 'custom', message: error });
                    return;
                  }
                  if (
                    category &&
                    category.serviceSlug != null &&
                    (typeof category.serviceSlug !== 'string' ||
                      !category.serviceSlug.trim())
                  ) {
                    context.addIssue({
                      code: 'custom',
                      message:
                        'service: Select a published service with a slug, or remove the reference.',
                    });
                  }
                  if (
                    category &&
                    'service' in category &&
                    category.service &&
                    !category.serviceSlug
                  ) {
                    context.addIssue({
                      code: 'custom',
                      message:
                        'service: The linked service must be published with a slug.',
                    });
                  }
                }),
              )
              .min(1)
              .describe('Independent pricing categories in editorial order'),
            seo: z
              .object({
                title: requiredText.describe('Prices search title'),
                description: requiredText.describe('Prices search description'),
              })
              .describe('Required Prices metadata'),
          })
          .describe('Required published Prices singleton'),
      }),
    );
    return {
      ...data.page,
      inspiration: data.page.inspiration
        .map((item) =>
          mapImage(this.config, item.image, item.imageAlt, 768, 480),
        )
        .filter((image) => image.url),
    };
  }

  async loadGallery(): Promise<GalleryData> {
    const data = await this.query(
      'gallery page',
      galleryQuery,
      optionalObject({
        page: z
          .unknown()
          .optional()
          .describe('Published galleryPage singleton'),
        settings: z
          .unknown()
          .optional()
          .describe('Published siteSettings singleton'),
        collections: listSchema(z.unknown()).describe(
          'Raw gallery collection documents',
        ),
      }),
    );
    const page = parseDoc(
      'galleryPage',
      optionalObject({
        hero: heroSchema.describe('Gallery page banner'),
        seo: seoSchema.describe('Gallery search listing'),
      }),
      data.page,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );
    const collections = data.collections
      .map((item) =>
        mapGalleryCollection(
          this.config,
          parseDoc('galleryCollection', galleryCollectionSchema, item),
        ),
      )
      .filter((item) => item.slug && item.photos.length > 0)
      .sort((a, b) => a.order - b.order);

    return {
      hero: mapHero(this.config, 'Gallery', page.hero, 1374),
      seo: page.seo,
      collections,
      settings,
    };
  }

  async loadSettings(): Promise<CmsSettings> {
    const data = await this.query(
      'site settings',
      settingsQuery,
      settingsSchema,
    );
    return mapSettings(data);
  }
}
