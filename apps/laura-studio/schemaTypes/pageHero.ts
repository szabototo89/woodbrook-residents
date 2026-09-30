import {defineField, defineType} from 'sanity'

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Page hero',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small heading above the title',
      type: 'string',
      description: 'Short label at the top of the page banner, for example "Gallery".',
      validation: (rule) =>
        rule.required().error('Add the small heading so the banner does not look empty.'),
    }),
    defineField({
      name: 'title',
      title: 'Banner heading',
      type: 'text',
      rows: 2,
      description: 'The big heading in the page banner. Write each line on its own row.',
      validation: (rule) =>
        rule.required().error('Add the banner heading — it is the first thing visitors read.'),
    }),
    defineField({
      name: 'description',
      title: 'Banner introduction',
      type: 'text',
      rows: 3,
      description: 'Short paragraph under the banner heading.',
      validation: (rule) => rule.required().error('Add a short introduction for the banner.'),
    }),
    defineField({
      name: 'image',
      title: 'Banner artwork',
      type: 'image',
      options: {hotspot: true},
      description:
        'Artwork on the side of the page banner. Drag the hotspot dot onto the most important part so it is never cropped out.',
      validation: (rule) =>
        rule.required().error('Add banner artwork — every page banner needs its picture.'),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Banner artwork alt text',
      type: 'string',
      description:
        'Describe the artwork for visitors who cannot see it. Example: A collection of colourful paintings featuring a flower, a cow, and a coastal scene.',
      validation: (rule) =>
        rule.required().error('Describe the artwork so screen readers can announce it.'),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Banner button text',
      type: 'string',
      description: 'Text on the banner button. Leave empty if this banner has no button.',
    }),
  ],
})
