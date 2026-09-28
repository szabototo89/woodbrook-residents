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

export const update = defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  description: 'News, notices, and planning explainers.',
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
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {list: [...updateKinds].map((v) => ({title: v, value: v})), layout: 'dropdown'},
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
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 6,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedOn',
      title: 'Published date',
      type: 'date',
      validation: (r) => r.required(),
    }),
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
  preview: {select: {title: 'title', subtitle: 'kind'}},
})
