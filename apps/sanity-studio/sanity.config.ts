import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singleton = (S: StructureBuilder, title: string, id: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id))

const filtered = (S: StructureBuilder, title: string, id: string, type: string, filter: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.documentList().title(title).filter(`_type == "${type}" && (${filter})`))

export default defineConfig({
  name: 'default',
  title: 'Woodbrook Residents',

  projectId: 'ca34quae',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Mirrors the public site navigation: Updates, Events, Projects,
            // Consultations, Local information.
            S.listItem()
              .title('Updates')
              .id('updates')
              .child(
                S.list()
                  .title('Updates')
                  .items([
                    S.documentTypeListItem('update').title('All updates'),
                    filtered(
                      S,
                      'Featured updates',
                      'featured-updates',
                      'update',
                      'featured == true',
                    ),
                    filtered(
                      S,
                      'Updates missing source data',
                      'updates-missing-source',
                      'update',
                      '!defined(sourceUrl) || sourceUrl == "" || !defined(sourceReviewedOn)',
                    ),
                  ]),
              ),
            S.listItem()
              .title('Events')
              .id('events')
              .child(
                S.list()
                  .title('Events')
                  .items([
                    S.documentTypeListItem('event').title('All events'),
                    filtered(S, 'Upcoming events', 'upcoming-events', 'event', 'startsAt >= now()'),
                    filtered(S, 'Past events', 'past-events', 'event', 'startsAt < now()'),
                    filtered(S, 'Featured events', 'featured-events', 'event', 'featured == true'),
                  ]),
              ),
            S.listItem()
              .title('Projects')
              .id('projects')
              .child(
                S.list()
                  .title('Projects')
                  .items([
                    S.documentTypeListItem('project').title('All projects'),
                    filtered(
                      S,
                      'Featured projects',
                      'featured-projects',
                      'project',
                      'featured == true',
                    ),
                    filtered(
                      S,
                      'Projects missing source data',
                      'projects-missing-source',
                      'project',
                      '!defined(sourceUrl) || sourceUrl == "" || !defined(sourceReviewedOn)',
                    ),
                  ]),
              ),
            S.listItem()
              .title('Consultations')
              .id('consultations')
              .child(
                S.list()
                  .title('Consultations')
                  .items([
                    S.documentTypeListItem('survey').title('All consultations'),
                    filtered(S, 'Open consultations', 'open-surveys', 'survey', 'stage == "open"'),
                  ]),
              ),
            S.listItem()
              .title('Directory')
              .id('directory')
              .child(
                S.list()
                  .title('Directory')
                  .items([
                    S.documentTypeListItem('resource').title('All directory entries'),
                    filtered(
                      S,
                      'Featured entries',
                      'featured-resources',
                      'resource',
                      'featured == true',
                    ),
                  ]),
              ),
            S.divider(),
            singleton(S, 'Site setting', 'siteSetting'),
            S.divider(),
            // Operational records only. Never published to the public website.
            S.listItem()
              .title('Issue reports (private)')
              .id('issueReports')
              .child(S.documentTypeList('issueReport').title('Issue reports (private)')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
