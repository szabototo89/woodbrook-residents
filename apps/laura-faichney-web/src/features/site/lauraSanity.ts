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
  asset: z.object({ _ref: z.string() }),
  hotspot: z
    .object({
      x: z.number(),
      y: z.number(),
      height: z.number(),
      width: z.number(),
    })
    .optional(),
});

export type SanityImageValue = z.infer<typeof sanityImageSchema>;

const heroSchema = z
  .object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    image: sanityImageSchema,
    imageAlt: z.string(),
    ctaLabel: z.string().optional(),
  })
  .catchall(z.unknown());

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .catchall(z.unknown());

const settingsSchema = z
  .object({
    contactEmail: z.string(),
    contactPhone: z.string(),
    contactMailtoSubject: z.string(),
    contactEyebrow: z.string(),
    contactHeading: z.string(),
    contactCopy: z.string(),
  })
  .catchall(z.unknown());

const serviceSchema = z
  .object({
    title: z.string(),
    slug: z.object({ current: z.string() }).catchall(z.unknown()),
    description: z.string(),
    image: sanityImageSchema,
    imageAlt: z.string(),
    order: z.number(),
  })
  .catchall(z.unknown());

const galleryItemSchema = z
  .object({
    title: z.string(),
    slug: z.object({ current: z.string() }).catchall(z.unknown()),
    description: z.string().optional(),
    image: sanityImageSchema,
    imageAlt: z.string(),
    featured: z.boolean(),
    order: z.number(),
  })
  .catchall(z.unknown());

const homeQuery = `{
  "home": *[_id == "homePage"][0],
  "settings": *[_id == "siteSettings"][0],
  "services": *[_type == "service"] | order(order asc),
  "preview": *[_type == "galleryItem" && featured == true] | order(order asc)
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
  "items": *[_type == "galleryItem"] | order(order asc)
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
  title: string;
  slug: string;
  description?: string;
  alt: string;
  image: CmsImage;
  detailImage: CmsImage;
  featured: boolean;
  order: number;
};

export type GalleryPhotoDetail = {
  item: CmsGalleryItem;
  index: number;
  total: number;
  previous: CmsGalleryItem;
  next: CmsGalleryItem;
};

export function galleryPhotoPath(item: Pick<CmsGalleryItem, 'slug'>): string {
  return `/gallery/${item.slug}`;
}

export function getGalleryPhoto(
  items: CmsGalleryItem[],
  slug: string,
): GalleryPhotoDetail | undefined {
  const index = items.findIndex((item) => item.slug === slug);
  const item = items[index];
  if (index < 0 || !item) return undefined;
  const total = items.length;
  const previous = items[(index - 1 + total) % total];
  const next = items[(index + 1) % total];
  if (!previous || !next) return undefined;
  return { item, index, total, previous, next };
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
  galleryPreview: CmsGalleryItem[];
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
  items: CmsGalleryItem[];
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
  const parsedSlug = item.slug.current.trim();
  return {
    title: item.title,
    slug: parsedSlug,
    description:
      item.description && item.description.trim().length > 0
        ? item.description
        : undefined,
    alt: item.imageAlt,
    image: requireImage(
      config,
      'gallery item',
      item.image,
      item.imageAlt,
      640,
      480,
    ),
    detailImage: requireImage(
      config,
      'gallery item',
      item.image,
      item.imageAlt,
      1280,
    ),
    featured: item.featured,
    order: item.order,
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
    home: z.unknown(),
    settings: z.unknown(),
    services: z.array(z.unknown()),
    preview: z.array(z.unknown()),
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

    const body = z.object({ result: z.unknown() }).parse(await response.json());
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
          hero: heroSchema,
          servicesHeading: z.string(),
          muralEyebrow: z.string(),
          muralHeading: z.string(),
          muralCopy: z.string(),
          muralCtaLabel: z.string(),
          muralImage: sanityImageSchema,
          muralImageAlt: z.string(),
          galleryHeading: z.string(),
          aboutImage: sanityImageSchema,
          aboutImageAlt: z.string(),
          aboutHeading: z.string(),
          aboutCopy: z.string(),
          testimonialQuote: z.string(),
          testimonialAuthor: z.string(),
          testimonialRole: z.string(),
          seo: seoSchema,
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
    const galleryPreview = data.preview
      .map((item) =>
        mapGalleryItem(
          this.config,
          parseDoc('galleryItem', galleryItemSchema, item),
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
      galleryPreview,
      settings,
    };
  }

  async loadAbout(): Promise<AboutData> {
    const data = await this.query(
      'about page',
      aboutQuery,
      z
        .object({ about: z.unknown(), settings: z.unknown() })
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
          hero: heroSchema,
          values: z.array(
            z
              .object({ icon: z.string(), title: z.string(), text: z.string() })
              .catchall(z.unknown()),
          ),
          storyHeading: z.string(),
          storyBody: z.string(),
          storyImage: sanityImageSchema,
          storyImageAlt: z.string(),
          seo: seoSchema,
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
          page: z.unknown(),
          settings: z.unknown(),
          services: z.array(z.unknown()),
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
      z.object({ hero: heroSchema, seo: seoSchema }).catchall(z.unknown()),
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
          page: z.unknown(),
          settings: z.unknown(),
          items: z.array(z.unknown()),
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
      z.object({ hero: heroSchema, seo: seoSchema }).catchall(z.unknown()),
      data.page,
    );
    const settings = mapSettings(
      parseDoc('siteSettings', settingsSchema, data.settings),
    );
    const items = data.items
      .map((item) =>
        mapGalleryItem(
          this.config,
          parseDoc('galleryItem', galleryItemSchema, item),
        ),
      )
      .sort((a, b) => a.order - b.order);

    return {
      hero: mapHero(this.config, 'galleryPage hero', page.hero, 1374),
      seo: page.seo,
      items,
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
