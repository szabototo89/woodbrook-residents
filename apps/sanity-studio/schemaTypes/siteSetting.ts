import {defineField, defineType} from 'sanity'

export const siteSetting = defineType({
  name: 'siteSetting',
  title: 'Site setting',
  type: 'document',
  description:
    'The identity of the whole website. There is only one — edit it, never create another.',
  fields: [
    defineField({
      name: 'name',
      title: 'Site name',
      type: 'string',
      description:
        'Shown in the header next to the W mark and in the footer, e.g. Woodbrook Residents.',
      validation: (rule) => rule.required().error('Required: the header brand needs a name.'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Shankill, Ireland',
      description: 'Shown under the site name in the header and in the footer address.',
      validation: (rule) =>
        rule.required().error('Required: the header and footer show this location.'),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The big statement on the homepage hero. Keep it short.',
      validation: (rule) => rule.required().error('Required: the homepage hero needs a tagline.'),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'A few welcoming sentences under the tagline on the homepage.',
      validation: (rule) =>
        rule.required().error('Required: the homepage shows this introduction.'),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      description:
        'Public contact address used on the Get involved page for corrections. Leave empty and the page says corrections are not open yet.',
      validation: (rule) => rule.email().error('Must be a valid email address, or leave empty.'),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'location'},
  },
})
