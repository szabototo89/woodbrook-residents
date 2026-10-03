import { readLauraSnapshot } from '../../scripts/lauraSnapshot';
import { expect, test, createOfflinePage } from '../fixtures/gallery-test';
import { browsableCollections } from './galleryCms';

type CmsHome = {
  heroCtaLabel: string;
  firstServiceTitle: string;
};

async function homeCopy(): Promise<CmsHome> {
  const { home } = await readLauraSnapshot();
  return {
    heroCtaLabel: home.hero.ctaLabel ?? '',
    firstServiceTitle: home.services[0]?.title ?? '',
  };
}

function exactName(copy: string) {
  return new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

test('service and CTA feedback moves only images and directional arrows', async ({
  page,
}) => {
  const { heroCtaLabel, firstServiceTitle } = await homeCopy();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const service = page.getByRole('link', {
    name: exactName(firstServiceTitle),
  });
  await service.scrollIntoViewIfNeeded();
  await service.hover();
  await expect
    .poll(() =>
      service
        .getByRole('img')
        .evaluate((image) => getComputedStyle(image).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 0, -2)');
  await expect
    .poll(() =>
      service
        .locator('svg')
        .evaluate((arrow) => getComputedStyle(arrow).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 4, 0)');
  const action = page.getByRole('link', { name: exactName(heroCtaLabel) });
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
  const [collection] = await browsableCollections();
  if (!collection) throw new Error('Browsable collection is missing');
  await page.goto(`/gallery/${collection.slug}`);
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
      name: `View picture: ${collection.photos[1]}`,
    })
    .hover();
  await expect
    .poll(() =>
      page
        .getByRole('button', {
          name: `View picture: ${collection.photos[1]}`,
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
        .evaluate((art) => getComputedStyle(art).maskImage),
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
  await expect(page.locator('.home-hero .gold-stroke')).toHaveCount(1);
});

test('reduced motion removes travel and reveals all content, including after a live change', async ({
  page,
}) => {
  const { heroCtaLabel, firstServiceTitle } = await homeCopy();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-motion-state="pending"]')).toHaveCount(0);
  const action = page.getByRole('link', { name: exactName(heroCtaLabel) });
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
  const service = page.getByRole('link', {
    name: exactName(firstServiceTitle),
  });
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
  const { firstServiceTitle } = await homeCopy();
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const service = page.getByRole('link', {
    name: exactName(firstServiceTitle),
  });
  await expect(page.locator('.service-grid')).toHaveAttribute(
    'data-motion-state',
    'pending',
  );
  const opacity = await service.evaluate((link: HTMLElement) => {
    link.focus({ preventScroll: true });
    return getComputedStyle(link).opacity;
  });
  expect(opacity).toBe('1');
});

test('hero has one brisk headline entrance and a signature brush draw, then stays still', async ({
  page,
}) => {
  await page.goto('/');
  const hero = page.locator('.home-hero');
  expect(
    await hero
      .locator('.hero-art img')
      .evaluate((image) => getComputedStyle(image).animationDuration),
  ).toBe('0.36s');
  expect(
    await hero
      .locator('h1')
      .evaluate((heading) => getComputedStyle(heading).animationDuration),
  ).toBe('0.26s');
  for (const selector of [
    '.hero-line',
    '.hero-copy > p',
    '.hero-copy > .button',
  ]) {
    for (const element of await hero.locator(selector).all()) {
      expect(
        await element.evaluate((node) => getComputedStyle(node).animationName),
      ).toBe('none');
    }
  }
  expect(
    await hero
      .locator('.gold-stroke')
      .evaluate((stroke) => getComputedStyle(stroke).animationDuration),
  ).toBe('0.62s');
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

test('home observes three compositions and reveals the service group together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-motion]')).toHaveCount(3);
  const services = page.locator('.service-grid');
  await expect(services).toHaveAttribute('data-motion-state', 'pending');
  await services.scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute('data-motion-state', 'revealed');
  for (const [index, card] of (
    await services.getByRole('link').all()
  ).entries()) {
    expect(
      await card.evaluate((node) => getComputedStyle(node).animationDelay),
    ).toBe(`${index * 0.06}s`);
    expect(
      await card.evaluate((node) => getComputedStyle(node).animationDuration),
    ).toBe('0.36s');
  }
  await expect(services.locator('[data-motion]')).toHaveCount(0);
});

test('mural paint mask has an irregular SVG edge and copy remains immediately readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const mural = page.locator('.mural-feature');
  const art = mural.locator('.mural-art');
  expect(
    await art.evaluate((node) => getComputedStyle(node).maskImage),
  ).toContain('brush-reveal-mask.svg');
  expect(
    await mural
      .getByRole('heading')
      .evaluate((node) => getComputedStyle(node).opacity),
  ).toBe('1');
  await mural.scrollIntoViewIfNeeded();
  await expect(mural).toHaveAttribute('data-motion-state', 'revealed');
  expect(
    await art.evaluate((node) => getComputedStyle(node).animationDuration),
  ).toBe('0.62s');
  await expect
    .poll(() => art.evaluate((node) => getComputedStyle(node).maskImage))
    .toBe('none');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await mural.scrollIntoViewIfNeeded();
  expect(await art.evaluate((node) => node.getAnimations().length)).toBe(0);
});

test('services page links have subtle image and arrow feedback without moving the card', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/services');
  const service = page.getByRole('link', { name: /Commissioned Paintings/ });
  await service.focus();
  expect(
    await service.evaluate((node) => getComputedStyle(node).transform),
  ).toBe('none');
  await expect
    .poll(() =>
      service
        .getByRole('img')
        .evaluate((node) => getComputedStyle(node).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 0, -2)');
  await expect
    .poll(() =>
      service
        .locator('svg')
        .evaluate((node) => getComputedStyle(node).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 4, 0)');
  await expect(service).toHaveAttribute(
    'href',
    '/contact?service=commissioned-paintings',
  );
});

test('gallery covers zoom gently and their caption arrows respond to keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/gallery');
  const collection = page
    .getByRole('link', { name: /View collection:/ })
    .first();
  await collection.focus();
  await expect
    .poll(() =>
      collection
        .getByRole('img')
        .evaluate((node) => getComputedStyle(node).transform),
    )
    .toBe('matrix(1.025, 0, 0, 1.025, 0, 0)');
  await expect
    .poll(() =>
      collection
        .locator('svg')
        .evaluate((node) => getComputedStyle(node).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 4, 0)');
  expect(
    await collection
      .getByRole('img')
      .evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('0.22s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await collection
      .getByRole('img')
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe('none');
  expect(
    await collection
      .locator('svg')
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe('none');
});

test('mobile uses shorter composition motion and a simple mural fade without sticky hover', async ({
  browser,
}) => {
  const { context, page } = await createOfflinePage(browser, {
    viewport: { width: 390, height: 600 },
    isMobile: true,
    hasTouch: true,
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const services = page.locator('.service-grid');
  await services.scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute('data-motion-state', 'revealed');
  const first = services.getByRole('link').first();
  expect(
    await first.evaluate((node) => getComputedStyle(node).animationDuration),
  ).toBe('0.3s');
  expect(
    await services
      .getByRole('link')
      .nth(1)
      .evaluate((node) => getComputedStyle(node).animationDelay),
  ).toBe('0.035s');
  await expect
    .poll(() =>
      first
        .getByRole('img')
        .evaluate((node) => getComputedStyle(node).transform),
    )
    .toBe('none');
  await first.dispatchEvent('pointerdown', { pointerType: 'touch' });
  expect(
    await first
      .getByRole('img')
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe('none');
  const art = page.locator('.mural-art');
  await page.locator('.mural-feature').scrollIntoViewIfNeeded();
  await expect(page.locator('.mural-feature')).toHaveAttribute(
    'data-motion-state',
    'revealed',
  );
  expect(
    await art.evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('feedback-fade');
  expect(await art.evaluate((node) => getComputedStyle(node).maskImage)).toBe(
    'none',
  );
  await context.close();
});

test('about copy and story stay static while its hero artwork enters as one composition', async ({
  page,
}) => {
  await page.goto('/about');
  expect(
    await page
      .locator('.page-hero-art')
      .evaluate((node) => getComputedStyle(node).animationDuration),
  ).toBe('0.36s');
  for (const node of await page
    .locator('.page-hero-copy > *, .values, .story')
    .all()) {
    expect(
      await node.evaluate((element) => getComputedStyle(element).animationName),
    ).toBe('none');
  }
});
