import {defineField, defineType} from 'sanity'

export const issueReport = defineType({
  name: 'issueReport',
  title: 'Issue report',
  type: 'document',
  description:
    'Private resident reports for editors only. These NEVER appear on the public website — the public API can create them but never lists them.',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'What kind of issue was reported. Internal use only.',
      validation: (rule) => rule.required().error('Required: editors need a category to triage.'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where the issue is. Internal use only — never published.',
      validation: (rule) => rule.required().error('Required: editors need a location.'),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text',
      rows: 4,
      description: 'What the resident described. Internal use only — never published.',
      validation: (rule) => rule.required().error('Required: the report needs details.'),
    }),
    defineField({
      name: 'reporterContact',
      title: 'Reporter contact',
      type: 'string',
      description: 'How to reach the reporter. Private — never published.',
    }),
    defineField({
      name: 'consent',
      title: 'Consent',
      type: 'boolean',
      description: 'Whether the reporter agreed to be contacted about this report.',
      validation: (rule) => rule.required().error('Required: record whether consent was given.'),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      options: {list: ['new', 'triaged', 'closed'], layout: 'dropdown'},
      initialValue: 'new',
      description: 'Where this report stands. New reports start as “new”.',
    }),
  ],
  preview: {
    select: {title: 'category', subtitle: 'location', description: 'state'},
    prepare({title, subtitle, description}) {
      return {
        title: typeof title === 'string' ? title : 'Untitled report',
        subtitle: `${typeof subtitle === 'string' ? subtitle : 'No location'} · ${
          typeof description === 'string' ? description : 'new'
        } · PRIVATE`,
      }
    },
  },
})
