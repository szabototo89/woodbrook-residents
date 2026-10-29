// Public reads must exclude unpublished documents even with a server token.
const publishedOnly =
  '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';

export const siteSettingQuery = `*[_type == "siteSetting" && ${publishedOnly}][0]{
  name,
  location,
  tagline,
  introduction,
  contactEmail
}`;

export const updatesQuery = `*[_type == "update" && ${publishedOnly}] | order(publishedOn desc) {
  _id,
  title,
  slug,
  kind,
  summary,
  body,
  publishedOn,
  sourceName,
  sourceUrl,
  sourceReviewedOn,
  image,
  featured,
  featuredUntil
}`;

export const projectsQuery = `*[_type == "project" && ${publishedOnly}] | order(featured desc, updatedOn desc) {
  _id,
  title,
  slug,
  category,
  stage,
  summary,
  details,
  updatedOn,
  nextStep,
  sourceName,
  sourceUrl,
  sourceReviewedOn,
  image,
  featured
}`;

export const eventsQuery = `*[_type == "event" && ${publishedOnly}] | order(startsAt asc) {
  _id,
  title,
  slug,
  summary,
  startsAt,
  endsAt,
  location,
  bookingUrl,
  sourceUrl,
  sourceReviewedOn,
  featured
}`;

export const surveysQuery = `*[_type == "survey" && ${publishedOnly}] | order(stage asc, closesOn desc) {
  _id,
  title,
  slug,
  stage,
  summary,
  opensOn,
  closesOn,
  responseUrl,
  sourceName,
  sourceUrl,
  sourceReviewedOn,
  relatedProject
}`;

export const resourcesQuery = `*[_type == "resource" && ${publishedOnly}] | order(displayOrder asc, title asc) {
  _id,
  title,
  slug,
  category,
  serviceType,
  providerType,
  description,
  url,
  phone,
  email,
  outOfHours,
  featured,
  details,
  collectionDates,
  documentUrl,
  documentLabel,
  displayOrder,
  sourceName,
  sourceUrl,
  sourceReviewedOn
}`;
