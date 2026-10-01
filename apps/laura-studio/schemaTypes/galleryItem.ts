import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery item',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Artwork',
      type: 'image',
      options: {hotspot: true},
      description:
        'Your artwork photo. Drag the hotspot dot onto the most important part so it is never cropped out.',
      validation: (rule) =>
        rule.required().error('Upload the artwork — a gallery item needs its picture.'),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Artwork alt text',
      type: 'string',
      description:
        'Describe the artwork for visitors who cannot see it. Example: Pink flowers against a blue sky.',
      validation: (rule) =>
        rule.required().error('Describe the artwork so screen readers can announce it.'),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first wherever the picture is shown.',
    }),
  ],
  preview: {
    select: {title: 'imageAlt', media: 'image'},
    prepare: ({title}: Record<string, string | undefined>) => ({
      title: title ?? 'Untitled artwork',
      subtitle: 'Gallery picture',
    }),
  },
})
