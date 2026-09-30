import {expect, test} from 'vitest'

import config from './sanity.cli'

test('studio CLI pins the Laura Faichney Sanity project', () => {
  expect(config.api?.projectId).toBe('uag6kepo')
  expect(config.api?.dataset).toBe('production')
})

test('studio deployment pins the Laura hosted studio app', () => {
  expect(config.deployment?.autoUpdates).toBe(true)
  expect(config.deployment?.appId).toBe('cgc7vn8omh5cxqmml5r712km')
  expect(config.deployment?.appId).not.toBe('bl90tx091wi90lyyqzz6mwbl')
  expect(config.studioHost).toBe('laura-faichney-all-things-art')
})
