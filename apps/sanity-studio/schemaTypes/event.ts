import {defineField, defineType} from 'sanity'
import {EventCardEditor} from '../components/EventCardEditor'

function formatPreviewDateTime(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return 'No date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Invalid date'
  return parsed.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  description:
    'A real community date. Appears on the homepage (upcoming only), the Events timeline, and its own detail page with an add-to-calendar button.',
  components: {input: EventCardEditor},
  fieldsets: [
    {name: 'identity', title: 'Identity', options: {collapsible: true, collapsed: false}},
    {name: 'content', title: 'Content', options: {collapsible: true, collapsed: false}},
    {name: 'dates', title: 'Dates and venue', options: {collapsible: true, collapsed: false}},
    {name: 'source', title: 'Source and freshness', options: {collapsible: true, collapsed: false}},
    {name: 'featuring', title: 'Featuring', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'identity',
      description: 'The card heading and the page title residents see first.',
      validation: (rule) => rule.required().error('Required: every card and page needs a title.'),
    }),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      fieldset: 'identity',
      options: {source: 'title', maxLength: 96},
      description:
        'The end of the web address, e.g. summer-fair in /events/summer-fair. Changing it after publishing breaks existing links and calendar files.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: without this the page has no address and cards link nowhere.'),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      fieldset: 'content',
      description: 'One or two sentences shown on the card and under the page title.',
      validation: (rule) => rule.required().error('Required: cards show this text.'),
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      fieldset: 'dates',
      description:
        'When the event starts, including the time. Shown as the green date badge on the card and in the timeline — must be a real date and time.',
      validation: (rule) =>
        rule
          .required()
          .error(
            'Required: cards and the timeline print this date, and an empty date crashes the page.',
          ),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends at',
      type: 'datetime',
      fieldset: 'dates',
      description: 'When the event ends. Leave empty for open-ended events — that is safe.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      fieldset: 'dates',
      description:
        'Where it happens, e.g. “Shankill DART Station Car Park”. Shown on the card and links to Google Maps.',
      validation: (rule) =>
        rule.required().error('Required: the card and the map link need a venue.'),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking link',
      type: 'url',
      fieldset: 'content',
      description:
        'Registration or booking page, shown as the main button. Leave empty and the button links to the source instead.',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source link',
      type: 'url',
      fieldset: 'source',
      description:
        'The organiser page this event came from. Also used as the button fallback and inside calendar files. Must start with https://.',
      validation: (rule) =>
        rule
          .required()
          .uri({allowRelative: false})
          .error('Required: a full https:// link residents can open.'),
    }),
    defineField({
      name: 'sourceReviewedOn',
      title: 'Source last checked',
      type: 'date',
      fieldset: 'source',
      description:
        'The date you last checked the organiser page is still correct. Printed on the public page — must be a real date.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: the page prints this date, and an empty date crashes the page.'),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      fieldset: 'featuring',
      initialValue: false,
      description:
        'Featured upcoming events are preferred for the homepage hero pick. Switch on for at most one or two events at a time.',
    }),
  ],
  preview: {
    select: {title: 'title', startsAt: 'startsAt', location: 'location', featured: 'featured'},
    prepare({title, startsAt, location, featured}) {
      return {
        title: typeof title === 'string' ? title : 'Untitled event',
        subtitle: `${formatPreviewDateTime(startsAt)} · ${
          typeof location === 'string' && location.length > 0 ? location : 'No venue'
        }${featured === true ? ' · ★ Featured' : ''}`,
      }
    },
  },
})
