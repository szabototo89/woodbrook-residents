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
  description: 'Curated local service or contact.',
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
        list: [...resourceCategories].map((v) => ({title: v, value: v})),
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service type',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'providerType',
      title: 'Provider type',
      type: 'string',
      options: {list: [...providerTypes].map((v) => ({title: v, value: v})), layout: 'dropdown'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({name: 'url', title: 'Provider URL', type: 'url'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (r) => r.email()}),
    defineField({
      name: 'outOfHours',
      title: 'Out-of-hours contact',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'details', title: 'Details', type: 'array', of: [{type: 'resourceDetail'}]}),
    defineField({
      name: 'collectionDates',
      title: 'Collection dates',
      type: 'array',
      of: [{type: 'collectionDate'}],
    }),
    defineField({name: 'documentUrl', title: 'Document URL', type: 'url'}),
    defineField({name: 'documentLabel', title: 'Document label', type: 'string'}),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      initialValue: 100,
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
  ],
  preview: {select: {title: 'title', subtitle: 'category'}},
})
