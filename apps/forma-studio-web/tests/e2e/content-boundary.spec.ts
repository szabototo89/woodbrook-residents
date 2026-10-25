import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('public routes use prerendered content without browser Sanity requests or draft data', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname.endsWith('.api.sanity.io'))
      requests.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Email us' })).toHaveAttribute(
    'href',
    /^mailto:szabototo89@gmail.com\?/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Modern websites, local SEO/,
  );
  await page.goto('/blog');
  await page.getByText('Read guide', { exact: false }).click();
  await expect(
    page.getByRole('link', { name: 'Google’s SEO Starter Guide' }),
  ).toHaveAttribute(
    'href',
    'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
  );
  expect(requests).toEqual([]);
  ['dist/client/index.html', 'dist/client/blog/index.html'].map((path) => {
    const html = readFileSync(path, 'utf8');
    expect(html).not.toContain('drafts.');
    expect(html).not.toContain('FORMA_SANITY_READ_TOKEN');
  });
});

test('capture the live Sanity-backed pages at high resolution', async ({
  browser,
}, info) => {
  test.skip(
    info.project.name !== 'desktop',
    'One set of high-resolution desktop and phone artifacts.',
  );
  const output = '../../docs/handoffs/forma-sanity-content/assets';
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 1000 }],
    ['mobile', { width: 390, height: 844 }],
  ] as const) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4178/');
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole('img', { name: /laptop displaying/i }),
    ).toBeVisible();
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    await page.goto('http://127.0.0.1:4178/blog');
    await page.getByText('Read guide', { exact: false }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${output}/journal-${name}.png`,
      fullPage: true,
    });
    await context.close();
  }
});
