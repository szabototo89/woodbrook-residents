import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'Search listing',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Shown in the browser tab and as the blue link in Google results.',
      validation: (rule) =>
        rule.required().error('Give the page a title so it has a name in tabs and search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences under the page title in Google results.',
      validation: (rule) =>
        rule
          .required()
          .error('Write a short description so the page looks right in search results.')
          .max(160)
          .warning(
            'Google usually shows about 155 characters — shorten this so it is not cut off.',
          ),
    }),
  ],
})
