import {defineField, defineType} from 'sanity'

export const collectionDate = defineType({
  name: 'collectionDate',
  title: 'Collection date',
  type: 'object',
  description: 'One waste pickup date. Only future dates appear on the site.',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The pickup day. Past dates are hidden automatically — must be a real date.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: the schedule prints this date, and an empty date crashes the page.'),
    }),
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
      description: 'Which bin is collected on this date.',
      validation: (rule) => rule.required().error('Required: pick which stream is collected.'),
    }),
  ],
  preview: {select: {title: 'date', subtitle: 'stream'}},
})
