import {defineField, defineType} from 'sanity'

export const resourceDetail = defineType({
  name: 'resourceDetail',
  title: 'Resource detail',
  type: 'object',
  description: 'Editor-defined label/value pair for optional metadata.',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'value', title: 'Value', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'showOnCard', title: 'Show on card', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'label', subtitle: 'value'}},
})
