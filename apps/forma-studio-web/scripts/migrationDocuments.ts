import { imageSchema, type FormaContent } from '../src/features/content/schema';

// Convert only validated data to Sanity's image/reference storage shape.
function storedValue(value: unknown): unknown {
  const image = imageSchema.safeParse(value);
  if (image.success)
    return {
      _type: 'contentImage',
      alt: image.data.alt,
      asset: { _type: 'reference', _ref: image.data.asset._id },
    };
  if (Array.isArray(value)) return value.map(storedValue);
  if (value !== null && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, storedValue(item)]),
    );
  return value;
}

export function migrationDocuments(
  content: FormaContent,
  resolveId: (legacyId: string) => string,
) {
  const reference = (id: string) => ({
    _type: 'reference',
    _key: resolveId(id),
    _ref: resolveId(id),
  });
  const work = content.home.selectedWork.map((item) => ({
    ...item,
    _id: resolveId(item._id),
    _type: 'selectedWork',
    legacyId: item._id,
  }));
  const guides = content.journal.guides.flatMap((item) => {
    const guide = {
      ...item,
      _id: resolveId(item._id),
      _type: 'journalGuide',
      legacyId: item._id,
    };
    return [guide, { ...guide, _id: `drafts.${guide._id}` }];
  });
  const home = {
    ...content.home,
    _type: 'homePage',
    selectedWork: content.home.selectedWork.map((item) => reference(item._id)),
    services: content.home.services.map((item) => ({
      ...item,
      _type: 'service',
    })),
    packages: content.home.packages.map((item) => ({
      ...item,
      _type: 'package',
    })),
    steps: content.home.steps.map((item) => ({
      ...item,
      _type: 'processStep',
    })),
    faqs: content.home.faqs.map((item) => ({ ...item, _type: 'faq' })),
  };
  const settings = {
    ...content.settings,
    _type: 'siteSettings',
    navigation: content.settings.navigation.map((item) => ({
      ...item,
      _type: 'navigationItem',
    })),
  };
  return [
    settings,
    home,
    {
      ...content.journal,
      _type: 'journalPage',
      guides: content.journal.guides.map((item) => reference(item._id)),
    },
    ...work,
    ...guides,
  ].map((document) => ({
    ...document,
    ...Object.fromEntries(
      Object.entries(document).map(([key, value]) => [key, storedValue(value)]),
    ),
  }));
}
