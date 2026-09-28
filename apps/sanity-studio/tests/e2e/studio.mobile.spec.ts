import {expect, test} from '@playwright/test'

test('studio shell loads on a mobile viewport', async ({page}) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Sanity Studio')
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    'content',
    /width=device-width/,
  )
})
