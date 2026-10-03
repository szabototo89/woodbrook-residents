import { expect, test } from 'bun:test';
import { ESLint } from 'eslint';

const eslint = new ESLint();
const filePath =
  'apps/laura-faichney-web/tests/e2e/offline-rule-example.spec.ts';

async function violations(code: string) {
  const [result] = await eslint.lintText(code, { filePath });
  return result!.messages.filter(
    (message) => message.ruleId === 'laura-tests/offline-browser',
  );
}

for (const code of [
  "import { test as browserTest } from '@playwright/test';",
  "import * as playwright from '@playwright/test';",
  "import playwright from 'playwright';",
  "export { test } from '@playwright/test';",
  'browser.newContext();',
  "browser['newPage']();",
  'route.fetch();',
  'route.continue();',
  "import('@playwright/test');",
]) {
  test(`Laura lint rejects a browser fixture bypass: ${code}`, async () => {
    expect(await violations(code)).toHaveLength(1);
  });
}

test('Laura lint permits the offline fixture, device imports and in-page fetch', async () => {
  expect(
    await violations(`
      import { test, expect, createOfflinePage } from '../fixtures/gallery-test';
      import { devices, webkit, type Page } from '@playwright/test';
      test('example', async ({ browser, page }) => {
        const isolated = await createOfflinePage(browser, devices['iPhone 13']);
        await page.evaluate(() => fetch('/favicon.svg'));
        expect(isolated.page).toBeDefined();
        await isolated.context.close();
      });
    `),
  ).toHaveLength(0);
});

test('Laura lint restrictions do not affect other apps', async () => {
  const [result] = await eslint.lintText(
    "import { test } from '@playwright/test'; test('example', async ({ browser }) => { await browser.newContext(); });",
    { filePath: 'apps/web/tests/e2e/offline-rule-example.spec.ts' },
  );
  expect(
    result!.messages.filter(
      (message) => message.ruleId === 'laura-tests/offline-browser',
    ),
  ).toHaveLength(0);
});

test('Laura lint also rejects live route fetching inside shared fixtures', async () => {
  const [result] = await eslint.lintText('route.fetch();', {
    filePath: 'apps/laura-faichney-web/tests/fixtures/gallery-test.ts',
  });
  expect(
    result!.messages.some(
      (message) => message.ruleId === 'laura-tests/offline-browser',
    ),
  ).toBe(true);
});
