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
      validation: (rule) => rule.required().error('Fill in the About page banner.'),
    }),
    defineField({
      name: 'values',
      title: 'Strengths',
      type: 'array',
      description: 'The four strengths shown under the banner, for example Creative & Bespoke.',
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
              validation: (rule) => rule.required().error('Pick a symbol for the strength.'),
            }),
            defineField({
              name: 'title',
              title: 'Strength title',
              type: 'string',
              description: 'Short title, for example "Brighter Spaces".',
              validation: (rule) => rule.required().error('Give the strength a title.'),
            }),
            defineField({
              name: 'text',
              title: 'Strength text',
              type: 'string',
              description: 'One sentence saying what the strength means.',
              validation: (rule) => rule.required().error('Add one sentence for the strength.'),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text'},
          },
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .error('Add your four strengths for the About page.')
          .min(4)
          .error('The About page shows four strengths — add all four.')
          .max(4)
          .error('The About page shows four strengths — remove the extra one.'),
    }),
    defineField({
      name: 'storyHeading',
      title: 'Story heading',
      type: 'string',
      fieldset: 'story',
      initialValue: 'My Story',
      description: 'Heading above your personal story on the About page.',
      validation: (rule) => rule.required().error('Add the heading for your story.'),
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
      validation: (rule) => rule.required().error('Write your story for the About page.'),
    }),
    defineField({
      name: 'storyImage',
      title: 'Story portrait',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'story',
      description:
        'Portrait beside your story. Drag the hotspot dot onto the face so it is never cropped out.',
      validation: (rule) => rule.required().error('Add your portrait beside the story.'),
    }),
    defineField({
      name: 'storyImageAlt',
      title: 'Story portrait alt text',
      type: 'string',
      fieldset: 'story',
      description:
        'Describe the portrait for visitors who cannot see it. Example: Colourful painted portrait.',
      validation: (rule) =>
        rule.required().error('Describe the portrait so screen readers can announce it.'),
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      description: 'How the About page appears in Google results and browser tabs.',
      validation: (rule) => rule.required().error('Fill in the search listing for the About page.'),
    }),
  ],
  preview: {
    prepare: () => ({title: 'About page', subtitle: 'Banner, strengths and story'}),
  },
})
