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
    }),
    defineField({
      name: 'title',
      title: 'Banner heading',
      type: 'text',
      rows: 2,
      description: 'The big heading in the page banner. Write each line on its own row.',
    }),
    defineField({
      name: 'description',
      title: 'Banner introduction',
      type: 'text',
      rows: 3,
      description: 'Short paragraph under the banner heading.',
    }),
    defineField({
      name: 'image',
      title: 'Banner artwork',
      type: 'image',
      options: {hotspot: true},
      description:
        'Artwork on the side of the page banner. Drag the hotspot dot onto the most important part so it is never cropped out.',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Banner artwork alt text',
      type: 'string',
      description:
        'Describe the artwork for visitors who cannot see it. Example: A collection of colourful paintings featuring a flower, a cow, and a coastal scene.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Banner button text',
      type: 'string',
      description: 'Text on the banner button. Leave empty if this banner has no button.',
    }),
  ],
})
