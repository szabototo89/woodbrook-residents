import { expect, test } from '@playwright/test';

test('service and CTA feedback moves only images and directional arrows', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const service = page.getByRole('link', { name: /Commissioned Paintings/ });
  await service.scrollIntoViewIfNeeded();
  await service.hover();
  await expect
    .poll(() =>
      service
        .getByRole('img')
        .evaluate((image) => getComputedStyle(image).transform),
    )
    .toBe('matrix(1.025, 0, 0, 1.025, 0, 0)');
  await expect
    .poll(() =>
      service
        .locator('svg')
        .evaluate((arrow) => getComputedStyle(arrow).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 4, 0)');
  const action = page.getByRole('link', { name: 'View My Work' });
  await action.focus();
  await expect
    .poll(() =>
      action
        .locator('svg')
        .evaluate((arrow) => getComputedStyle(arrow).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 4, 0)');
  await expect(action).toHaveAttribute('href', '/gallery');
});

test('desktop nav draws an underline without moving the label', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const about = page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'About' });
  expect(
    await about.evaluate((link) => getComputedStyle(link, '::after').transform),
  ).toBe('matrix(0, 0, 0, 1, 0, 0)');
  await about.focus();
  await expect
    .poll(() =>
      about.evaluate((link) => getComputedStyle(link, '::after').transform),
    )
    .toBe('matrix(1, 0, 0, 1, 0, 0)');
  expect(await about.evaluate((link) => getComputedStyle(link).transform)).toBe(
    'none',
  );
});

test('gallery controls give feedback in their navigation direction', async ({
  page,
}) => {
  await page.goto('/gallery/colour-and-nature');
  await page.waitForLoadState('networkidle');
  const back = page.getByRole('link', { name: /Back to gallery/ });
  await back.focus();
  await expect
    .poll(() =>
      back
        .locator('svg')
        .evaluate((arrow) => getComputedStyle(arrow).transform),
    )
    .toBe('matrix(1, 0, 0, 1, -4, 0)');
  const next = page
    .getByRole('navigation', { name: 'Picture navigation' })
    .getByRole('button', { name: /Next picture/ });
  await next.hover();
  await expect
    .poll(() =>
      next
        .locator('svg')
        .evaluate((arrow) => getComputedStyle(arrow).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 4, 0)');
  await page
    .getByRole('button', {
      name: 'View picture: Fresh strawberries in rich pink and red tones',
    })
    .hover();
  await expect
    .poll(() =>
      page
        .getByRole('button', {
          name: 'View picture: Fresh strawberries in rich pink and red tones',
        })
        .getByRole('img')
        .evaluate((image) => getComputedStyle(image).transform),
    )
    .toBe('matrix(1.02, 0, 0, 1.02, 0, 0)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await next
      .locator('svg')
      .evaluate((arrow) => getComputedStyle(arrow).transform),
  ).toBe('none');
});

test('editorial reveals play once and the mural stays uncovered on return', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const mural = page.locator('.mural-feature');
  await expect(mural).toHaveAttribute('data-motion-state', 'pending');
  await mural.scrollIntoViewIfNeeded();
  await expect(mural).toHaveAttribute('data-motion-state', 'revealed');
  await expect
    .poll(() =>
      mural
        .locator('.mural-art')
        .evaluate((art) => getComputedStyle(art).clipPath),
    )
    .toBe('none');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await mural.scrollIntoViewIfNeeded();
  await expect(mural).toHaveAttribute('data-motion-state', 'revealed');
  expect(
    await mural.evaluate(
      (section) => section.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(page.locator('.brush-accent')).toHaveCount(2);
});

test('reduced motion removes travel and reveals all content, including after a live change', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-motion-state="pending"]')).toHaveCount(0);
  const action = page.getByRole('link', { name: 'View My Work' });
  await action.hover();
  expect(
    await action.evaluate((link) => getComputedStyle(link).transform),
  ).toBe('none');
  expect(
    await action
      .locator('svg')
      .evaluate((arrow) => getComputedStyle(arrow).transform),
  ).toBe('none');
  await page.goto('/');
  const service = page.getByRole('link', { name: /Commissioned Paintings/ });
  await service.focus();
  expect(
    await service
      .getByRole('img')
      .evaluate((image) => getComputedStyle(image).transform),
  ).toBe('none');
  expect(
    await page
      .locator('.mural-art')
      .evaluate((art) => getComputedStyle(art).clipPath),
  ).toBe('none');
  expect(
    await page
      .getByRole('heading', { level: 1 })
      .evaluate((heading) => heading.getAnimations({ subtree: true }).length),
  ).toBe(0);
});

test('without IntersectionObserver, the page never hides content', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-motion-state="pending"]')).toHaveCount(0);
  expect(
    await page
      .locator('.mural-art')
      .evaluate((art) => getComputedStyle(art).opacity),
  ).toBe('1');
});

test('keyboard focus exposes a pending service immediately', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const service = page.getByRole('link', { name: /Commissioned Paintings/ });
  await expect(service).toHaveAttribute('data-motion-state', 'pending');
  const opacity = await service.evaluate((link: HTMLElement) => {
    link.focus({ preventScroll: true });
    return getComputedStyle(link).opacity;
  });
  expect(opacity).toBe('1');
});

test('hero artwork has time to settle while the copy stays brisk, then stays still', async ({
  page,
}) => {
  await page.goto('/');
  const hero = page.locator('.home-hero');
  expect(
    await hero
      .locator('.hero-art img')
      .evaluate((image) => getComputedStyle(image).animationDuration),
  ).toBe('0.9s');
  expect(
    await hero
      .locator('.hero-line')
      .last()
      .evaluate((line) => getComputedStyle(line).animationDelay),
  ).toBe('0.11s');
  await expect
    .poll(() =>
      hero.evaluate(
        (section) => section.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(0);
  await page.locator('.about-preview').scrollIntoViewIfNeeded();
  await hero.scrollIntoViewIfNeeded();
  expect(
    await hero.evaluate(
      (section) => section.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});
