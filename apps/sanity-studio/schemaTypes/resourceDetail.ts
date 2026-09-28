import {defineField, defineType} from 'sanity'

export const resourceDetail = defineType({
  name: 'resourceDetail',
  title: 'Resource detail',
  type: 'object',
  description: 'One extra fact about a directory entry, e.g. address or opening hours.',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description:
        'The fact name, e.g. Address or Opening hours. Note: a row labelled exactly “Address” also feeds map links and search results.',
      validation: (rule) => rule.required().error('Required: every fact needs a label.'),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'The fact itself, e.g. “Main Street, Shankill”.',
      validation: (rule) => rule.required().error('Required: every fact needs a value.'),
    }),
    defineField({
      name: 'showOnCard',
      title: 'Show on card',
      type: 'boolean',
      initialValue: false,
      description:
        'Switch on to show this fact on the directory card. All facts always show on the detail page.',
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'value'}},
})
