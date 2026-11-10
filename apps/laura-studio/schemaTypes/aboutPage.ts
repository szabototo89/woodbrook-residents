import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: UserIcon,
  fieldsets: [{name: 'story', title: 'My story', options: {columns: 1}}],
  fields: [
    defineField({
      name: 'hero',
      title: 'Page banner',
      type: 'pageHero',
      description: 'Banner at the top of the About page.',
    }),
    defineField({
      name: 'values',
      title: 'Strengths',
      type: 'array',
      description: 'The strengths shown under the banner, for example Creative & Bespoke.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Strength',
          fields: [
            defineField({
              name: 'icon',
              title: 'Symbol',
              type: 'string',
              options: {
                list: [
                  {title: 'Paint palette', value: 'palette'},
                  {title: 'Heart', value: 'heart'},
                  {title: 'Sparkles', value: 'sparkles'},
                  {title: 'Map pin', value: 'pin'},
                ],
                layout: 'radio',
              },
              description: 'Small symbol shown above the strength.',
            }),
            defineField({
              name: 'title',
              title: 'Strength title',
              type: 'string',
              description: 'Short title, for example "Brighter Spaces".',
            }),
            defineField({
              name: 'text',
              title: 'Strength text',
              type: 'string',
              description: 'One sentence saying what the strength means.',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text'},
          },
        }),
      ],
    }),
    defineField({
      name: 'storyHeading',
      title: 'Story heading',
      type: 'string',
      fieldset: 'story',
      initialValue: 'My Story',
      description: 'Heading above your personal story on the About page.',
    }),
    defineField({
      name: 'storyBody',
      title: 'Story text',
      type: 'text',
      rows: 6,
      fieldset: 'story',
      initialValue:
        'Art has always been a big part of my life. I love how it can transform a space, bring people together and create moments of joy. Whether it’s a mural, a painting for a home, or a first experience with facepainting, my goal is to make everyday spaces a little brighter.',
      description: 'Your personal story on the About page.',
    }),
    defineField({
      name: 'storyImage',
      title: 'Story portrait',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'story',
      description:
        'Portrait beside your story. Drag the hotspot dot onto the face so it is never cropped out.',
    }),
    defineField({
      name: 'storyImageAlt',
      title: 'Story portrait alt text',
      type: 'string',
      fieldset: 'story',
      description:
        'Describe the portrait for visitors who cannot see it. Example: Colourful painted portrait.',
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      description: 'How the About page appears in Google results and browser tabs.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'About page', subtitle: 'Banner, strengths and story'}),
  },
})
