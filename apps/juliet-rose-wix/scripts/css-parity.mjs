// CSS parity check: original site vs widget fixtures at matched widths.
//
// Needs both servers running:
//   bun run --cwd apps/juliet-rose-web dev --port 3003
//   bun run dev:juliet-rose-wix            # Cosmos on :5005/:5054
//
// Run with the workspace playwright installation:
//   bun --cwd apps/web apps/juliet-rose-wix/scripts/css-parity.mjs
//
// Compares computed styles of the original site against widget fixtures at
// identical CSS widths. Known environmental allowances (not failures):
//   - text widths within 8px (font shaping across DOM contexts)
//   - image widths within 20px (Cosmos renderer body margin)
// Any other difference exits non-zero.
import { chromium } from 'playwright';

const ORIGIN = 'http://localhost:3003';
const PLAYGROUND = 'http://localhost:5005';

const browser = await chromium.launch();
const failures = [];

function check(label, a, b, props) {
  for (const prop of props) {
    if (prop === 'width' && a && b && a !== 'MISSING' && b !== 'MISSING') {
      const aw = Number.parseFloat(a[prop]);
      const bw = Number.parseFloat(b[prop]);
      if (Number.isNaN(aw) || Number.isNaN(bw) || Math.abs(aw - bw) > 8) {
        failures.push(`${label} ${prop}: orig=${a[prop]} widget=${b[prop]}`);
      }
      continue;
    }
    if (a?.[prop] !== b?.[prop]) {
      failures.push(`${label} ${prop}: orig=${a?.[prop]} widget=${b?.[prop]}`);
    }
  }
}

async function styles(url, queries, viewportWidth, useFrame) {
  const page = await browser.newPage({
    viewport: { width: viewportWidth, height: 900 },
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  let ctx = page.mainFrame();
  let inner = viewportWidth;
  if (useFrame) {
    const frame = page.frames().find((f) => f.url().includes('5054'));
    if (frame) {
      ctx = frame;
      inner = await frame.evaluate(() => window.innerWidth);
    }
  }
  const out = await ctx.evaluate((qs) => {
    const result = {};
    for (const [key, sel] of Object.entries(qs)) {
      const el = document.querySelector(sel);
      if (!el) {
        result[key] = 'MISSING';
        continue;
      }
      const cs = getComputedStyle(el);
      result[key] = {
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        fontWeight: cs.fontWeight,
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        height: cs.height,
        width: cs.width,
        display: cs.display,
      };
    }
    return result;
  }, queries);
  await page.close();
  return { inner, out };
}

function fixture(path) {
  return encodeURIComponent(JSON.stringify({ path }));
}

const TEXT_PROPS = [
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'color',
  'fontWeight',
  'marginTop',
  'marginBottom',
  'width',
];
const BOX_PROPS = ['height', 'width', 'display'];

// Hero
{
  const w = await styles(
    `${PLAYGROUND}/?fixture=${fixture('src/site/widgets/jr-hero/Hero.fixture.tsx')}`,
    {
      eyebrow: 'section p',
      h1: 'section h1',
      primary: 'section a[href="/book"]',
      policy: 'section a[href="#booking-policy"]',
    },
    2040,
    true,
  );
  const o = await styles(
    `${ORIGIN}/`,
    {
      eyebrow: '.hero .eyebrow',
      h1: '.hero h1',
      primary: '.hero .primary-button',
      policy: '.hero .policy-link',
    },
    w.inner,
    false,
  );
  check('hero eyebrow', o.out.eyebrow, w.out.eyebrow, TEXT_PROPS);
  check('hero h1', o.out.h1, w.out.h1, TEXT_PROPS);
  check('hero primary', o.out.primary, w.out.primary, TEXT_PROPS);
  check('hero policy', o.out.policy, w.out.policy, TEXT_PROPS);
}

// Category grid
{
  const w = await styles(
    `${PLAYGROUND}/?fixture=${fixture('src/site/widgets/jr-category-grid/CategoryGrid.fixture.tsx')}`,
    {
      card: '#treatments a[href^="/treatments#"]',
      cardTitle: '#treatments a[href^="/treatments#"] h3',
      cardCopy: '#treatments a[href^="/treatments#"] p',
    },
    2040,
    true,
  );
  const o = await styles(
    `${ORIGIN}/`,
    {
      card: '.category-card',
      cardTitle: '.category-copy h3',
      cardCopy: '.category-copy p',
    },
    w.inner,
    false,
  );
  check('grid card', o.out.card, w.out.card, BOX_PROPS);
  check('grid card title', o.out.cardTitle, w.out.cardTitle, TEXT_PROPS);
  check('grid card copy', o.out.cardCopy, w.out.cardCopy, TEXT_PROPS);
}

await browser.close();

if (failures.length > 0) {
  console.log('CSS PARITY FAILURES:');
  failures.forEach((failure) => console.log(`  ${failure}`));
  process.exit(1);
}
console.log('CSS parity OK (hero, category grid)');
