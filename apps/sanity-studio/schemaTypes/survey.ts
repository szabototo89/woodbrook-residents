import {defineField, defineType} from 'sanity'

export const surveyStages = ['upcoming', 'open', 'closed'] as const

function formatPreviewDate(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return 'No date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Invalid date'
  return parsed.toLocaleDateString('en-IE', {day: 'numeric', month: 'long', year: 'numeric'})
}

export const survey = defineType({
  name: 'survey',
  title: 'Survey',
  type: 'document',
  description:
    'A public consultation residents can respond to. Shown in the public site navigation as “Consultations”, with its own detail page and response button.',
  fieldsets: [
    {name: 'identity', title: 'Identity', options: {collapsible: true, collapsed: false}},
    {name: 'content', title: 'Content', options: {collapsible: true, collapsed: false}},
    {name: 'dates', title: 'Dates', options: {collapsible: true, collapsed: false}},
    {name: 'source', title: 'Source and freshness', options: {collapsible: true, collapsed: false}},
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
        'The end of the web address, e.g. have-your-say in /surveys/have-your-say. Changing it after publishing breaks existing links.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: without this the page has no address and cards link nowhere.'),
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      fieldset: 'content',
      options: {
        list: [...surveyStages].map((value) => ({title: value, value})),
        layout: 'dropdown',
      },
      description:
        'Shown as the coloured pill on the card. The response button only appears while the stage is open — set to closed when responses shut.',
      validation: (rule) => rule.required().error('Required: the card pill needs a stage.'),
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
      name: 'opensOn',
      title: 'Opens on',
      type: 'date',
      fieldset: 'dates',
      description: 'When responses open. Leave empty if unknown — that is safe.',
    }),
    defineField({
      name: 'closesOn',
      title: 'Closes on',
      type: 'date',
      fieldset: 'dates',
      description:
        'When responses close. Shown on the card as “Closes …” and drives the response button. Leave empty if unknown — that is safe.',
    }),
    defineField({
      name: 'responseUrl',
      title: 'Response link',
      type: 'url',
      fieldset: 'content',
      description:
        'Where residents respond, shown as the “Have your say” button while open. Hidden automatically once the stage is closed.',
    }),
    defineField({
      name: 'sourceName',
      title: 'Source name',
      type: 'string',
      fieldset: 'source',
      description:
        'Who runs the consultation, e.g. the Council. Shown in the “Source and freshness” box.',
      validation: (rule) =>
        rule.required().error('Required: every public fact must name its source.'),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source link',
      type: 'url',
      fieldset: 'source',
      description:
        'The official consultation page. Residents can click it. Must start with https://.',
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
        'The date you last checked the consultation page is current. Printed on the public page — must be a real date.',
      validation: (rule) =>
        rule
          .required()
          .error('Required: the page prints this date, and an empty date crashes the page.'),
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related project',
      type: 'reference',
      fieldset: 'content',
      to: [{type: 'project'}],
      description:
        'Internal link to a project, for editors only. Not shown on the public page — optional.',
    }),
  ],
  preview: {
    select: {title: 'title', stage: 'stage', closesOn: 'closesOn'},
    prepare({title, stage, closesOn}) {
      const closing =
        typeof closesOn === 'string' && closesOn.length > 0
          ? `Closes ${formatPreviewDate(closesOn)}`
          : 'No closing date'
      return {
        title: typeof title === 'string' ? title : 'Untitled consultation',
        subtitle: `${typeof stage === 'string' ? stage : '—'} · ${closing}`,
      }
    },
  },
})
