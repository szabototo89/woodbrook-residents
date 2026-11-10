import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const galleryPage = defineType({
  name: 'galleryPage',
  title: 'Gallery page',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Page banner',
      type: 'pageHero',
      description: 'Banner at the top of the Gallery page.',
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      description: 'How the Gallery page appears in Google results and browser tabs.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Gallery page', subtitle: 'Banner above the artwork grid'}),
  },
})
