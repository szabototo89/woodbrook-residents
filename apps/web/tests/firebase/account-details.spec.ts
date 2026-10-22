import { expect, test, type Page } from '@playwright/test';
import { sampleFirebase } from './helpers/sampleFirebase';

test.use({ deviceScaleFactor: 2, reducedMotion: 'reduce' });

async function privateProfile(page: Page) {
  let stored: Record<string, unknown> | null = null;
  let failWrite = false;
  const writes: Record<string, unknown>[] = [];
  const document =
    'projects/sample/databases/(default)/documents/residentProfiles/sample-user';
  await page.route('https://firestore.googleapis.com/**', async (route) => {
    expect(route.request().headers()['authorization']).toMatch(/^Bearer /);
    const body = route.request().postDataJSON();
    const url = new URL(route.request().url()).pathname;
    const now = new Date().toISOString();
    if (url.endsWith('documents:batchGet')) {
      expect(body.documents).toEqual([document]);
      return route.fulfill({
        json: [
          stored
            ? {
                found: {
                  name: document,
                  fields: stored,
                  createTime: now,
                  updateTime: now,
                },
                readTime: now,
              }
            : { missing: document, readTime: now },
        ],
      });
    }
    if (url.endsWith('documents:commit')) {
      if (failWrite) {
        failWrite = false;
        return route.fulfill({
          status: 403,
          json: {
            error: {
              code: 403,
              message: 'Sample permission failure',
              status: 'PERMISSION_DENIED',
            },
          },
        });
      }
      for (const write of body.writes) {
        writes.push(write);
        if (write.delete) {
          expect(write.delete).toBe(document);
          stored = null;
        } else {
          expect(write.update.name).toBe(document);
          stored = write.update.fields;
        }
      }
      return route.fulfill({
        json: {
          commitTime: now,
          writeResults: body.writes.map(() => ({
            updateTime: now,
            transformResults: [{ timestampValue: now }],
          })),
        },
      });
    }
    throw new Error('Unexpected Firestore request: ' + new URL(url).pathname);
  });
  return {
    writes,
    failNextWrite() {
      failWrite = true;
    },
  };
}

async function logIn(page: Page) {
  await sampleFirebase(page);
  await page.goto('/login?feature_flag=firebase-auth');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('sample@example.com');
  await page.getByLabel('Password', { exact: true }).fill('sample-password');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await page
    .getByRole('link', { name: 'Account details', exact: true })
    .click();
  await expect(page).toHaveURL(/\/account\?feature_flag=firebase-auth$/);
  await expect(
    page.getByRole('button', { name: 'Save details', exact: true }),
  ).toBeDisabled();
}

test('private location details can be saved, reloaded, edited, retried and removed', async ({
  page,
}, testInfo) => {
  await page.setViewportSize(
    testInfo.project.name === 'desktop'
      ? { width: 1440, height: 1000 }
      : { width: 390, height: 844 },
  );
  const profile = await privateProfile(page);
  await logIn(page);
  await page.getByLabel('Eircode (optional)', { exact: true }).fill('d6wab12');
  await page
    .getByLabel('Address (optional)', { exact: true })
    .fill('Sample home\nExample street');
  await page.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Your location details have been saved.',
  );
  expect(profile.writes[0]).toMatchObject({
    update: {
      fields: {
        eircode: { stringValue: 'D6W AB12' },
        address: { stringValue: 'Sample home\nExample street' },
      },
    },
  });
  await page.reload();
  await expect(
    page.getByLabel('Address (optional)', { exact: true }),
  ).toHaveValue('Sample home\nExample street');
  await expect(
    page.getByLabel('Eircode (optional)', { exact: true }),
  ).toHaveValue('D6W AB12');
  await expect(
    page.getByRole('link', { name: 'Account', exact: true }),
  ).toHaveAttribute('href', '/account?feature_flag=firebase-auth');
  expect(
    await page.locator('meta[name="robots"]').getAttribute('content'),
  ).toContain('noindex');
  if (process.env.ACCOUNT_DETAILS_SCREENSHOT_DIR) {
    const reject = page.getByRole('button', { name: 'Reject', exact: true });
    if (await reject.isVisible()) await reject.click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path:
        process.env.ACCOUNT_DETAILS_SCREENSHOT_DIR +
        '/account-' +
        testInfo.project.name +
        '.png',
      fullPage: true,
      scale: 'device',
    });
  }
  await page
    .getByLabel('Address (optional)', { exact: true })
    .fill('Discard this sample edit');
  await expect(
    page.getByText('Unsaved changes', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Discard changes', exact: true })
    .click();
  await expect(
    page.getByLabel('Address (optional)', { exact: true }),
  ).toHaveValue('Sample home\nExample street');
  await expect(
    page.getByRole('button', { name: 'Discard changes', exact: true }),
  ).toHaveCount(0);
  await page.getByLabel('Eircode (optional)', { exact: true }).fill('bad');
  await page.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(
    page.getByLabel('Eircode (optional)', { exact: true }),
  ).toBeFocused();
  await expect(
    page.getByLabel('Eircode (optional)', { exact: true }),
  ).toHaveAttribute('aria-invalid', 'true');
  await page
    .getByRole('button', { name: 'Discard changes', exact: true })
    .click();
  profile.failNextWrite();
  await page
    .getByLabel('Address (optional)', { exact: true })
    .fill('Edited sample address');
  await page.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Your details could not be saved. Please try again.',
  );
  await expect(
    page.getByLabel('Address (optional)', { exact: true }),
  ).toHaveValue('Edited sample address');
  await page.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('saved');
  await page
    .getByRole('button', { name: 'Remove saved location', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText(
    'Your saved location details have been removed.',
  );
  await page.reload();
  await expect(
    page.getByLabel('Address (optional)', { exact: true }),
  ).toHaveValue('');
  await page
    .getByRole('link', { name: 'Name, sign-in and security settings' })
    .click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Log in to Woodbrook' }),
  ).toBeVisible();
  await page.goto('/account?feature_flag=firebase-auth');
  await expect(
    page.getByRole('heading', { name: 'Log in to manage your details' }),
  ).toBeVisible();
  await expect(
    page.getByLabel('Address (optional)', { exact: true }),
  ).toHaveCount(0);
});

test('direct URLs stay private and the form fits a 320px phone', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('firestore.googleapis.com'))
      requests.push(request.url());
  });
  await page.goto('/account');
  await expect(
    page.getByRole('heading', { name: 'Accounts are not enabled' }),
  ).toBeVisible();
  await sampleFirebase(page);
  await page.goto('/account?feature_flag=firebase-auth');
  await expect(
    page.getByRole('heading', { name: 'Log in to manage your details' }),
  ).toBeVisible();
  expect(requests).toEqual([]);
  await privateProfile(page);
  await logIn(page);
  await page.setViewportSize({ width: 320, height: 780 });
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await expect(
    page.getByLabel('Address (optional)', { exact: true }),
  ).toBeVisible();
});

test('the phone form presents its fields and save action without a long preamble', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await privateProfile(page);
  await logIn(page);
  const save = page.getByRole('button', { name: 'Save details', exact: true });
  const bounds = await save.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
  expect(bounds!.width).toBeGreaterThanOrEqual(280);
  await expect(
    page.getByLabel('Eircode (optional)', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Account settings' }),
  ).toHaveCount(0);
});

test('the desktop account form keeps a readable line length', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await privateProfile(page);
  await logIn(page);
  const panel = await page
    .getByRole('region', { name: 'Account details', exact: true })
    .boundingBox();
  expect(panel).not.toBeNull();
  expect(panel!.width).toBeLessThanOrEqual(680);
});
