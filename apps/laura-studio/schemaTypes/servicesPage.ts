import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Page banner',
      type: 'pageHero',
      description: 'Banner at the top of the Services page.',
      validation: (rule) => rule.required().error('Fill in the Services page banner.'),
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      description: 'How the Services page appears in Google results and browser tabs.',
      validation: (rule) =>
        rule.required().error('Fill in the search listing for the Services page.'),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Services page', subtitle: 'Banner above the service list'}),
  },
})
