import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const galleryCollection = defineType({
  name: 'galleryCollection',
  title: 'Gallery collection',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Collection title',
      type: 'string',
      description: 'Shown on the collection card and its page, for example "Colour & nature".',
      validation: (rule) => rule.required().error('Give the collection a title.'),
    }),
    defineField({
      name: 'slug',
      title: 'Web address name',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description:
        'Set once when you create the collection and never change it afterwards — the address of its page uses it.',
      validation: (rule) =>
        rule.required().error('Generate the web address name for the collection.'),
    }),
    defineField({
      name: 'description',
      title: 'Collection description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences shown on the collection page.',
      validation: (rule) => rule.required().error('Describe the collection in a sentence or two.'),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first on the Gallery page and home preview.',
    }),
    defineField({
      name: 'photos',
      title: 'Pictures',
      type: 'array',
      description: 'Pictures in this collection, in the order visitors browse them.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'galleryItem'}],
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .error('Add at least one picture to the collection.')
          .min(1)
          .error('Add at least one picture to the collection.'),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
    prepare: ({title, subtitle}: Record<string, string | undefined>) => ({
      title: title ?? 'Untitled collection',
      subtitle: subtitle ?? 'No description yet',
    }),
  },
})
