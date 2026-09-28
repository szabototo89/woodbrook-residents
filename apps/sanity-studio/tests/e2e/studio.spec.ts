import {expect, test} from '@playwright/test'

test('studio shell serves the production build', async ({page}) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Sanity Studio')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/static/manifest.webmanifest',
  )
})

test('studio static assets are served with the build', async ({page}) => {
  const manifest = await page.request.get('/static/manifest.webmanifest')
  expect(manifest.ok()).toBe(true)

  const favicon = await page.request.get('/static/favicon.ico')
  expect(favicon.ok()).toBe(true)
})
