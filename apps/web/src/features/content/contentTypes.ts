export type ContentAvailability = 'ready' | 'unavailable';

export type SiteSetting = {
  name: string;
  location: string;
  tagline: string;
  introduction: string;
  contactEmail?: string;
};

export type Update = {
  documentId: string;
  title: string;
  slug: string;
  kind: 'news' | 'planning' | 'transport' | 'community';
  summary: string;
  body: string;
  publishedOn: string;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedOn: string;
  imagePath?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageCreditUrl?: string;
  featured: boolean;
};

export type Project = {
  documentId: string;
  title: string;
  slug: string;
  category: 'transport' | 'housing' | 'parks' | 'public-realm' | 'community';
  stage: 'monitoring' | 'consultation' | 'active' | 'completed';
  summary: string;
  details: string;
  updatedOn: string;
  nextStep?: string;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedOn: string;
  imagePath?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageCreditUrl?: string;
  featured: boolean;
};

export type CommunityEvent = {
  documentId: string;
  title: string;
  slug: string;
  summary: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  bookingUrl?: string;
  sourceUrl: string;
  sourceReviewedOn: string;
};

export type Survey = {
  documentId: string;
  title: string;
  slug: string;
  stage: 'upcoming' | 'open' | 'closed';
  summary: string;
  opensOn?: string;
  closesOn?: string;
  responseUrl?: string;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedOn: string;
};

export type Resource = {
  documentId: string;
  title: string;
  category:
    | 'health'
    | 'trades'
    | 'professional'
    | 'care'
    | 'transport'
    | 'council'
    | 'community'
    | 'safety'
    | 'waste'
    | 'recreation';
  serviceType: string;
  providerType: 'business' | 'public-service' | 'community' | 'nonprofit';
  description: string;
  url?: string;
  phone?: string;
  email?: string;
  outOfHours: boolean;
  details: Array<{
    id: number;
    label: string;
    value: string;
  }>;
  displayOrder: number;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedOn: string;
};

export type HomeContent = {
  availability: ContentAvailability;
  siteSetting?: SiteSetting;
  updates: Update[];
  projects: Project[];
  events: CommunityEvent[];
  surveys: Survey[];
};

export type ContentCollection<T> = {
  availability: ContentAvailability;
  items: T[];
};
