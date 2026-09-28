import {defineField, defineType} from 'sanity'

export const collectionDate = defineType({
  name: 'collectionDate',
  title: 'Collection date',
  type: 'object',
  description: 'Structured waste collection date.',
  fields: [
    defineField({name: 'date', title: 'Date', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'stream',
      title: 'Waste stream',
      type: 'string',
      options: {
        list: [
          {title: 'recycling', value: 'recycling'},
          {title: 'waste-compost', value: 'waste-compost'},
        ],
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
  ],
  preview: {select: {title: 'date', subtitle: 'stream'}},
})
