export type SiteSetting = {
  name: string;
  location: string;
  tagline: string;
  introduction: string;
  contactEmail?: string;
};

type Source = {
  sourceUrl: string;
  sourceReviewedOn: string;
};

export type Update = Source & {
  documentId: string;
  title: string;
  slug: string;
  kind: string;
  summary: string;
  body: string;
  publishedOn: string;
  sourceName: string;
  featured: boolean;
};

export type Project = Source & {
  documentId: string;
  title: string;
  slug: string;
  category: string;
  stage: string;
  summary: string;
  details: string;
  updatedOn: string;
  nextStep?: string;
  sourceName: string;
  featured: boolean;
};

export type CommunityEvent = Source & {
  documentId: string;
  title: string;
  slug: string;
  summary: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  bookingUrl?: string;
};

export type Survey = Source & {
  documentId: string;
  title: string;
  slug: string;
  stage: string;
  summary: string;
  opensOn?: string;
  closesOn?: string;
  responseUrl?: string;
  sourceName: string;
  relatedProjectId?: string;
};

export type ResourceDetail = {
  id: number;
  label: string;
  value: string;
  showOnCard: boolean;
};

export type Resource = Source & {
  documentId: string;
  title: string;
  slug: string;
  category: string;
  serviceType: string;
  providerType: string;
  description: string;
  url?: string;
  phone?: string;
  email?: string;
  outOfHours: boolean;
  featured: boolean;
  details: ResourceDetail[];
  collectionDates: Array<{
    id: number;
    date: string;
    stream: 'recycling' | 'waste-compost';
  }>;
  documentUrl?: string;
  documentLabel?: string;
  displayOrder: number;
  sourceName: string;
};

export type ContentSnapshot = {
  siteSetting?: SiteSetting;
  updates: Update[];
  projects: Project[];
  events: CommunityEvent[];
  surveys: Survey[];
  resources: Resource[];
};
