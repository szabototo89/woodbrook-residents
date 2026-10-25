import { validateImageSelection } from './imageValidation';
import { editorialHelp } from './editorialHelp';
import { defineType, defineField, defineArrayMember } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';

const requiredText = (name: string) =>
  defineField({
    name,
    type: 'string',
    validation: (rule) =>
      rule
        .required()
        .custom(
          (value) =>
            (typeof value === 'string' && value.trim().length > 0) ||
            'Enter non-empty text',
        ),
  });
const stringList = (name: string) =>
  defineField({
    name,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'string',
        validation: (rule) =>
          rule
            .required()
            .custom(
              (value) =>
                (typeof value === 'string' && value.trim().length > 0) ||
                'Enter non-empty text',
            ),
      }),
    ],
    validation: (rule) => rule.required().min(1),
  });
const objectField = (name: string, type: string) =>
  defineField({ name, type, validation: (rule) => rule.required() });

export const contentImage = defineType({
  name: 'contentImage',
  title: 'Image',
  type: 'image',
  icon: DocumentTextIcon,
  fields: [requiredText('alt')],
  validation: (rule) => rule.custom(validateImageSelection),
});

export const contentSource = defineType({
  name: 'contentSource',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('title'),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'accessed',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
  ],
});
export const pageMetadata = defineType({
  name: 'pageMetadata',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('title'),
    requiredText('description'),
    requiredText('socialDescription'),
  ],
});
export const service = defineType({
  name: 'service',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      options: { list: ['website', 'search', 'booking', 'content', 'support'] },
      validation: (rule) =>
        rule
          .required()
          .custom(
            (value) =>
              ['website', 'search', 'booking', 'content', 'support'].includes(
                value ?? '',
              ) || 'Choose a supported value',
          ),
    }),
    requiredText('title'),
    requiredText('description'),
    stringList('includes'),
  ],
});
export const packagePlan = defineType({
  name: 'package',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('title'),
    requiredText('description'),
    requiredText('price'),
    defineField({
      name: 'popular',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    stringList('features'),
  ],
});
export const processStep = defineType({
  name: 'processStep',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [requiredText('title'), requiredText('description')],
});
export const faq = defineType({
  name: 'faq',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [requiredText('question'), requiredText('answer')],
});
export const contact = defineType({
  name: 'contact',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('eyebrow'),
    requiredText('title'),
    requiredText('description'),
    requiredText('action'),
  ],
});
export const homeContact = defineType({
  name: 'homeContact',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('eyebrow'),
    requiredText('title'),
    requiredText('description'),
    requiredText('action'),
    requiredText('note'),
  ],
});
export const homeHero = defineType({
  name: 'homeHero',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('eyebrow'),
    stringList('title'),
    requiredText('description'),
    requiredText('action'),
    requiredText('workAction'),
    objectField('image', 'contentImage'),
    requiredText('note'),
    requiredText('caption'),
  ],
});
export const preparation = defineType({
  name: 'preparation',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('eyebrow'),
    requiredText('title'),
    requiredText('description'),
    stringList('items'),
    requiredText('action'),
  ],
});
export const navigationItem = defineType({
  name: 'navigationItem',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    requiredText('name'),
    defineField({
      name: 'href',
      type: 'string',
      options: { list: ['#services', '#work', '#about', '/blog', '#contact'] },
      validation: (rule) =>
        rule
          .required()
          .custom(
            (value) =>
              ['#services', '#work', '#about', '/blog', '#contact'].includes(
                value ?? '',
              ) || 'Choose a supported value',
          ),
    }),
  ],
});
export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    requiredText('brand'),
    objectField('logo', 'contentImage'),
    defineField({
      name: 'enquiryEmail',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    requiredText('enquirySubject'),
    requiredText('enquiryBody'),
    requiredText('footerServices'),
    defineField({
      name: 'navigation',
      type: 'array',
      of: [defineArrayMember({ type: 'navigationItem' })],
      validation: (rule) => rule.required().min(1),
    }),
    requiredText('talkLabel'),
  ],
});
export const homePage = defineType({
  name: 'homePage',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    objectField('seo', 'pageMetadata'),
    objectField('hero', 'homeHero'),
    requiredText('servicesTitle'),
    requiredText('servicesDescription'),
    defineField({
      name: 'services',
      type: 'array',
      of: [defineArrayMember({ type: 'service' })],
      validation: (rule) => rule.required().min(1),
    }),
    requiredText('includesLabel'),
    requiredText('workEyebrow'),
    requiredText('workTitle'),
    requiredText('workDescription'),
    defineField({
      name: 'selectedWork',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'selectedWork' }],
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    requiredText('packagesEyebrow'),
    stringList('packagesTitle'),
    requiredText('packagesDescription'),
    defineField({
      name: 'packages',
      type: 'array',
      of: [defineArrayMember({ type: 'package' })],
      validation: (rule) => rule.required().min(1),
    }),
    requiredText('popularLabel'),
    requiredText('pricePrefix'),
    requiredText('packageAction'),
    requiredText('processEyebrow'),
    requiredText('processTitle'),
    requiredText('processDescription'),
    defineField({
      name: 'steps',
      type: 'array',
      of: [defineArrayMember({ type: 'processStep' })],
      validation: (rule) => rule.required().min(1),
    }),
    objectField('preparation', 'preparation'),
    requiredText('faqTitle'),
    defineField({
      name: 'faqs',
      type: 'array',
      of: [defineArrayMember({ type: 'faq' })],
      validation: (rule) => rule.required().min(1),
    }),
    objectField('contact', 'homeContact'),
  ],
});
export const journalPage = defineType({
  name: 'journalPage',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    objectField('seo', 'pageMetadata'),
    requiredText('eyebrow'),
    stringList('title'),
    requiredText('description'),
    requiredText('backLabel'),
    requiredText('guidesLabel'),
    requiredText('sourceLabel'),
    requiredText('sourceDateLabel'),
    requiredText('homeLabel'),
    objectField('contact', 'contact'),
    defineField({
      name: 'guides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'journalGuide' }],
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
});
export const selectedWork = defineType({
  name: 'selectedWork',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'legacyId',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    requiredText('eyebrow'),
    requiredText('title'),
    requiredText('previewLabel'),
    requiredText('windowTitle'),
    requiredText('description'),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    requiredText('action'),
    objectField('image', 'contentImage'),
    objectField('source', 'contentSource'),
  ],
});
export const journalGuide = defineType({
  name: 'journalGuide',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'legacyId',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'editorialStatus',
      type: 'string',
      options: { list: ['needs-review', 'approved'] },
      validation: (rule) =>
        rule
          .required()
          .custom(
            (value) =>
              ['needs-review', 'approved'].includes(value ?? '') ||
              'Choose a supported value',
          ),
    }),
    defineField({
      name: 'id',
      title: 'Guide anchor',
      type: 'string',
      validation: (rule) => rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    }),
    requiredText('category'),
    requiredText('title'),
    requiredText('excerpt'),
    requiredText('action'),
    stringList('paragraphs'),
    objectField('source', 'contentSource'),
    defineField({ name: 'image', type: 'contentImage' }),
  ],
});
const contentTypes = [
  siteSettings,
  homePage,
  journalPage,
  selectedWork,
  journalGuide,
  contentSource,
  pageMetadata,
  service,
  packagePlan,
  processStep,
  faq,
  contact,
  homeContact,
  homeHero,
  preparation,
  navigationItem,
  contentImage,
];

export const schemaTypes = contentTypes.map((type) => ({
  ...type,
  fields: type.fields.map((field) => {
    const help = editorialHelp[type.name]?.[field.name];
    if (!help)
      throw new Error(`Missing editor help for ${type.name}.${field.name}`);
    return { ...field, ...help };
  }),
}));
