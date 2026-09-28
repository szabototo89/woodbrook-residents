import {defineField, defineType} from 'sanity'

export const projectCategories = [
  'transport',
  'housing',
  'parks',
  'public-realm',
  'planning',
  'community',
  'environment',
  'safety',
  'education',
  'other',
] as const

export const projectStages = [
  'proposed',
  'active',
  'monitoring',
  'paused',
  'completed',
  'consultation',
] as const

function formatPreviewDate(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return 'No date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Invalid date'
  return parsed.toLocaleDateString('en-IE', {day: 'numeric', month: 'long', year: 'numeric'})
}

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  description:
    'A neighbourhood initiative tracked over time. Appears on the homepage, the Projects page, and its own detail page.',
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
        'The end of the web address, e.g. greenway in /projects/greenway. Changing it after publishing breaks existing links.',
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
        list: [...projectCategories].map((value) => ({title: value, value})),
        layout: 'dropdown',
      },
      description: 'Shown next to the stage pill on the card. Only these values are allowed.',
      validation: (rule) => rule.required().error('Required: the card shows this category.'),
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      fieldset: 'content',
      options: {
        list: [...projectStages].map((value) => ({title: value, value})),
        layout: 'dropdown',
      },
      description:
        'Shown as the coloured pill on the card (e.g. active, completed). Pick the current lifecycle stage.',
      validation: (rule) => rule.required().error('Required: the card pill needs a stage.'),
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
      name: 'details',
      title: 'Details',
      type: 'text',
      rows: 6,
      fieldset: 'content',
      description: 'The full description on the detail page. Blank lines start new paragraphs.',
      validation: (rule) =>
        rule.required().error('Required: the detail page would otherwise be empty.'),
    }),
    defineField({
      name: 'updatedOn',
      title: 'Last reviewed date',
      type: 'date',
      fieldset: 'dates',
      description: 'Printed as “Updated …” on the detail page. Must be a real date.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: the page prints this date, and an empty date crashes the page.'),
    }),
    defineField({
      name: 'nextStep',
      title: 'Next step',
      type: 'string',
      fieldset: 'content',
      description:
        'The latest known next action, shown in the “What happens next” box. Leave empty to hide the box.',
    }),
    defineField({
      name: 'sourceName',
      title: 'Source name',
      type: 'string',
      fieldset: 'source',
      description:
        'Who the information comes from, e.g. the Council. Shown in the “Source and freshness” box.',
      validation: (rule) =>
        rule.required().error('Required: every public fact must name its source.'),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source link',
      type: 'url',
      fieldset: 'source',
      description:
        'The official public page for this project. Residents can click it. Must start with https://.',
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
        'The date you last checked the source link still says this. Printed on cards as “Reviewed …” — must be a real date.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: cards print this date, and an empty date crashes the whole page.'),
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
        'Project lists show the newest items regardless of this switch. Leave off unless editors agree an item needs special placement.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      stage: 'stage',
      category: 'category',
      updatedOn: 'updatedOn',
      featured: 'featured',
      media: 'image',
    },
    prepare({title, stage, category, updatedOn, featured, media}) {
      return {
        title: typeof title === 'string' ? title : 'Untitled project',
        subtitle: `${typeof stage === 'string' ? stage : '—'} · ${
          typeof category === 'string' ? category : '—'
        } · ${formatPreviewDate(updatedOn)}${featured === true ? ' · ★ Featured' : ''}`,
        media,
      }
    },
  },
})
