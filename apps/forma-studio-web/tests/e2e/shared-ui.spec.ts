import { test, expect } from '@playwright/test';

const sharedStyle = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'padding',
      'gap',
      'border',
      'borderRadius',
      'backgroundColor',
      'color',
      'alignItems',
    ].map((property) => [
      property,
      style.getPropertyValue(
        property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
      ),
    ]),
  );
};

test('both pages retain shared landmarks, focus, heading hierarchy and equivalent action styling', async ({
  page,
  browserName,
}) => {
  const styles = [];
  for (const path of ['/', '/blog']) {
    await page.goto(path);
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    const action = page
      .getByRole('banner')
      .getByRole('link', { name: 'Let’s talk' });
    styles.push(await action.evaluate(sharedStyle));
    await action.focus();
    await expect(action).toBeFocused();
    expect(
      await action.evaluate(
        (element) => getComputedStyle(element).outlineStyle,
      ),
    ).toBe('solid');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(styles[0]).toEqual(styles[1]);
  await expect(
    page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Back to Forma Studio home' }),
  ).toHaveAttribute('href', '/');
});

test('service and journal disclosures keep keyboard behavior while FAQs stay exclusive', async ({
  page,
}) => {
  await page.goto('/');
  const services = page.getByRole('region', {
    name: 'Our services',
  });
  const summaries = services.locator('summary');
  await summaries.nth(0).focus();
  await page.keyboard.press('Enter');
  await summaries.nth(1).focus();
  await page.keyboard.press('Space');
  await expect(services.getByText('A clear enquiry journey')).toBeVisible();
  await expect(
    services.getByText('Page titles and descriptions'),
  ).toBeVisible();
  await summaries.nth(0).focus();
  await page.keyboard.press('Enter');
  await expect(services.getByText('A clear enquiry journey')).not.toBeVisible();
  const first = page.getByRole('button', {
    name: 'How long does a website take?',
  });
  const second = page.getByRole('button', {
    name: 'Can you help with my existing website?',
  });
  await first.click();
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await page.goto('/blog');
  const guide = page.locator('summary').first();
  await guide.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText(/Start with the questions your customers/),
  ).toBeVisible();
  await page.keyboard.press('Space');
  await expect(
    page.getByText(/Start with the questions your customers/),
  ).not.toBeVisible();
});

test('capture shared UI on desktop and mobile', async ({ browser }, info) => {
  test.skip(
    info.project.name !== 'desktop',
    'One high-resolution artifact set.',
  );
  const output = '../../docs/handoffs/forma-shared-ui/assets';
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 1000 }],
    ['mobile', { width: 390, height: 844 }],
  ] as const) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    for (const [slug, path] of [
      ['home', '/'],
      ['journal', '/blog'],
    ] as const) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator('img')
        .evaluateAll((images) =>
          Promise.all(
            images.map((image) =>
              image instanceof HTMLImageElement
                ? image.decode().catch(() => {})
                : Promise.resolve(),
            ),
          ),
        );
      await page.screenshot({
        path: `${output}/${slug}-${name}.png`,
        fullPage: true,
      });
      const summary = page.locator('summary').first();
      await summary.focus();
      await page.keyboard.press('Enter');
      await summary.screenshot({
        path: `${output}/${slug}-disclosure-${name}.png`,
      });
    }
    await context.close();
  }
});
