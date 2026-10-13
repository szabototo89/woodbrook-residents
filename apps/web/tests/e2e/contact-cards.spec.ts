import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 2 });

test('contact cards align the icon with the title and give the description its own readable row', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const cards = page
      .getByRole('region', { name: 'Who should I contact?' })
      .getByRole('link');
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      await expect(card.locator('svg')).toHaveCount(1);
      expect(
        await card
          .locator('strong')
          .evaluate((element) => getComputedStyle(element).textDecorationLine),
      ).toBe('underline');
      const layout = await card.evaluate((element) => {
        const box = (selector: string) =>
          element.querySelector(selector)!.getBoundingClientRect().toJSON();
        return {
          card: element.getBoundingClientRect().toJSON(),
          padding: parseFloat(getComputedStyle(element).paddingBottom),
          icon: box('svg:first-of-type'),
          title: box('strong'),
          description: box('small'),
        };
      });
      expect(
        Math.abs(
          layout.icon.top +
            layout.icon.height / 2 -
            layout.title.top -
            layout.title.height / 2,
        ),
      ).toBeLessThanOrEqual(2);
      expect(
        Math.abs(layout.description.left - layout.icon.left),
      ).toBeLessThanOrEqual(2);
      expect(
        layout.description.top - layout.icon.bottom,
      ).toBeGreaterThanOrEqual(12);
      expect(
        Math.abs(
          layout.description.right - (layout.card.right - layout.padding - 1),
        ),
      ).toBeLessThanOrEqual(2);
      expect(layout.card.left).toBeGreaterThanOrEqual(0);
      expect(layout.card.right).toBeLessThanOrEqual(width);
      await expect(card.locator('a, button')).toHaveCount(0);
    }
  }
});

test('each contact card supports whole-card navigation and a visible keyboard focus', async ({
  page,
}) => {
  const destinations = [
    { name: /^Council services/, url: /\/local-info\?category=council$/ },
    { name: /^Useful contacts/, url: /\/local-info$/ },
    { name: /^Get involved Ways/, url: /\/get-involved$/ },
  ];
  await page.setViewportSize({ width: 1024, height: 1000 });
  for (const destination of destinations) {
    await page.goto('/');
    const reject = page.getByRole('button', { name: 'Reject', exact: true });
    if (await reject.isVisible()) await reject.click();
    const card = page
      .getByRole('region', { name: 'Who should I contact?' })
      .getByRole('link', { name: destination.name });
    await page.keyboard.press('Tab');
    await card.focus();
    const outline = await card.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        width: parseFloat(style.outlineWidth),
        style: style.outlineStyle,
      };
    });
    expect(outline.width).toBeGreaterThanOrEqual(2);
    expect(outline.style).toBe('solid');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(destination.url);
    await page.goto('/');
    await card.click({ position: { x: 8, y: 8 } });
    await expect(page).toHaveURL(destination.url);
  }
});
