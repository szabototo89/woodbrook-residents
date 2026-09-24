export const HOME_CONTENT_COLLECTION_ID = 'HomePageContent';

export type HomeContentSectionKey =
  'hero' | 'categories' | 'featured' | 'gift' | 'visit';

export type HomeContentSection = Partial<Record<string, string | null>>;

export type HomeContentField =
  | 'heroEyebrow'
  | 'heroTitle'
  | 'heroLocation'
  | 'heroCopy'
  | 'heroCopySecondLine'
  | 'heroImageAlt'
  | 'categoriesEyebrow'
  | 'categoriesTitle'
  | 'categoriesViewAllLabel'
  | 'featuredEyebrow'
  | 'featuredTitle'
  | 'featuredViewAllLabel'
  | 'giftEyebrow'
  | 'giftTitle'
  | 'giftCopyLead'
  | 'giftCopyRest'
  | 'giftButtonLabel'
  | 'visitEyebrow'
  | 'visitTitle'
  | 'visitAddress'
  | 'visitHoursDays'
  | 'visitHoursTime'
  | 'visitContactButtonLabel'
  | 'visitStudioImageAlt';

/**
 * Raw single-item shape from the HomePageContent collection. Contact
 * details live in the ContactDetails collection and the booking policy in
 * the BookingPolicy collection — only homepage-section copy lives here.
 * The legacy nested OBJECT keys are kept as an optional read fallback so
 * items written during the object-grouping experiment still resolve.
 */
export type HomeContent = Partial<
  Record<HomeContentSectionKey, HomeContentSection | null>
> &
  Partial<Record<HomeContentField, string | null>>;

export type ResolvedHomeContent = Record<HomeContentField, string>;

const FIELD_TO_SECTION: Readonly<
  Record<HomeContentField, readonly [HomeContentSectionKey, string]>
> = {
  heroEyebrow: ['hero', 'eyebrow'],
  heroTitle: ['hero', 'title'],
  heroLocation: ['hero', 'location'],
  heroCopy: ['hero', 'copy'],
  heroCopySecondLine: ['hero', 'copySecondLine'],
  heroImageAlt: ['hero', 'imageAlt'],
  categoriesEyebrow: ['categories', 'eyebrow'],
  categoriesTitle: ['categories', 'title'],
  categoriesViewAllLabel: ['categories', 'viewAllLabel'],
  featuredEyebrow: ['featured', 'eyebrow'],
  featuredTitle: ['featured', 'title'],
  featuredViewAllLabel: ['featured', 'viewAllLabel'],
  giftEyebrow: ['gift', 'eyebrow'],
  giftTitle: ['gift', 'title'],
  giftCopyLead: ['gift', 'copyLead'],
  giftCopyRest: ['gift', 'copyRest'],
  giftButtonLabel: ['gift', 'buttonLabel'],
  visitEyebrow: ['visit', 'eyebrow'],
  visitTitle: ['visit', 'title'],
  visitAddress: ['visit', 'address'],
  visitHoursDays: ['visit', 'hoursDays'],
  visitHoursTime: ['visit', 'hoursTime'],
  visitContactButtonLabel: ['visit', 'contactButtonLabel'],
  visitStudioImageAlt: ['visit', 'studioImageAlt'],
};

export const HOME_CONTENT_DEFAULTS: ResolvedHomeContent = {
  heroEyebrow: 'Beauty · Wellbeing · You',
  heroTitle: 'Relax and Revitalize',
  heroLocation: 'Beauty treatments in Stillorgan, South Dublin.',
  heroCopy: 'A wide range of beauty treatments and products,',
  heroCopySecondLine: 'all in one place.',
  heroImageAlt: 'A relaxing facial treatment at Juliet Rose Beauty Studio',
  categoriesEyebrow: 'Our treatments',
  categoriesTitle: 'Find the right treatment for you',
  categoriesViewAllLabel: 'View all treatments',
  featuredEyebrow: 'Popular choices',
  featuredTitle: 'Featured treatments',
  featuredViewAllLabel: 'View all treatments',
  giftEyebrow: 'Gift cards',
  giftTitle: 'The perfect gift',
  giftCopyLead: 'Treat someone special to a Juliet Rose gift card.',
  giftCopyRest: 'Available for any treatment or amount.',
  giftButtonLabel: 'Buy a gift card',
  visitEyebrow: 'Visit us',
  visitTitle: 'Juliet Rose beauty studio',
  visitAddress: '10 Merville road, Stillorgan, Dublin, Ireland, A94YV78',
  visitHoursDays: 'Monday – Friday',
  visitHoursTime: '10.00am – 8.00pm',
  visitContactButtonLabel: 'Contact Diana',
  visitStudioImageAlt: 'The warm and private Juliet Rose treatment studio',
};

export function resolveText(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }
  return value.trim() ? value : fallback;
}

export function mergeText(
  explicit: unknown,
  cmsValue: unknown,
  fallback: string,
): string {
  return resolveText(explicit, resolveText(cmsValue, fallback));
}

function readField(source: HomeContent, field: HomeContentField): unknown {
  const [sectionKey, subKey] = FIELD_TO_SECTION[field];
  const section = source[sectionKey];
  if (section && typeof section === 'object') {
    const nested: unknown = section[subKey];
    if (typeof nested === 'string' && nested.trim()) {
      return nested;
    }
  }
  return source[field];
}

const HOME_CONTENT_FIELDS: readonly HomeContentField[] = [
  'heroEyebrow',
  'heroTitle',
  'heroLocation',
  'heroCopy',
  'heroCopySecondLine',
  'heroImageAlt',
  'categoriesEyebrow',
  'categoriesTitle',
  'categoriesViewAllLabel',
  'featuredEyebrow',
  'featuredTitle',
  'featuredViewAllLabel',
  'giftEyebrow',
  'giftTitle',
  'giftCopyLead',
  'giftCopyRest',
  'giftButtonLabel',
  'visitEyebrow',
  'visitTitle',
  'visitAddress',
  'visitHoursDays',
  'visitHoursTime',
  'visitContactButtonLabel',
  'visitStudioImageAlt',
];

export function resolveHomeContent(
  content: HomeContent | null | undefined,
): ResolvedHomeContent {
  const source: HomeContent = content ?? {};
  return HOME_CONTENT_FIELDS.reduce<ResolvedHomeContent>(
    (resolved, key) => ({
      ...resolved,
      [key]: resolveText(readField(source, key), HOME_CONTENT_DEFAULTS[key]),
    }),
    { ...HOME_CONTENT_DEFAULTS },
  );
}
