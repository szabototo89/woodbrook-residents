import { expect, test } from '@playwright/test';

test('long local information detail can be scrolled to the source note', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByText('What would you like to do?')).toBeVisible();

  await page.getByText('Local information', { exact: true }).click();
  await page.getByText('Tall health service').click();
  await expect(page.getByText('Official source')).toBeAttached();

  const scrolled = await page.evaluate(() => {
    const collect = (root: ParentNode, out: Element[] = []): Element[] => {
      for (const element of root.querySelectorAll('*')) {
        out.push(element);
        if (element.shadowRoot) collect(element.shadowRoot, out);
      }
      return out;
    };
    const leaf = collect(document).find(
      (element) =>
        element.childElementCount === 0 &&
        element.textContent?.trim() === 'Official source',
    );
    if (!leaf) return { found: false as const };
    let scroller: Element | null = leaf.parentElement;
    while (
      scroller &&
      scroller.scrollHeight <= scroller.clientHeight + 1 &&
      scroller.parentElement
    ) {
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 1) {
      return { found: true as const, scrollable: false as const };
    }
    scroller.scrollTop = scroller.scrollHeight;
    scroller.dispatchEvent(new Event('scroll', { bubbles: true }));
    const scrollerRect = scroller.getBoundingClientRect();
    const leafRect = leaf.getBoundingClientRect();
    return {
      found: true as const,
      scrollable: true as const,
      moved: scroller.scrollTop > 0,
      bottomVisible:
        leafRect.bottom <= scrollerRect.bottom + 1 &&
        leafRect.top >= scrollerRect.top - 1,
    };
  });

  expect(scrolled.found).toBe(true);
  expect(scrolled).toMatchObject({
    scrollable: true,
    moved: true,
    bottomVisible: true,
  });
});
