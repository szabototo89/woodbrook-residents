import {expect, test} from 'vitest'

import config from './sanity.cli'

test('studio CLI pins the Laura Faichney Sanity project', () => {
  expect(config.api?.projectId).toBe('uag6kepo')
  expect(config.api?.dataset).toBe('production')
})

test('studio deployment enables auto-updates without the old Woodbrook app id', () => {
  expect(config.deployment?.autoUpdates).toBe(true)
  expect(config.deployment?.appId).not.toBe('bl90tx091wi90lyyqzz6mwbl')
})
