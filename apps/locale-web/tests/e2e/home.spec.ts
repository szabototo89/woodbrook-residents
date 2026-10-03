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

test('generated branding and hero note remain transparent and fit the laptop image', async ({
  page,
}) => {
  await page.goto('/');
  const logo = page.getByRole('link', { name: 'Locale home' }).locator('img');
  const note = page.getByRole('img', {
    name: 'Websites that work for real businesses.',
  });
  await expect(logo).toBeVisible();
  await expect(note).toBeVisible();
  const hero = page.getByRole('img', {
    name: /laptop displaying Laura Faichney/i,
  });
  const heroBounds = await hero.boundingBox();
  const noteBounds = await note.boundingBox();
  expect(heroBounds).not.toBeNull();
  expect(noteBounds).not.toBeNull();
  expect(noteBounds!.width).toBeLessThan(heroBounds!.width / 3);
  expect(noteBounds!.height).toBeLessThan(heroBounds!.height * 0.7);
  expect(noteBounds!.x + noteBounds!.width).toBeLessThanOrEqual(
    heroBounds!.x + heroBounds!.width,
  );
  expect(
    await note.evaluate((image) => getComputedStyle(image).backgroundColor),
  ).toBe('rgba(0, 0, 0, 0)');
});

test('blog route is prerendered and the menu navigates between the home and guides', async ({
  page,
}) => {
  expect(readFileSync('dist/client/blog/index.html', 'utf8')).toContain(
    'A stronger online presence.',
  );
  await page.goto('/');
  if (test.info().project.name === 'mobile')
    await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Blog' })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Small ideas. A stronger online presence.',
  );
  await page.getByText('Read guide', { exact: false }).click();
  await expect(
    page.getByText(/Start with the questions your customers/),
  ).toBeVisible();
  await page.locator('summary').first().focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText(/Start with the questions your customers/),
  ).not.toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/blog-${test.info().project.name}.png`,
    fullPage: true,
  });
  if (test.info().project.name === 'mobile')
    await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Services', exact: true })
    .click();
  await expect(page).toHaveURL(/\/#services$/);
});

test('navigation controls stay in the header at a 320px phone width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  const header = await page.locator('header').boundingBox();
  const toggle = await page
    .getByRole('button', { name: 'Open navigation' })
    .boundingBox();
  expect(toggle!.y + toggle!.height).toBeLessThanOrEqual(
    header!.y + header!.height,
  );
  expect(toggle!.x + toggle!.width).toBeLessThanOrEqual(320);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Blog' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('blog category labels have accessible text contrast', async ({ page }) => {
  await page.goto('/blog');
  const ratios = await page
    .locator('article .eyebrow')
    .evaluateAll((labels) => {
      const luminance = (color: string) =>
        color
          .match(/\d+/g)!
          .slice(0, 3)
          .map((channel) => Number(channel) / 255)
          .map((channel) =>
            channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4,
          )
          .reduce(
            (sum, channel, index) =>
              sum + channel * ([0.2126, 0.7152, 0.0722][index] ?? 0),
            0,
          );
      return labels.map((label) => {
        const foreground = luminance(getComputedStyle(label).color);
        const background = luminance(
          getComputedStyle(label.closest('article')!).backgroundColor,
        );
        return (
          (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05)
        );
      });
    });
  expect(ratios).toHaveLength(3);
  ratios.map((ratio) => expect(ratio).toBeGreaterThanOrEqual(4.5));
});
