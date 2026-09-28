import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  description: 'Publish a real community date.',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({name: 'endsAt', title: 'Ends at', type: 'datetime'}),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'bookingUrl', title: 'Booking URL', type: 'url'}),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      validation: (r) => r.required().uri({allowRelative: false}),
    }),
    defineField({
      name: 'sourceReviewedOn',
      title: 'Source accessed date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'title', subtitle: 'startsAt'}},
})
