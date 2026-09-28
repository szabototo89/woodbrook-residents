import {defineField, defineType} from 'sanity'

export const issueReport = defineType({
  name: 'issueReport',
  title: 'Issue report',
  type: 'document',
  description: 'Private structured resident submission. Create-only, never listed publicly.',
  // No public preview: operational record only.
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({name: 'reporterContact', title: 'Reporter contact', type: 'string'}),
    defineField({
      name: 'consent',
      title: 'Consent',
      type: 'boolean',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      options: {list: ['new', 'triaged', 'closed'], layout: 'dropdown'},
      initialValue: 'new',
    }),
  ],
})
