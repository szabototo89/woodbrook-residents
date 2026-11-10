import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

type Announcement = {
  enabled?: boolean
  title?: string
  message?: string
  link?: {label?: string; href?: string}
}

function validateAnnouncement(value: Announcement | undefined): true | string {
  if (!value?.enabled) return true
  if (!value.link) return true
  if (!value.link.href?.trim()) return true
  const href = value.link.href.trim()
  if (/^\/(?![/\\])/.test(href) || (URL.canParse(href) && /^https?:\/\//.test(href))) return true
  return 'Use a site path such as /contact or a full https:// address.'
}

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  fieldsets: [
    {name: 'hero', title: 'Top banner', options: {columns: 1}},
    {name: 'sections', title: 'Page sections', options: {columns: 1}},
    {name: 'testimonial', title: 'Client quote', options: {columns: 1}},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Page banner',
      type: 'pageHero',
      fieldset: 'hero',
      initialValue: {
        eyebrow: 'Bold art · brighter spaces · happier people',
        title: 'Bold Art\nBrighter Spaces',
        description:
          'Commissioned paintings, murals, signage, facepainting and art tutoring — bringing more colour and creativity to everyday spaces.',
        ctaLabel: 'View My Work',
      },
      description:
        'Banner at the top of the home page. The button always opens the Gallery page; add the portrait below.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero portrait',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'hero',
      description:
        'Portrait beside the home page heading. Drag the hotspot dot onto the face so it is never cropped out.',
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero portrait alt text',
      type: 'string',
      fieldset: 'hero',
      description:
        'Describe the portrait for visitors who cannot see it. Example: Expressive painted portrait in vivid pink, blue, orange and yellow.',
    }),
    defineField({
      name: 'announcement',
      title: 'Homepage announcement',
      type: 'object',
      description:
        'Optional update above the home page banner. Publish, then rebuild and deploy the website to show changes.',
      validation: (rule) => rule.custom(validateAnnouncement),
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show announcement',
          type: 'boolean',
          initialValue: false,
          description: 'Turn off to hide the whole section while keeping your draft text.',
        }),
        defineField({
          name: 'title',
          title: 'Announcement heading',
          type: 'string',
          description: 'Short heading for the update above the banner.',
        }),
        defineField({
          name: 'message',
          title: 'Announcement message',
          type: 'text',
          rows: 3,
          description: 'Explain the update in a short paragraph. Line breaks are preserved.',
        }),
        defineField({
          name: 'link',
          title: 'Optional button',
          type: 'object',
          description:
            'Add a button only when visitors have a next step; remove it for a message without a link.',
          fields: [
            defineField({
              name: 'label',
              title: 'Button text',
              type: 'string',
              description: 'Describe the action, for example View the gallery.',
            }),
            defineField({
              name: 'href',
              title: 'Button link',
              type: 'string',
              description: 'Use a site path such as /gallery or a full https:// address.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'servicesHeading',
      title: 'Services section heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Art for Homes, Businesses & Events',
      description: 'Heading above the service cards on the home page.',
    }),
    defineField({
      name: 'muralEyebrow',
      title: 'Mural section tagline',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Transform spaces',
      description: 'Small line above the mural section heading on the home page.',
    }),
    defineField({
      name: 'muralHeading',
      title: 'Mural section heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Murals that bring spaces to life',
      description: 'Heading of the mural feature on the home page.',
    }),
    defineField({
      name: 'muralCopy',
      title: 'Mural section text',
      type: 'text',
      rows: 3,
      fieldset: 'sections',
      initialValue:
        'From homes and nurseries to businesses and events, a hand-painted mural adds colour and character to a space.',
      description: 'Short paragraph in the mural feature on the home page.',
    }),
    defineField({
      name: 'muralCtaLabel',
      title: 'Mural button text',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Enquire about a mural',
      description: 'Button in the mural feature. It always opens the Contact page.',
    }),
    defineField({
      name: 'muralImage',
      title: 'Mural section artwork',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'sections',
      description:
        'Large artwork beside the mural feature. Drag the hotspot dot onto the most important part so it is never cropped out.',
    }),
    defineField({
      name: 'muralImageAlt',
      title: 'Mural artwork alt text',
      type: 'string',
      fieldset: 'sections',
      description:
        'Describe the artwork for visitors who cannot see it. Example: Large pink painted flower with green leaves.',
    }),
    defineField({
      name: 'galleryHeading',
      title: 'Gallery preview heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'A glimpse of my work',
      description: 'Heading above the artwork preview on the home page.',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About preview photo',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'sections',
      description: 'Studio photo beside the About preview on the home page.',
    }),
    defineField({
      name: 'aboutImageAlt',
      title: 'About preview photo alt text',
      type: 'string',
      fieldset: 'sections',
      description:
        'Describe the photo for visitors who cannot see it. Example: Paintbrushes, palettes and colourful canvases in an artist’s studio.',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About preview heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Art, colour and people are what inspire me',
      description: 'Heading of the About preview on the home page.',
    }),
    defineField({
      name: 'aboutCopy',
      title: 'About preview text',
      type: 'text',
      rows: 4,
      fieldset: 'sections',
      initialValue:
        'Hi, I’m Laura — an artist and creative all-rounder. I love transforming spaces with bold, colourful art and helping people discover their creativity through painting, facepainting and art tutoring.',
      description: 'Short introduction in the About preview on the home page.',
    }),
    defineField({
      name: 'testimonialQuote',
      title: 'Client quote',
      type: 'text',
      rows: 3,
      fieldset: 'testimonial',
      initialValue:
        'Laura created a stunning mural for our nursery. It has completely transformed the space and the children absolutely love it!',
      description:
        'The kind-words quote shown on the home page. Keep it to two or three sentences.',
    }),
    defineField({
      name: 'testimonialAuthor',
      title: 'Quote author name',
      type: 'string',
      fieldset: 'testimonial',
      initialValue: 'Sarah O’Connor',
      description: 'Name shown under the client quote.',
    }),
    defineField({
      name: 'testimonialRole',
      title: 'Quote author role',
      type: 'string',
      fieldset: 'testimonial',
      initialValue: 'Nursery owner',
      description: 'Short role shown after the author name, for example "Nursery owner".',
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      description: 'How the home page appears in Google results and browser tabs.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home page', subtitle: 'Hero, sections and client quote'}),
  },
})
