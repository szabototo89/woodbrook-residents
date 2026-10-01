import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { z } from 'zod';

import { createPageHead } from '../../app/siteMetadata';

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

const sanityImageSchema = z.object({
  asset: z
    .object({ _ref: z.string().describe('Sanity image asset reference') })
    .describe('Image asset pointer'),
  hotspot: z
    .object({
      x: z.number().describe('Focal point horizontal position'),
      y: z.number().describe('Focal point vertical position'),
      height: z.number().describe('Focal point height'),
      width: z.number().describe('Focal point width'),
    })
    .optional()
    .describe('Editor-chosen focal point for crops'),
});

export type SanityImageValue = z.infer<typeof sanityImageSchema>;

const heroSchema = z
  .object({
    eyebrow: z.string().describe('Small heading above the banner title'),
    title: z.string().describe('Banner heading, one line per row'),
    description: z.string().describe('Banner introduction paragraph'),
    image: sanityImageSchema.describe('Banner artwork'),
    imageAlt: z.string().describe('Banner artwork alt text'),
    ctaLabel: z.string().optional().describe('Banner button text, if any'),
  })
  .catchall(z.unknown());

const seoSchema = z
  .object({
    title: z.string().optional().describe('Search listing title'),
    description: z.string().optional().describe('Search listing description'),
  })
  .catchall(z.unknown());

const settingsSchema = z
  .object({
    contactEmail: z.string().describe('Shared contact email address'),
    contactPhone: z.string().describe('Shared contact phone number'),
    contactMailtoSubject: z.string().describe('Prefilled email subject'),
    contactEyebrow: z.string().describe('Contact strip tagline'),
    contactHeading: z.string().describe('Contact strip heading'),
    contactCopy: z.string().describe('Contact strip invitation'),
  })
  .catchall(z.unknown());

const serviceSchema = z
  .object({
    title: z.string().describe('Service name'),
    slug: z
      .object({ current: z.string().describe('URL-safe service name') })
      .catchall(z.unknown())
      .describe('Stable web address name'),
    description: z.string().describe('Short service description'),
    image: sanityImageSchema.describe('Service photo'),
    imageAlt: z.string().describe('Service photo alt text'),
    order: z.number().describe('Display order, lower first'),
  })
  .catchall(z.unknown());

const galleryItemSchema = z
  .object({
    image: sanityImageSchema.describe('Artwork photo'),
    imageAlt: z.string().describe('Artwork alt text'),
    saleStatus: z
      .enum(['for-sale', 'not-for-sale'])
      .optional()
      .catch(undefined)
      .describe('Published sale availability, absent when unconfirmed'),
    order: z.number().describe('Display order, lower first'),
  })
  .catchall(z.unknown());

const galleryCollectionSchema = z
  .object({
    title: z.string().describe('Collection title'),
    slug: z
      .object({ current: z.string().describe('URL-safe collection name') })
      .catchall(z.unknown())
      .describe('Stable web address name'),
    description: z.string().describe('Collection description'),
    order: z.number().describe('Display order, lower first'),
    photos: z
      .array(galleryItemSchema.describe('Collection picture'))
      .describe('Pictures in browsing order'),
  })
  .catchall(z.unknown());

const homeQuery = `{
  "home": *[_id == "homePage"][0],
  "settings": *[_id == "siteSettings"][0],
  "services": *[_type == "service"] | order(order asc),
  "collections": *[_type == "galleryCollection"] | order(order asc) {
    title, slug, description, order,
    "photos": photos[]-> { image, imageAlt, saleStatus, order }
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
    title, slug, description, order,
    "photos": photos[]-> { image, imageAlt, saleStatus, order }
  }
}`;

const settingsQuery = `*[_id == "siteSettings"][0]`;

export type CmsImage = {
  url: string;
  alt: string;
};

export type CmsHero = {
  eyebrow: string;
  titleLines: string[];
  description: string;
  image: CmsImage;
  ctaLabel?: string;
};

export type CmsSeo = {
  title?: string;
  description?: string;
};

export type CmsService = {
  title: string;
  slug: string;
  description: string;
  image: CmsImage;
  order: number;
};

export type CmsGalleryItem = {
  alt: string;
  image: CmsImage;
  fullImage: CmsImage;
  saleStatus?: 'for-sale' | 'not-for-sale';
  order: number;
};

export type CmsGalleryCollection = {
  title: string;
  slug: string;
  description: string;
  order: number;
  photos: CmsGalleryItem[];
};

export function galleryCollectionPath(
  collection: Pick<CmsGalleryCollection, 'slug'>,
): string {
  return `/gallery/${collection.slug}`;
}

export function getGalleryCollection(
  collections: CmsGalleryCollection[],
  slug: string,
): CmsGalleryCollection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export type CmsSettings = {
  email: string;
  phone: string;
  mailtoSubject: string;
  eyebrow: string;
  heading: string;
  copy: string;
};

export type HomeData = {
  hero: CmsHero;
  servicesHeading: string;
  mural: {
    eyebrow: string;
    heading: string;
    copy: string;
    ctaLabel: string;
    image: CmsImage;
  };
  galleryHeading: string;
  about: { heading: string; copy: string; image: CmsImage };
  testimonial: { quote: string; author: string; role: string };
  seo: CmsSeo;
  services: CmsService[];
  collections: CmsGalleryCollection[];
  settings: CmsSettings;
};

export type AboutValue = {
  icon: string;
  title: string;
  text: string;
};

export type AboutData = {
  hero: CmsHero;
  values: AboutValue[];
  storyHeading: string;
  storyBody: string;
  storyImage: CmsImage;
  seo: CmsSeo;
  settings: CmsSettings;
};

export type ServicesData = {
  hero: CmsHero;
  seo: CmsSeo;
  services: CmsService[];
  settings: CmsSettings;
};

export type GalleryData = {
  hero: CmsHero;
  seo: CmsSeo;
  collections: CmsGalleryCollection[];
  settings: CmsSettings;
};

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
  if (!parsed.success) return undefined;
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

export function splitTitleLines(title: string): string[] {
  return title
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function splitBalancedLines(title: string): string[] {
  const words = title.split(/\s+/).filter((word) => word.length > 0);
  if (words.length < 2) return words;
  const firstHalf = Math.ceil(words.length / 2);
  return [
    words.slice(0, firstHalf).join(' '),
    words.slice(firstHalf).join(' '),
  ];
}

export function pageHeadFromSeo(input: {
  seo: CmsSeo;
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
}) {
  return createPageHead({
    title: input.seo.title?.trim() || input.fallbackTitle,
    description: input.seo.description?.trim() || input.fallbackDescription,
    path: input.path,
  });
}

function requireImage(
  config: LauraSanityConfig,
  label: string,
  image: unknown,
  alt: string,
  width: number,
  height?: number,
): CmsImage {
  const url = artworkUrl(config, image, width, height);
  if (!url) {
    throw new Error(`Sanity ${label} is missing its artwork image.`);
  }
  return { url, alt };
}

function mapHero(
  config: LauraSanityConfig,
  label: string,
  hero: z.infer<typeof heroSchema>,
  width: number,
  height?: number,
): CmsHero {
  return {
    eyebrow: hero.eyebrow,
    titleLines: splitTitleLines(hero.title),
    description: hero.description,
    image: requireImage(
      config,
      label,
      hero.image,
      hero.imageAlt,
      width,
      height,
    ),
    ctaLabel: hero.ctaLabel,
  };
}

function mapService(
  config: LauraSanityConfig,
  item: z.infer<typeof serviceSchema>,
): CmsService {
  return {
    title: item.title,
    slug: item.slug.current,
    description: item.description,
    image: requireImage(
      config,
      `service "${item.title}"`,
      item.image,
      item.imageAlt,
      1448,
      1086,
    ),
    order: item.order,
  };
}

function mapGalleryItem(
  config: LauraSanityConfig,
  item: z.infer<typeof galleryItemSchema>,
): CmsGalleryItem {
  return {
    alt: item.imageAlt,
    saleStatus: item.saleStatus,
    image: requireImage(
      config,
      'gallery item',
      item.image,
      item.imageAlt,
      640,
      480,
    ),
    fullImage: requireImage(
      config,
      'gallery item',
      item.image,
      item.imageAlt,
      1280,
    ),
    order: item.order,
  };
}

function mapGalleryCollection(
  config: LauraSanityConfig,
  item: z.infer<typeof galleryCollectionSchema>,
): CmsGalleryCollection {
  return {
    title: item.title,
    slug: item.slug.current,
    description: item.description,
    order: item.order,
    photos: item.photos.map((photo) => mapGalleryItem(config, photo)),
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

const homeSchema = z
  .object({
    home: z.unknown().describe('Published homePage singleton'),
    settings: z.unknown().describe('Published siteSettings singleton'),
    services: z.array(z.unknown()).describe('Raw service documents'),
    collections: z
      .array(z.unknown())
      .describe('Raw gallery collection documents'),
  })
  .catchall(z.unknown());

export class LauraSanitySource {
  constructor(
    private readonly config: LauraSanityConfig = resolveLauraSanityConfig(),
  ) {}

  private queryUrl(groq: string): string {
    const base = `https://${this.config.projectId}.api.sanity.io/v${this.config.apiVersion}/data/query/${this.config.dataset}`;
    return `${base}?query=${encodeURIComponent(groq)}`;
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
    if (!data.home) {
      throw new Error(
        'Sanity homePage document is missing. Publish it in the Studio.',
      );
    }
    const home = parseDoc(
      'homePage',
      z
        .object({
          hero: heroSchema.describe('Home page banner'),
          servicesHeading: z.string().describe('Services section heading'),
          muralEyebrow: z.string().describe('Mural section tagline'),
          muralHeading: z.string().describe('Mural section heading'),
          muralCopy: z.string().describe('Mural section text'),
          muralCtaLabel: z.string().describe('Mural button text'),
          muralImage: sanityImageSchema.describe('Mural section artwork'),
          muralImageAlt: z.string().describe('Mural artwork alt text'),
          galleryHeading: z.string().describe('Gallery preview heading'),
          aboutImage: sanityImageSchema.describe('About preview photo'),
          aboutImageAlt: z.string().describe('About preview photo alt text'),
          aboutHeading: z.string().describe('About preview heading'),
          aboutCopy: z.string().describe('About preview text'),
          testimonialQuote: z.string().describe('Client quote'),
          testimonialAuthor: z.string().describe('Quote author name'),
          testimonialRole: z.string().describe('Quote author role'),
          seo: seoSchema.describe('Home search listing'),
        })
        .catchall(z.unknown()),
      data.home,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );
    const services = data.services
      .map((item) =>
        mapService(this.config, parseDoc('service', serviceSchema, item)),
      )
      .sort((a, b) => a.order - b.order);
    const galleryPreview = data.collections
      .map((item) =>
        mapGalleryCollection(
          this.config,
          parseDoc('galleryCollection', galleryCollectionSchema, item),
        ),
      )
      .sort((a, b) => a.order - b.order);

    return {
      hero: mapHero(this.config, 'homePage hero', home.hero, 1374),
      servicesHeading: home.servicesHeading,
      mural: {
        eyebrow: home.muralEyebrow,
        heading: home.muralHeading,
        copy: home.muralCopy,
        ctaLabel: home.muralCtaLabel,
        image: requireImage(
          this.config,
          'homePage mural',
          home.muralImage,
          home.muralImageAlt,
          1254,
        ),
      },
      galleryHeading: home.galleryHeading,
      about: {
        heading: home.aboutHeading,
        copy: home.aboutCopy,
        image: requireImage(
          this.config,
          'homePage about',
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
      z
        .object({
          about: z.unknown().describe('Published aboutPage singleton'),
          settings: z.unknown().describe('Published siteSettings singleton'),
        })
        .catchall(z.unknown()),
    );
    if (!data.about) {
      throw new Error(
        'Sanity aboutPage document is missing. Publish it in the Studio.',
      );
    }
    const about = parseDoc(
      'aboutPage',
      z
        .object({
          hero: heroSchema.describe('About page banner'),
          values: z
            .array(
              z
                .object({
                  icon: z.string().describe('Strength symbol key'),
                  title: z.string().describe('Strength title'),
                  text: z.string().describe('Strength sentence'),
                })
                .catchall(z.unknown())
                .describe('About strength entry'),
            )
            .describe('About strengths'),
          storyHeading: z.string().describe('Story heading'),
          storyBody: z.string().describe('Story text'),
          storyImage: sanityImageSchema.describe('Story portrait'),
          storyImageAlt: z.string().describe('Story portrait alt text'),
          seo: seoSchema.describe('About search listing'),
        })
        .catchall(z.unknown()),
      data.about,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );

    return {
      hero: mapHero(this.config, 'aboutPage hero', about.hero, 1374),
      values: about.values.map((value) => ({
        icon: value.icon,
        title: value.title,
        text: value.text,
      })),
      storyHeading: about.storyHeading,
      storyBody: about.storyBody,
      storyImage: requireImage(
        this.config,
        'aboutPage story',
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
      z
        .object({
          page: z.unknown().describe('Published servicesPage singleton'),
          settings: z.unknown().describe('Published siteSettings singleton'),
          services: z.array(z.unknown()).describe('Raw service documents'),
        })
        .catchall(z.unknown()),
    );
    if (!data.page) {
      throw new Error(
        'Sanity servicesPage document is missing. Publish it in the Studio.',
      );
    }
    const page = parseDoc(
      'servicesPage',
      z
        .object({
          hero: heroSchema.describe('Services page banner'),
          seo: seoSchema.describe('Services search listing'),
        })
        .catchall(z.unknown()),
      data.page,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );
    const services = data.services
      .map((item) =>
        mapService(this.config, parseDoc('service', serviceSchema, item)),
      )
      .sort((a, b) => a.order - b.order);

    return {
      hero: mapHero(this.config, 'servicesPage hero', page.hero, 1374),
      seo: page.seo,
      services,
      settings,
    };
  }

  async loadGallery(): Promise<GalleryData> {
    const data = await this.query(
      'gallery page',
      galleryQuery,
      z
        .object({
          page: z.unknown().describe('Published galleryPage singleton'),
          settings: z.unknown().describe('Published siteSettings singleton'),
          collections: z
            .array(z.unknown())
            .describe('Raw gallery collection documents'),
        })
        .catchall(z.unknown()),
    );
    if (!data.page) {
      throw new Error(
        'Sanity galleryPage document is missing. Publish it in the Studio.',
      );
    }
    const page = parseDoc(
      'galleryPage',
      z
        .object({
          hero: heroSchema.describe('Gallery page banner'),
          seo: seoSchema.describe('Gallery search listing'),
        })
        .catchall(z.unknown()),
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
      .sort((a, b) => a.order - b.order);

    return {
      hero: mapHero(this.config, 'galleryPage hero', page.hero, 1374),
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
