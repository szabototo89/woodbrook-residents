import type {
  projectCategories,
  projectStages,
  providerTypes,
  resourceCategories,
  surveyStages,
  updateKinds,
} from './contentTaxonomy';

export type ContentAvailability = 'ready' | 'unavailable';

export type UpdateKind = (typeof updateKinds)[number];
export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStage = (typeof projectStages)[number];
export type SurveyStage = (typeof surveyStages)[number];
export type ResourceCategory = (typeof resourceCategories)[number];
export type ProviderType = (typeof providerTypes)[number];

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
  kind: UpdateKind;
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
  category: ProjectCategory;
  stage: ProjectStage;
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
  stage: SurveyStage;
  summary: string;
  opensOn?: string;
  closesOn?: string;
  responseUrl?: string;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedOn: string;
  relatedProjectId?: string;
};

export type Resource = {
  documentId: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  serviceType: string;
  providerType: ProviderType;
  description: string;
  url?: string;
  phone?: string;
  email?: string;
  outOfHours: boolean;
  featured: boolean;
  details: Array<{
    id: number;
    label: string;
    value: string;
    showOnCard: boolean;
  }>;
  collectionDates: Array<{
    id: number;
    date: string;
    stream: 'recycling' | 'waste-compost';
  }>;
  documentUrl?: string;
  documentLabel?: string;
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

export type ContentSnapshot = {
  siteSetting?: SiteSetting;
  updates: Update[];
  projects: Project[];
  events: CommunityEvent[];
  surveys: Survey[];
  resources: Resource[];
};

export type ContentCollection<T> = {
  availability: ContentAvailability;
  items: T[];
};
