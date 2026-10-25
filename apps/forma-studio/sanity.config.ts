import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

const singletons = new Set(['homePage', 'journalPage', 'siteSettings']);
export default defineConfig({
  name: 'default',
  title: 'Forma Studio',
  projectId: 'ms27me7o',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Forma content')
          .items([
            ...['homePage', 'journalPage', 'siteSettings'].map((id) =>
              S.listItem()
                .id(id)
                .title(
                  {
                    homePage: 'Homepage',
                    journalPage: 'Journal page',
                    siteSettings: 'Site settings',
                  }[id] ?? id,
                )
                .child(S.document().schemaType(id).documentId(id)),
            ),
            S.documentTypeListItem('selectedWork').title('Selected work'),
            S.documentTypeListItem('journalGuide').title('Journal guides'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletons.has(template.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter((action) => action.action !== 'duplicate')
        : actions,
  },
});
