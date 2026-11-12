import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'
import {PRICE_ICONS, priceCategoryError, priceOfferError} from '../../../shared/lauraPricing'

export const pricesPage = defineType({
  icon: DocumentIcon,
  name: 'pricesPage',
  title: 'Prices page',
  type: 'document',
  fields: [
    defineField({name: 'eyebrow', title: 'Small heading', type: 'string'}),
    ...[
      ['title', 'Page title'],
      ['introduction', 'Introduction'],
      ['fallbackQuote', 'Quote label for categories without rates'],
      ['fallbackGuidance', 'Quote guidance for categories without rates'],
      ['enquiryLabel', 'Category enquiry button text'],
      ['contactHeading', 'Contact invitation heading'],
      ['contactCopy', 'Contact invitation copy'],
    ].map(([name, title]) =>
      defineField({
        name: name!,
        title,
        type: 'string',
        validation: (rule) =>
          rule
            .required()
            .custom((value) =>
              typeof value === 'string' && value.trim() ? true : 'Enter non-empty text.',
            ),
      }),
    ),
    defineField({
      name: 'categories',
      title: 'Pricing categories',
      type: 'array',
      description:
        'Independent of Services. Drag to reorder. Use only Laura-approved rates and commercial terms.',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'priceCategory',
          title: 'Pricing category',
          validation: (rule) => rule.custom((value) => priceCategoryError(value) ?? true),
          fields: [
            defineField({
              name: 'title',
              title: 'Category name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'description', title: 'Short description', type: 'text', rows: 2}),
            defineField({
              name: 'icon',
              title: 'Gold line icon',
              type: 'string',
              options: {list: PRICE_ICONS.map((value) => ({title: value, value}))},
            }),
            defineField({
              name: 'service',
              title: 'Optional enquiry service',
              type: 'reference',
              to: [{type: 'service'}],
              description:
                'Select a published service to preselect it in the contact form. Leave empty for a general enquiry.',
            }),
            defineField({
              name: 'offers',
              title: 'Price rows',
              type: 'array',
              description:
                'Leave unset to show the page’s quote guidance. All rows are visible without expanding.',
              of: [
                {
                  type: 'object',
                  name: 'priceOffer',
                  title: 'Price row',
                  validation: (rule) => rule.custom((value) => priceOfferError(value) ?? true),
                  fields: [
                    defineField({name: 'label', title: 'Option name', type: 'string'}),
                    defineField({
                      name: 'mode',
                      title: 'Price type',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Fixed price', value: 'fixed'},
                          {title: 'Starting from', value: 'from'},
                          {title: 'Guide range', value: 'range'},
                          {title: 'Quote on request', value: 'quote'},
                        ],
                      },
                    }),
                    defineField({
                      name: 'amount',
                      title: 'Fixed or starting amount',
                      type: 'number',
                      description: 'Use only for fixed/from. Clear this field for range/quote.',
                    }),
                    defineField({name: 'minimum', title: 'Range minimum', type: 'number'}),
                    defineField({name: 'maximum', title: 'Range maximum', type: 'number'}),
                    defineField({
                      name: 'currency',
                      title: 'Currency code',
                      type: 'string',
                      description:
                        'For example EUR. Confirm currency with Laura. Clear for quote-only rows.',
                    }),
                    defineField({
                      name: 'scope',
                      title: 'Unit or scope',
                      type: 'string',
                      description:
                        'For example per person / 60 minutes, or up to 30 × 30 cm. Clear for quote-only rows.',
                    }),
                    defineField({
                      name: 'inclusions',
                      title: 'What is included',
                      type: 'array',
                      of: [{type: 'string'}],
                    }),
                    defineField({
                      name: 'qualifications',
                      title: 'Extras and cost factors',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({
                      name: 'guidance',
                      title: 'Information needed for a quote',
                      type: 'text',
                      rows: 2,
                      description: 'Required for quote-only rows.',
                    }),
                  ],
                  preview: {select: {title: 'label', subtitle: 'mode'}},
                },
              ],
            }),
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    }),
    defineField({
      name: 'inspiration',
      title: 'Inspiration artwork',
      type: 'array',
      validation: (rule) => rule.max(3),
      of: [
        {
          type: 'object',
          name: 'inspirationImage',
          fields: [
            defineField({name: 'image', title: 'Artwork', type: 'image', options: {hotspot: true}}),
            defineField({
              name: 'imageAlt',
              title: 'Artwork alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'sharedNotes',
      title: 'Shared pricing notes',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Visible below the price guide. Put offer-specific qualifications beside the relevant price.',
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      validation: (rule) =>
        rule.required().custom((value) => {
          const seo = value as {title?: string; description?: string} | undefined
          return seo?.title?.trim() && seo.description?.trim()
            ? true
            : 'Enter both a search title and description.'
        }),
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Prices page',
      subtitle: 'Independent pricing categories and quote guidance',
    }),
  },
})
