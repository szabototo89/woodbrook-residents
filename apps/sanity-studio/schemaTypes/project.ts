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

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  description: 'Track a neighbourhood initiative over time.',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [...projectCategories].map((v) => ({title: v, value: v})),
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      options: {list: [...projectStages].map((v) => ({title: v, value: v})), layout: 'dropdown'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text',
      rows: 6,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedOn',
      title: 'Updated date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({name: 'nextStep', title: 'Next step', type: 'string'}),
    defineField({
      name: 'sourceName',
      title: 'Source name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      validation: (r) => r.required().uri({allowRelative: false}),
    }),
    defineField({
      name: 'sourceReviewedOn',
      title: 'Source accessed date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({name: 'credit', title: 'Credit', type: 'string'}),
        defineField({name: 'creditUrl', title: 'Credit URL', type: 'url'}),
      ],
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'title', subtitle: 'stage'}},
})
