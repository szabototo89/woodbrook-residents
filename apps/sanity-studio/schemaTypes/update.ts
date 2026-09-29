import {defineField, defineType} from 'sanity'

export const updateKinds = [
  'news',
  'planning',
  'community',
  'transport',
  'housing',
  'parks',
  'environment',
  'safety',
  'waste',
  'education',
  'other',
] as const

function formatPreviewDate(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return 'No date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Invalid date'
  return parsed.toLocaleDateString('en-IE', {day: 'numeric', month: 'long', year: 'numeric'})
}

export const update = defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  description:
    'News, notices, and planning explainers. Appears on the homepage, the Updates page, and its own detail page.',
  fieldsets: [
    {name: 'identity', title: 'Identity', options: {collapsible: true, collapsed: false}},
    {name: 'content', title: 'Content', options: {collapsible: true, collapsed: false}},
    {name: 'dates', title: 'Dates', options: {collapsible: true, collapsed: false}},
    {name: 'source', title: 'Source and freshness', options: {collapsible: true, collapsed: false}},
    {name: 'featuring', title: 'Featuring', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'identity',
      description: 'The card heading and the page title residents see first.',
      validation: (rule) => rule.required().error('Required: every card and page needs a title.'),
    }),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      fieldset: 'identity',
      options: {source: 'title', maxLength: 96},
      description:
        'The end of the web address, e.g. path-works in /updates/path-works. Changing it after publishing breaks existing links.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: without this the page has no address and cards link nowhere.'),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      fieldset: 'content',
      options: {list: [...updateKinds].map((value) => ({title: value, value})), layout: 'dropdown'},
      description: 'Shown as the small pill label on the card. Only these values are allowed.',
      validation: (rule) => rule.required().error('Required: the card pill needs a kind.'),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      fieldset: 'content',
      description: 'One or two sentences shown on the card and under the page title.',
      validation: (rule) =>
        rule.required().error('Required: cards and search results show this text.'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 6,
      fieldset: 'content',
      description: 'The full text on the detail page. Blank lines start new paragraphs.',
      validation: (rule) =>
        rule.required().error('Required: the detail page would otherwise be empty.'),
    }),
    defineField({
      name: 'publishedOn',
      title: 'Published date',
      type: 'date',
      fieldset: 'dates',
      description:
        'Printed on the card next to the kind. Must be a real date — an empty or invalid date crashes the page.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: cards print this date, and an empty date crashes the whole page.'),
    }),
    defineField({
      name: 'sourceName',
      title: 'Source name',
      type: 'string',
      fieldset: 'source',
      description:
        'Who the information comes from, e.g. MyWaste. Shown in the “Source and freshness” box.',
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
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      fieldset: 'content',
      options: {hotspot: true},
      description:
        'Optional photo shown on the card and the detail page. Leave empty for no photo.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Photo description',
          type: 'string',
          description:
            'Describe the photo for residents using screen readers. Required when a photo is set.',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              if (parent?.asset && !value)
                return 'Required when a photo is set: describe it for screen readers.'
              return true
            }),
        }),
        defineField({
          name: 'credit',
          title: 'Photo credit',
          type: 'string',
          description: 'Who took the photo, e.g. a name. Shown under the photo.',
        }),
        defineField({
          name: 'creditUrl',
          title: 'Credit link',
          type: 'url',
          description: 'Link for the photo credit. Only used together with a credit name.',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      fieldset: 'featuring',
      initialValue: false,
      description:
        'Updates lists show the newest items regardless of this switch. It only affects special picks editors make elsewhere — leave off unless asked.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      kind: 'kind',
      publishedOn: 'publishedOn',
      featured: 'featured',
      media: 'image',
    },
    prepare({title, kind, publishedOn, featured, media}) {
      return {
        title: typeof title === 'string' ? title : 'Untitled update',
        subtitle: `${typeof kind === 'string' ? kind : '—'} · ${formatPreviewDate(publishedOn)}${
          featured === true ? ' · ★ Featured' : ''
        }`,
        media,
      }
    },
  },
})
