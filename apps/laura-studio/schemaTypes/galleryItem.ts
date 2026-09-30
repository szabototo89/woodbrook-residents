import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

const HOME_PREVIEW_LIMIT = 6

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
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional one-line caption kept with the artwork for future site updates.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on the home page',
      type: 'boolean',
      initialValue: false,
      description:
        'Feature this artwork in the home page preview. Keep six or fewer featured so the preview grid stays tidy.',
      validation: (rule) =>
        rule.custom(async (featured, context) => {
          if (!featured) {
            return true
          }
          const client = context.getClient({apiVersion: '2025-09-01'})
          const selfId = String(context.document?._id ?? '').replace(/^drafts\./, '')
          const others = await client.fetch<number>(
            `count(*[_type == "galleryItem" && featured == true && !(_id in [$self, $draft])])`,
            {self: selfId, draft: `drafts.${selfId}`},
          )
          if (others >= HOME_PREVIEW_LIMIT) {
            return 'Only six artworks fit the home page preview — unfeature another one first.'
          }
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first, on both the home page and the Gallery page.',
    }),
  ],
  preview: {
    select: {title: 'imageAlt', subtitle: 'caption', media: 'image'},
    prepare: ({title, subtitle}: Record<string, string | undefined>) => ({
      title: title ?? 'Untitled artwork',
      subtitle: subtitle ?? 'No caption yet',
    }),
  },
})
