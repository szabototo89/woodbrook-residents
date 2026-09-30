import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'uag6kepo',
    dataset: 'production',
  },
  studioHost: 'laura-faichney-all-things-art',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'cgc7vn8omh5cxqmml5r712km',
  },
})
