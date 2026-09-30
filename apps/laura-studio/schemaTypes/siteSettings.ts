import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fieldsets: [{name: 'contactStrip', title: 'Get-in-touch strip', options: {columns: 1}}],
  fields: [
    defineField({
      name: 'contactEmail',
      title: 'Contact email address',
      type: 'string',
      description: 'Shown in the contact strip on every page and on the Contact page.',
      validation: (rule) =>
        rule
          .required()
          .error('Add your email address so visitors can reach you.')
          .email()
          .error('Enter a valid email address, like name@example.com.'),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact phone number',
      type: 'string',
      initialValue: '089-4007747',
      description: 'Shown next to the email address. Visitors on phones can tap it to call.',
      validation: (rule) =>
        rule.required().error('Add your phone number so visitors can call you.'),
    }),
    defineField({
      name: 'contactMailtoSubject',
      title: 'Email subject line',
      type: 'string',
      initialValue: 'Art project enquiry',
      description: 'Prefilled subject when a visitor clicks the Start a Project button.',
      validation: (rule) => rule.required().error('Add the email subject visitors will send with.'),
    }),
    defineField({
      name: 'contactEyebrow',
      title: 'Strip tagline',
      type: 'string',
      fieldset: 'contactStrip',
      initialValue: 'Let’s create something special',
      description: 'Small line above the Get in Touch heading on every page.',
      validation: (rule) => rule.required().error('Add the tagline for the contact strip.'),
    }),
    defineField({
      name: 'contactHeading',
      title: 'Strip heading',
      type: 'string',
      fieldset: 'contactStrip',
      initialValue: 'Get in Touch',
      description: 'Big heading of the contact strip on every page.',
      validation: (rule) => rule.required().error('Add the heading for the contact strip.'),
    }),
    defineField({
      name: 'contactCopy',
      title: 'Strip invitation',
      type: 'text',
      rows: 2,
      fieldset: 'contactStrip',
      initialValue:
        'Have a painting, mural, event or creative session in mind? I’d love to hear from you.',
      description: 'Friendly invitation under the contact strip heading on every page.',
      validation: (rule) => rule.required().error('Add the invitation for the contact strip.'),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings', subtitle: 'Contact details shared by every page'}),
  },
})
