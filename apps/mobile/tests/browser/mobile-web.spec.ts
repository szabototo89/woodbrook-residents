import { expect, test } from '@playwright/test';

test('browser renderer loads shared runtime content and navigates', async ({
  page,
}) => {
  await page.goto('/');

  const lynxView = page.locator('lynx-view');
  await expect(lynxView).toHaveAttribute('url', /woodbrook\.web\.bundle/);
  await expect(page.locator('main')).toHaveAttribute(
    'aria-label',
    'Woodbrook Residents mobile application',
  );
  await expect(
    page.getByText('Local information and ways to take part.'),
  ).toBeVisible();

  await page.getByText('More', { exact: true }).first().click();
  await page.getByText('Projects', { exact: true }).first().click();
  await expect(
    page.getByText('A simple record of what is proposed'),
  ).toBeVisible();
  await page.getByText('Green space project').click();
  await expect(page.getByText('Project details.')).toBeVisible();
});

test('production host serves the Lynx bundle from the same origin', async ({
  request,
}) => {
  const response = await request.get('/lynx/woodbrook.web.bundle');

  expect(response.ok()).toBe(true);
  expect(response.headers()['access-control-allow-origin']).toBeUndefined();
  expect((await response.body()).byteLength).toBeGreaterThan(1_000);
});

test('home screen image assets load without failed requests', async ({
  page,
}) => {
  const failures: Array<string> = [];
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    failures.push(`failed ${request.url()}`);
  });

  await page.goto('/');
  await expect(
    page.getByText('Local information and ways to take part.'),
  ).toBeVisible();
  await page.waitForTimeout(2_000);

  expect(failures).toEqual([]);
});

test('filter chips share a compact uniform height', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('Local information and ways to take part.'),
  ).toBeVisible();
  await page.getByText('Local information', { exact: true }).first().click();
  await expect(page.getByText('1 contact')).toBeVisible();

  const heights = await page.evaluate(() => {
    const collect = (root: ParentNode, out: Element[] = []): Element[] => {
      for (const element of root.querySelectorAll('*')) {
        out.push(element);
        if (element.shadowRoot) collect(element.shadowRoot, out);
      }
      return out;
    };
    return collect(document)
      .filter(
        (element) =>
          element.childElementCount === 0 &&
          (element.textContent?.trim() === 'All' ||
            element.textContent?.trim() === 'Out-of-hours only'),
      )
      .map((chip) => Math.round(chip.getBoundingClientRect().height));
  });

  expect(heights).toHaveLength(2);
  for (const height of heights) {
    expect(height).toBeLessThanOrEqual(46);
  }
  expect(new Set(heights).size).toBe(1);
});
