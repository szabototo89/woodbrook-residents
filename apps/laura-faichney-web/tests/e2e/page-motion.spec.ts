import { expect, test } from '../fixtures/gallery-test';

for (const fallback of ['unsupported', 'reduced'] as const) {
  test(`primary navigation remains ordinary with ${fallback} motion`, async ({
    page,
  }) => {
    if (fallback === 'reduced')
      await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((mode) => {
      if (mode === 'unsupported')
        Object.defineProperty(document, 'startViewTransition', {
          value: undefined,
        });
      else
        document.startViewTransition = () => {
          throw new Error('Reduced motion must not start page transitions');
        };
    }, fallback);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'About' })
      .click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { name: 'My Story' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('primary navigation crossfades page content and gives keyboard focus to the destination', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = document.startViewTransition.bind(document);
    document.startViewTransition = (update) => {
      document.documentElement.dataset.pageTransitionSource = getComputedStyle(
        document.querySelector('main')!,
      ).viewTransitionName;
      const transition = original(update);
      void transition.ready.then(() => {
        document.documentElement.dataset.pageTransitionDestination =
          getComputedStyle(document.querySelector('main')!).viewTransitionName;
      });
      return transition;
    };
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const about = page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'About' });
  await about.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/about');
  await expect(page.locator('html')).toHaveAttribute(
    'data-page-transition-source',
    'page-content',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-page-transition-destination',
    'page-content',
  );
  await expect(page.getByRole('main')).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(
          document.documentElement,
          '::view-transition-new(page-content)',
        ).animationDuration,
    ),
  ).toBe('0.24s');
  expect(
    await page
      .getByRole('banner')
      .evaluate((node) => getComputedStyle(node).viewTransitionName),
  ).toBe('none');
});

test('page transitions retain service enquiry parameters and close the phone menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Services' })
    .click();
  await expect(page).toHaveURL('/services');
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeHidden();
  await page.getByRole('link', { name: /Commissioned Paintings/ }).click();
  await expect(page).toHaveURL('/contact?service=commissioned-paintings');
  await expect(page.getByRole('main')).toBeFocused();
});

test('skip links and modified clicks keep their native behavior', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.addInitScript(() => {
    document.startViewTransition = () => {
      throw new Error('Modified clicks must use normal navigation');
    };
  });
  const about = page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'About' });
  const popup = context.waitForEvent('page');
  await about.click({ modifiers: ['ControlOrMeta'] });
  const destination = await popup;
  await expect(destination).toHaveURL('/about');
  await expect(page).toHaveURL('/');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/#main-content');
  await destination.close();
});
