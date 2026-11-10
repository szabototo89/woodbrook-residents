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
    }),
    defineField({
      name: 'slug',
      title: 'Web address name',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description:
        'Set once when you create the collection and never change it afterwards — the address of its page uses it.',
    }),
    defineField({
      name: 'description',
      title: 'Collection description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences shown on the collection page.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Optional. Without an order, creation time (or update time) is used. Lower numbers appear first on the Gallery page and home preview.',
    }),
    defineField({
      name: 'photos',
      title: 'Pictures',
      type: 'array',
      description:
        'Pictures in this collection. Each picture uses its display order, or creation time (then update time) when unset.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'galleryItem'}],
        }),
      ],
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
