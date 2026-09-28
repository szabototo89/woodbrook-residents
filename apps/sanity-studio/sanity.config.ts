import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

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
            S.listItem()
              .title('Site setting')
              .id('siteSetting')
              .child(S.document().schemaType('siteSetting').documentId('siteSetting')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteSetting'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
