import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'
import {
  pricesAgentDescription,
  priceModeDescription,
  serializedPricesAgentContract,
} from '../../../shared/lauraPricingContract'
import {PRICE_ICONS, priceCategoryError, priceOfferError} from '../../../shared/lauraPricing'

export const pricesPage = defineType({
  icon: DocumentIcon,
  name: 'pricesPage',
  title: 'Prices page',
  type: 'document',
  description: pricesAgentDescription,
  options: {agentEditingContract: serializedPricesAgentContract},
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small heading',
      type: 'string',
      description: 'Optional plain text above the page title.',
    }),
    ...[
      ['title', 'Page title', 'Required non-empty plain text. Public heading for /prices.'],
      [
        'introduction',
        'Introduction',
        'Required non-empty plain-text introduction. Use approved commercial copy only.',
      ],
      [
        'fallbackQuote',
        'Quote label for categories without rates',
        'Required non-empty quote label, used when a category has no offers field.',
      ],
      [
        'fallbackGuidance',
        'Quote guidance for categories without rates',
        'Required non-empty instructions for obtaining a quote when offers is unset.',
      ],
      [
        'enquiryLabel',
        'Category enquiry button text',
        'Required non-empty category action label, such as Ask for a quote.',
      ],
      [
        'contactHeading',
        'Contact invitation heading',
        'Required non-empty heading for the final contact invitation.',
      ],
      [
        'contactCopy',
        'Contact invitation copy',
        'Required non-empty plain text for the final contact invitation.',
      ],
    ].map(([name, title, description]) =>
      defineField({
        name: name!,
        title,
        description,
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
        'Required non-empty array in public display order. Categories are independent of Services. Preserve stable _key values and _type priceCategory. Read the full pricesPage description for the agent editing contract. Use approved commercial content only.',
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
              description:
                'Required non-empty category name. It need not equal the linked Service title.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Short description',
              type: 'text',
              rows: 2,
              description:
                'Optional plain text describing this pricing category, not a Portable Text array.',
            }),
            defineField({
              name: 'icon',
              title: 'Gold line icon',
              type: 'string',
              description:
                'Optional: palette, wall, window, smile or tuition. Omission uses palette.',
              options: {list: PRICE_ICONS.map((value) => ({title: value, value}))},
            }),
            defineField({
              name: 'service',
              title: 'Optional enquiry service',
              type: 'reference',
              to: [{type: 'service'}],
              description:
                'Optional reference to an existing published service with non-empty slug.current. Look up its real _id and store it in _ref with _type reference. Omit for a general enquiry. serviceSlug is derived, not editable.',
            }),
            defineField({
              name: 'offers',
              title: 'Price rows',
              type: 'array',
              description:
                'Optional array in display order. Unset for fallbackQuote/fallbackGuidance; an empty array is invalid. Preserve each stable _key and _type priceOffer. All rows are visible without expanding.',
              of: [
                {
                  type: 'object',
                  name: 'priceOffer',
                  title: 'Price row',
                  validation: (rule) => rule.custom((value) => priceOfferError(value) ?? true),
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Option name',
                      type: 'string',
                      description:
                        'Required non-empty plain-text name. Keep amounts and qualifiers in structured price fields.',
                    }),
                    defineField({
                      name: 'mode',
                      title: 'Price type',
                      type: 'string',
                      description: priceModeDescription,
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
                      description:
                        'Required for fixed/from: a positive finite JSON number, not a numeric string or formatted currency. Unset for range/quote. Zero, negative values, NaN and Infinity are invalid.',
                    }),
                    defineField({
                      name: 'minimum',
                      title: 'Range minimum',
                      type: 'number',
                      description:
                        'Required only for range: a positive finite JSON number less than maximum. Unset for fixed/from/quote.',
                    }),
                    defineField({
                      name: 'maximum',
                      title: 'Range maximum',
                      type: 'number',
                      description:
                        'Required only for range: a positive finite JSON number greater than minimum. Equal bounds are invalid. Unset for fixed/from/quote.',
                    }),
                    defineField({
                      name: 'currency',
                      title: 'Currency code',
                      type: 'string',
                      description:
                        'Required for fixed/from/range: an owner-approved uppercase currency code from options.agentEditingContract.currencyCodes, such as EUR. Unset for quote; do not infer currency from examples.',
                    }),
                    defineField({
                      name: 'scope',
                      title: 'Unit or scope',
                      type: 'string',
                      description:
                        'Required non-empty text for fixed/from/range describing the unit, size or duration, for example per session. Unset for quote. Use approved scope only.',
                    }),
                    defineField({
                      name: 'inclusions',
                      title: 'What is included',
                      type: 'array',
                      of: [{type: 'string'}],
                      description:
                        'Optional array of non-empty plain-text strings. Use approved inclusions; an empty array is allowed.',
                    }),
                    defineField({
                      name: 'qualifications',
                      title: 'Extras and cost factors',
                      type: 'text',
                      rows: 2,
                      description:
                        'Optional plain text. Material qualifications remain visible beside this option. Do not invent fees, tax treatment or other commercial terms.',
                    }),
                    defineField({
                      name: 'guidance',
                      title: 'Information needed for a quote',
                      type: 'text',
                      rows: 2,
                      description:
                        'Required non-empty plain text for quote mode explaining the information needed for a quote. Optional plain text for numeric modes.',
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
      description:
        'Optional array of at most three inspirationImage objects with stable _key values. Use real image asset references and non-empty imageAlt; preserve unrelated crop/hotspot metadata.',
      validation: (rule) => rule.max(3),
      of: [
        {
          type: 'object',
          name: 'inspirationImage',
          fields: [
            defineField({
              name: 'image',
              title: 'Artwork',
              type: 'image',
              options: {hotspot: true},
              description:
                'Existing Sanity image with an asset reference containing the real image asset _ref. Do not invent an ID or store a raw URL.',
            }),
            defineField({
              name: 'imageAlt',
              title: 'Artwork alt text',
              type: 'string',
              description:
                'Required non-empty plain text describing the included artwork for visitors who cannot see it.',
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
        'Optional array of non-empty plain-text strings, visible below the guide. An empty array is allowed. Put offer-specific qualifications beside the affected offer.',
    }),
    defineField({
      name: 'seo',
      title: 'Search listing',
      type: 'seo',
      description:
        'Required object with non-empty title and description strings. Both are required on Prices even though the shared seo type permits partial content elsewhere.',
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
