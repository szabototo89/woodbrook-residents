import {expect, test} from 'vitest'

import config from './sanity.cli'

test('studio CLI pins the Woodbrook Sanity project', () => {
  expect(config.api?.projectId).toBe('ca34quae')
  expect(config.api?.dataset).toBe('production')
})

test('studio deployment enables auto-updates with the hosted app id', () => {
  expect(config.deployment?.autoUpdates).toBe(true)
  expect(config.deployment?.appId).toBe('bl90tx091wi90lyyqzz6mwbl')
})
