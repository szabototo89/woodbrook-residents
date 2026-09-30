import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Service name',
      type: 'string',
      description: 'Shown on the service card, for example "Murals (Indoor & Outdoor)".',
      validation: (rule) => rule.required().error('Give the service a name.'),
    }),
    defineField({
      name: 'slug',
      title: 'Web address name',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description:
        'Set once when you create the service and never change it afterwards — the contact form uses it to preselect this service for visitors.',
      validation: (rule) => rule.required().error('Generate the web address name for the service.'),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences shown under the service name on its card.',
      validation: (rule) => rule.required().error('Describe the service in a sentence or two.'),
    }),
    defineField({
      name: 'image',
      title: 'Service photo',
      type: 'image',
      options: {hotspot: true},
      description:
        'Photo on the service card. Drag the hotspot dot onto the most important part so it is never cropped out.',
      validation: (rule) =>
        rule.required().error('Add a photo — every service card needs its picture.'),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Service photo alt text',
      type: 'string',
      description:
        'Describe the photo for visitors who cannot see it. Example: Pink peony mural with green and gold leaves on a navy wall.',
      validation: (rule) =>
        rule.required().error('Describe the photo so screen readers can announce it.'),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first, on both the home page and the Services page.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', media: 'image'},
    prepare: ({title, subtitle}: Record<string, string | undefined>) => ({
      title: title ?? 'Untitled service',
      subtitle: subtitle ?? 'No description yet',
    }),
  },
})
