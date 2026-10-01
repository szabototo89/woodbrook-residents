import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {ImageIcon} from '@sanity/icons/Image'
import {TagIcon} from '@sanity/icons/Tag'
import {UserIcon} from '@sanity/icons/User'
import type {ComponentType} from 'react'
import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

const singleton = (S: StructureBuilder, title: string, id: string, icon?: ComponentType) => {
  const item = S.listItem().title(title).id(id)
  const withIcon = icon ? item.icon(icon) : item
  return withIcon.child(S.document().schemaType(id).documentId(id).title(title))
}

export default defineConfig({
  name: 'default',
  title: 'Laura Faichney All Things Art',

  projectId: 'uag6kepo',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Mirrors the public site navigation: Home, About, Services, Gallery.
            singleton(S, 'Home', 'homePage', HomeIcon),
            singleton(S, 'About', 'aboutPage', UserIcon),
            S.listItem()
              .title('Services')
              .id('services')
              .icon(TagIcon)
              .child(
                S.list()
                  .title('Services')
                  .items([
                    singleton(S, 'Services page', 'servicesPage'),
                    S.documentTypeListItem('service').title('All services'),
                  ]),
              ),
            S.listItem()
              .title('Gallery')
              .id('gallery')
              .icon(ImageIcon)
              .child(
                S.list()
                  .title('Gallery')
                  .items([
                    singleton(S, 'Gallery page', 'galleryPage'),
                    S.documentTypeListItem('galleryCollection').title('All collections'),
                    S.documentTypeListItem('galleryItem').title('All gallery items'),
                  ]),
              ),
            S.divider(),
            singleton(S, 'Site settings', 'siteSettings', CogIcon),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
