import {defineField, defineType} from 'sanity'

export const siteSetting = defineType({
  name: 'siteSetting',
  title: 'Site setting',
  type: 'document',
  description: 'Stable site identity and contact details (singleton).',
  fields: [
    defineField({
      name: 'name',
      title: 'Site name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Shankill, Ireland',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'location'},
  },
})
