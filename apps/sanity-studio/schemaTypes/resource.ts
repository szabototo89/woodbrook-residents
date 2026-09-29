import {defineField, defineType} from 'sanity'

export const resourceCategories = [
  'health',
  'trades',
  'professional',
  'care',
  'transport',
  'council',
  'community',
  'safety',
  'waste',
  'recreation',
  'education',
  'childcare',
  'other',
] as const

export const providerTypes = [
  'business',
  'public-service',
  'community',
  'nonprofit',
  'other',
] as const

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  description:
    'A local service or contact in the directory. Appears in the searchable “Local information” directory, the “Good to know locally” highlights (featured only), and its own detail page.',
  fieldsets: [
    {name: 'identity', title: 'Identity', options: {collapsible: true, collapsed: false}},
    {name: 'content', title: 'Content', options: {collapsible: true, collapsed: false}},
    {name: 'contact', title: 'Contact', options: {collapsible: true, collapsed: false}},
    {name: 'source', title: 'Source and freshness', options: {collapsible: true, collapsed: false}},
    {
      name: 'featuring',
      title: 'Featuring and order',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      fieldset: 'identity',
      description: 'The service or provider name residents see first on the card and page.',
      validation: (rule) => rule.required().error('Required: every card and page needs a name.'),
    }),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      fieldset: 'identity',
      options: {source: 'title', maxLength: 96},
      description:
        'The end of the web address, e.g. clinic in /local-info/clinic. Changing it after publishing breaks existing links.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: without this the page has no address and cards link nowhere.'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      fieldset: 'content',
      options: {
        list: [...resourceCategories].map((value) => ({title: value, value})),
        layout: 'dropdown',
      },
      description:
        'Shown on the card and used for directory filtering. Only these values are allowed.',
      validation: (rule) =>
        rule.required().error('Required: the card and filters need a category.'),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service type',
      type: 'string',
      fieldset: 'content',
      description:
        'In plain words what the service is, e.g. Plumber. Shown under the category on the card.',
      validation: (rule) => rule.required().error('Required: the card shows this line.'),
    }),
    defineField({
      name: 'providerType',
      title: 'Provider type',
      type: 'string',
      fieldset: 'content',
      options: {
        list: [...providerTypes].map((value) => ({title: value, value})),
        layout: 'dropdown',
      },
      description: 'What kind of organisation provides the service. Shown on the detail page.',
      validation: (rule) => rule.required().error('Required: pick the closest kind of provider.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      fieldset: 'content',
      description: 'A short public description shown on the card and the detail page.',
      validation: (rule) => rule.required().error('Required: cards show this text.'),
    }),
    defineField({
      name: 'url',
      title: 'Provider website',
      type: 'url',
      fieldset: 'contact',
      description:
        'The provider’s own website, shown as a “Visit website” button. Leave empty if none.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      fieldset: 'contact',
      description: 'Public phone number, shown as a “Call” button. Leave empty to hide the button.',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      fieldset: 'contact',
      description:
        'Public email address, shown as an “Email” button. Leave empty to hide the button.',
      validation: (rule) => rule.email().error('Must be a valid email address, or leave empty.'),
    }),
    defineField({
      name: 'outOfHours',
      title: 'Out-of-hours contact',
      type: 'boolean',
      fieldset: 'contact',
      initialValue: false,
      description:
        'Switch on if a separate out-of-hours contact exists. Shows an “Out-of-hours contact” badge on the card.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      fieldset: 'featuring',
      initialValue: false,
      description:
        'Only featured entries appear in the “Good to know locally” highlights. Leave off for normal entries.',
    }),
    defineField({
      name: 'details',
      title: 'Extra facts',
      type: 'array',
      fieldset: 'content',
      of: [{type: 'resourceDetail'}],
      description:
        'Extra label-and-value facts (address, opening hours, …). Tick “Show on card” to show on the directory card; all show on the detail page.',
    }),
    defineField({
      name: 'collectionDates',
      title: 'Waste collection dates',
      type: 'array',
      fieldset: 'content',
      of: [{type: 'collectionDate'}],
      description: 'Pickup dates for waste entries. Only future dates appear on the site.',
    }),
    defineField({
      name: 'documentUrl',
      title: 'Document link',
      type: 'url',
      fieldset: 'content',
      description:
        'A supporting document, e.g. a collection schedule PDF. Shown as view/download buttons.',
    }),
    defineField({
      name: 'documentLabel',
      title: 'Document label',
      type: 'string',
      fieldset: 'content',
      description:
        'What to call the document link, e.g. “Summer schedule”. Used if set, otherwise a default label is shown.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      fieldset: 'featuring',
      initialValue: 100,
      description:
        'Lower numbers appear first in the directory. 100 is normal; use smaller numbers to push important entries up.',
      validation: (rule) =>
        rule.required().error('Required: keep 100 unless this entry needs to move up.'),
    }),
    defineField({
      name: 'sourceName',
      title: 'Source name',
      type: 'string',
      fieldset: 'source',
      description: 'Who the information comes from. Shown in the “Source and freshness” box.',
      validation: (rule) =>
        rule.required().error('Required: every public fact must name its source.'),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source link',
      type: 'url',
      fieldset: 'source',
      description:
        'The public page this information came from. Residents can click it. Must start with https://.',
      validation: (rule) =>
        rule
          .required()
          .uri({allowRelative: false})
          .error('Required: a full https:// link residents can open.'),
    }),
    defineField({
      name: 'sourceReviewedOn',
      title: 'Source last checked',
      type: 'date',
      fieldset: 'source',
      description:
        'The date you last checked the source link still says this. Printed on the public page — must be a real date.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: the page prints this date, and an empty date crashes the page.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      serviceType: 'serviceType',
      featured: 'featured',
    },
    prepare({title, category, serviceType, featured}) {
      return {
        title: typeof title === 'string' ? title : 'Untitled entry',
        subtitle: `${typeof category === 'string' ? category : '—'} · ${
          typeof serviceType === 'string' ? serviceType : '—'
        }${featured === true ? ' · ★ Featured' : ''}`,
      }
    },
  },
})
