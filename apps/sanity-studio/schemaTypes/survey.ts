import {defineField, defineType} from 'sanity'

export const surveyStages = ['upcoming', 'open', 'closed'] as const

export const survey = defineType({
  name: 'survey',
  title: 'Survey',
  type: 'document',
  description: 'Point residents to an active or archived consultation.',
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
      name: 'stage',
      title: 'Stage',
      type: 'string',
      options: {list: [...surveyStages].map((v) => ({title: v, value: v})), layout: 'dropdown'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({name: 'opensOn', title: 'Opens on', type: 'date'}),
    defineField({name: 'closesOn', title: 'Closes on', type: 'date'}),
    defineField({name: 'responseUrl', title: 'Response URL', type: 'url'}),
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
      name: 'relatedProject',
      title: 'Related project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Optional link to a published project.',
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'stage'}},
})
