import { expect, test } from '../fixtures/gallery-test';

for (const width of [320, 390, 640, 641, 768, 900, 1024, 1440, 2048]) {
  test(`all pages share header geometry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/about');
    await page.evaluate(() => document.fonts.ready);
    const header = page.getByRole('banner');
    const geometry = async () => ({
      header: await header.boundingBox(),
      logo: await header
        .getByRole('img', { name: 'Laura Faichney — All Things Art' })
        .boundingBox(),
      navigation: await header
        .getByRole('navigation', {
          name: 'Primary navigation',
          includeHidden: true,
        })
        .boundingBox(),
      action: await header
        .getByRole('link', { name: 'Get in Touch', includeHidden: true })
        .boundingBox(),
    });
    const reference = await geometry();
    for (const path of ['/', '/services', '/prices', '/gallery', '/contact']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await geometry(), `${path} header matches About`).toEqual(
        reference,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      if (width > 640) {
        const action = await header
          .getByRole('link', { name: 'Get in Touch' })
          .boundingBox();
        expect(action!.x + action!.width).toBeLessThanOrEqual(width - 24);
      }
    }
  });
}

test('shared phone menu closes with Escape and follows the selected page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about');
  const header = page.getByRole('banner');
  await header.getByRole('button', { name: 'Open menu' }).click();
  await expect(header.getByRole('navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(header.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await expect(header.getByRole('navigation')).toBeHidden();
  await header.getByRole('button', { name: 'Open menu' }).click();
  await header.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(header.getByRole('navigation')).toBeHidden();
  await header.getByRole('button', { name: 'Open menu' }).click();
  await expect(
    header.getByRole('link', { name: 'Services', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});
