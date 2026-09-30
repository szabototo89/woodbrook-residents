import { expect, test } from '@playwright/test';

test('client quote reads as a separate section from the biography', async ({
  page,
}) => {
  await page.goto('/');
  const backgrounds = await page.evaluate(() => {
    const about = document.querySelector('.about-preview');
    const testimonial = document.querySelector('.testimonial');
    if (!about || !testimonial) throw new Error('Home sections are missing');
    return [about, testimonial].map((section) =>
      getComputedStyle(section).backgroundColor.match(/\d+/g)?.map(Number),
    );
  });
  const [about, testimonial] = backgrounds;
  if (!about || !testimonial) throw new Error('Section colours are missing');
  const colorDifference = about
    .slice(0, 3)
    .reduce(
      (sum, channel, index) => sum + Math.abs(channel - testimonial[index]),
      0,
    );
  expect(colorDifference).toBeGreaterThanOrEqual(24);
});

test('contact brush is vivid and stays below the contact details on phones', async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const decoration = await page
      .locator('.contact-section')
      .evaluate((section) => {
        const style = getComputedStyle(section, '::before');
        const links = section.querySelector('.contact-links');
        if (!links) throw new Error('Contact links are missing');
        const sectionBounds = section.getBoundingClientRect();
        return {
          opacity: Number(style.opacity),
          top: sectionBounds.top + parseFloat(style.top),
          linksBottom: links.getBoundingClientRect().bottom,
        };
      });
    expect(decoration.opacity, `${width}px brush opacity`).toBe(1);
    if (width <= 390) {
      expect(decoration.top, `${width}px brush position`).toBeGreaterThan(
        decoration.linksBottom,
      );
    }
  }
});

test('contact brush continues into the footer at every layout width', async ({
  page,
}) => {
  for (const width of [320, 390, 700, 900, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const decoration = await page
      .locator('.contact-section')
      .evaluate((section) => {
        const bounds = section.getBoundingClientRect();
        const brush = getComputedStyle(section, '::before');
        const footer = document.querySelector('.site-footer');
        if (!footer) throw new Error('Footer is missing');
        return {
          overflow: getComputedStyle(section).overflowY,
          stackingOrder: Number(getComputedStyle(section).zIndex),
          brushBottom:
            bounds.top + parseFloat(brush.top) + parseFloat(brush.height),
          footerTop: footer.getBoundingClientRect().top,
        };
      });
    expect(decoration.overflow, `${width}px contact overflow`).toBe('visible');
    expect(
      decoration.stackingOrder,
      `${width}px contact stacking`,
    ).toBeGreaterThan(0);
    expect(decoration.brushBottom, `${width}px footer overlap`).toBeGreaterThan(
      decoration.footerTop + 80,
    );
  }
});

test('decorative brush strokes read clearly across the home page', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const [selector, pseudo, minimum] of [
      ['.home-hero', '::before', width === 390 ? 0.38 : 0.5],
      ['.about-preview', '::before', 0.8],
      ['.about-preview', '::after', 0.7],
      ['.contact-section', '::after', 0.55],
    ] as const) {
      const opacity = await page
        .locator(selector)
        .evaluate(
          (section, pseudo) =>
            Number(getComputedStyle(section, pseudo).opacity),
          pseudo,
        );
      expect(
        opacity,
        `${selector}${pseudo} at ${width}px`,
      ).toBeGreaterThanOrEqual(minimum);
    }
  }
});

test('phone mural artwork follows the copy without clipping or a ghost duplicate', async ({
  page,
}) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const section = page.locator('.mural-feature');
    const feature = await section.boundingBox();
    const artwork = await section
      .getByRole('img', { name: /pink painted flower/ })
      .boundingBox();
    const action = await section
      .getByRole('link', { name: /Enquire about a mural/ })
      .boundingBox();
    if (!feature || !artwork || !action)
      throw new Error('Mural content is missing');
    expect(
      artwork.y,
      `${width}px artwork should follow the action`,
    ).toBeGreaterThanOrEqual(action.y + action.height);
    expect(artwork.x, `${width}px left edge`).toBeGreaterThanOrEqual(feature.x);
    expect(
      artwork.x + artwork.width,
      `${width}px right edge`,
    ).toBeLessThanOrEqual(feature.x + feature.width);
    expect(
      artwork.y + artwork.height,
      `${width}px bottom edge`,
    ).toBeLessThanOrEqual(feature.y + feature.height);
    expect(
      await section.evaluate(
        (element) => getComputedStyle(element, '::after').backgroundImage,
      ),
    ).toBe('none');
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  expect(
    await page
      .locator('.mural-feature')
      .evaluate(
        (element) => getComputedStyle(element, '::after').backgroundImage,
      ),
  ).toBe('none');
});

test('hero underline covers Brighter at desktop and phone sizes', async ({
  page,
}) => {
  for (const width of [390, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const wordWidth = await page
      .getByRole('heading', { level: 1 })
      .evaluate((heading) => {
        const text = Array.from(heading.childNodes).find((node) =>
          node.textContent?.includes('Brighter'),
        );
        if (!text) throw new Error('Brighter is missing');
        const range = document.createRange();
        const start = text.textContent!.indexOf('Brighter');
        range.setStart(text, start);
        range.setEnd(text, start + 'Brighter'.length);
        return range.getBoundingClientRect().width;
      });
    const stroke = await page.locator('.hero-copy .gold-stroke').boundingBox();
    expect(stroke).not.toBeNull();
    expect(stroke!.width).toBeGreaterThanOrEqual(wordWidth);
    expect(stroke!.width).toBeLessThanOrEqual(wordWidth * 1.15);
  }
});

test('phone body copy remains at least 16px', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [path, selector] of [
      ['/', '.mural-copy p:not(.eyebrow)'],
      ['/', '.contact-section p:not(.eyebrow)'],
      ['/services', '.service-list-copy > span'],
      ['/about', '.values-grid p'],
    ]) {
      await page.goto(path);
      const fontSize = await page
        .locator(selector)
        .first()
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      expect(
        fontSize,
        `${path} ${selector} at ${width}px`,
      ).toBeGreaterThanOrEqual(16);
    }
  }
});

test('visible phone links and buttons have 44px tap areas', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/services', '/about', '/gallery', '/contact']) {
    await page.goto(path);
    const undersized = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a, button'))
        .filter((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.width > 0 && bounds.height > 0 && bounds.height < 44;
        })
        .map(
          (element) =>
            element.textContent?.trim() || element.getAttribute('aria-label'),
        ),
    );
    expect(undersized, path).toEqual([]);
  }
});

test('every subpage hero uses its own overflowing cutout without viewport overflow', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const images = new Set<string>();
    for (const path of ['/about', '/services', '/gallery', '/contact']) {
      await page.goto(path);
      const image = page.locator('.page-hero-art img');
      await expect(image).toBeVisible();
      const bounds = await image.boundingBox();
      const hero = await page.locator('.page-hero').boundingBox();
      if (!bounds || !hero) throw new Error(`${path} hero artwork is missing`);
      const src = await image.getAttribute('src');
      if (!src) throw new Error(`${path} hero has no artwork source`);
      images.add(src);
      const artwork = await image.evaluate((element: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        canvas.width = element.naturalWidth;
        canvas.height = element.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas is unavailable');
        context.drawImage(element, 0, 0);
        return {
          naturalWidth: element.naturalWidth,
          topLeftAlpha: context.getImageData(0, 0, 1, 1).data[3],
        };
      });
      expect(artwork.naturalWidth).toBe(1374);
      expect(artwork.topLeftAlpha).toBe(0);
      expect(bounds.y + bounds.height).toBeGreaterThan(hero.y + hero.height);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    }
    expect(images.size).toBe(4);
  }
});

test('header branding and hero copy share the same left alignment', async ({
  page,
}) => {
  for (const width of [390, 1086, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const logo = await page
      .getByRole('banner')
      .getByRole('link', { name: 'Laura Faichney — All Things Art' })
      .boundingBox();
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(logo).not.toBeNull();
    expect(title).not.toBeNull();
    expect(Math.abs(logo!.x - title!.x)).toBeLessThanOrEqual(1);
  }
});

for (const width of [320, 390, 640, 700, 900, 1440]) {
  test(`pages remain readable and within the viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const path of ['/', '/services', '/about', '/gallery', '/contact']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const documentWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(
        documentWidth,
        `${path} should not scroll horizontally`,
      ).toBeLessThanOrEqual(width);

      const logo = page
        .getByRole('banner')
        .getByRole('img', { name: 'Laura Faichney — All Things Art' });
      await expect(logo).toBeVisible();
      expect(
        await logo.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      ).toBe(true);
    }
  });
}

test('phone navigation opens and closes from the keyboard', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Close menu' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeHidden();
});

test('phone service thumbnails and titles share a row and gallery uses two columns', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const service = page
    .getByRole('link')
    .filter({ hasText: 'Commissioned Paintings' });
  const thumbnail = await service.getByRole('img').boundingBox();
  const title = await service.getByText('Commissioned Paintings').boundingBox();
  expect(thumbnail).not.toBeNull();
  expect(title).not.toBeNull();
  if (thumbnail && title) {
    expect(title.x).toBeGreaterThanOrEqual(thumbnail.x + thumbnail.width);
    expect(title.y).toBeLessThan(thumbnail.y + thumbnail.height);
  }
  const gallery = page.getByRole('link', { name: /View gallery:/ });
  const first = await gallery.nth(0).boundingBox();
  const second = await gallery.nth(1).boundingBox();
  const third = await gallery.nth(2).boundingBox();
  if (!first || !second || !third)
    throw new Error('Gallery previews are missing');
  expect(first.y).toBe(second.y);
  expect(second.x).toBeGreaterThan(first.x);
  expect(third.y).toBeGreaterThan(first.y);
});
