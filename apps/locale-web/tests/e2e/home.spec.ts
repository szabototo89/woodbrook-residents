import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('home page serves complete prerendered content and working section links', async ({
  page,
  request,
}) => {
  const html = readFileSync('dist/client/index.html', 'utf8');
  expect(html).toContain('Simple digital');
  expect(html).toContain('Frequently asked questions');
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('Simple digital');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Simple digital services for local businesses.',
  );
  await page.getByRole('link', { name: 'See Our Work' }).click();
  await expect(page).toHaveURL(/#work$/);
  await page
    .getByRole('button', { name: 'How long does a website take?' })
    .click();
  await expect(page.getByText(/Most small websites take/)).toBeVisible();
  await page
    .getByRole('button', { name: 'How long does a website take?' })
    .click();
  await expect(page.getByText(/Most small websites take/)).not.toBeVisible();
  expect(errors).toEqual([]);
  expect(
    await page
      .locator('img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0,
        ),
      ),
  ).toBe(true);
});

test('homepage stays within viewport and navigation works on narrow screens', async ({
  page,
}) => {
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  if (test.info().project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Contact', exact: true })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(
      page.getByRole('button', { name: 'Open navigation' }),
    ).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Services', exact: true })
      .click();
    await expect(page).toHaveURL(/#services$/);
  }
  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
});

test('keyboard users can skip navigation and operate FAQs', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  const faq = page.getByRole('button', {
    name: 'Do you offer ongoing support?',
  });
  await faq.focus();
  await page.keyboard.press('Enter');
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/Choose the support/)).toBeVisible();
});
