import { afterEach, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LauraSanitySource } from '../../../scripts/lauraSanitySource';
import { PricesPage } from './PricesPage';

const page = {
  eyebrow: 'Pricing & commissions',
  title: 'Art, Creative Events & Tuition',
  introduction: 'A guide to pricing.',
  fallbackQuote: 'Quote on request',
  fallbackGuidance: 'Tell me about your project.',
  enquiryLabel: 'Enquire',
  contactHeading: 'Have something special in mind?',
  contactCopy: 'Get in touch.',
  categories: [],
  seo: { title: 'Prices', description: 'Creative service prices.' },
};
const fixed = {
  label: 'Small painting',
  mode: 'fixed',
  amount: 120,
  currency: 'EUR',
  scope: 'up to 30 × 30 cm',
  inclusions: ['Canvas included'],
};
function mock(categories: unknown[], publishedPage: object | null = page) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        result: {
          page: publishedPage && { ...publishedPage, categories },
        },
      }),
    ),
  );
}
afterEach(() => vi.unstubAllGlobals());

test('loads independently ordered categories, including categories without rates', async () => {
  mock([
    { title: 'New category', serviceSlug: 'new' },
    {
      title: 'Painting',
      serviceSlug: 'painting',
      icon: 'palette',
      offers: [fixed],
    },
  ]);
  const data = await new LauraSanitySource().loadPrices();
  expect(data.categories.map((s) => s.serviceSlug)).toEqual([
    'new',
    'painting',
  ]);
  expect(data.categories[1]?.offers?.[0]).toMatchObject(fixed);
  const html = renderToStaticMarkup(<PricesPage data={data} />);
  expect(html).toContain('€120');
  expect(html).toContain('Fixed price');
  expect(html).toContain('up to 30 × 30 cm');
  expect(html).toContain('Canvas included');
  expect(html).toContain('Quote on request');
  expect(html).toContain('/contact?service=new#enquiry');
  expect(html).toContain('Enquire about Painting');
  expect(html).not.toMatch(/NaN|undefined/);
});

test('renders starting prices, ranges and quote guidance without concealing qualifications', async () => {
  mock([
    {
      title: 'Custom work',
      serviceSlug: 'a & b',
      offers: [
        { ...fixed, mode: 'from', qualifications: 'Framing is separate.' },
        {
          ...fixed,
          mode: 'range',
          amount: undefined,
          minimum: 100,
          maximum: 200,
        },
        {
          label: 'Bespoke',
          mode: 'quote',
          guidance: 'Send dimensions and a reference photo.',
        },
      ],
    },
  ]);
  const html = renderToStaticMarkup(
    <PricesPage data={await new LauraSanitySource().loadPrices()} />,
  );
  for (const text of [
    'From',
    '€120',
    '€100',
    '€200',
    'Guide range',
    'Framing is separate.',
    'Send dimensions and a reference photo.',
    '/contact?service=a%20%26%20b#enquiry',
  ])
    expect(html).toContain(text);
  expect(html).not.toContain('<details');
});

test.each([
  { offers: [] },
  { offers: [{ ...fixed, mode: 'unknown' }] },
  ...[0, -1, Infinity, NaN].map((amount) => ({
    offers: [{ ...fixed, amount }],
  })),
  { offers: [{ ...fixed, scope: ' ' }] },
  { offers: [{ ...fixed, currency: 'ZZZ' }] },
  { offers: [{ ...fixed, mode: 'range', minimum: 200, maximum: 100 }] },
  { offers: [{ label: 'Bespoke', mode: 'quote', guidance: '' }] },
  {
    offers: [
      { label: 'Bespoke', mode: 'quote', guidance: 'Send a photo', amount: 20 },
    ],
  },
])(
  'fails malformed published pricing with a document and field error: %j',
  async (pricing) => {
    mock([{ title: 'Painting', serviceSlug: 'painting', ...pricing }]);
    await expect(new LauraSanitySource().loadPrices()).rejects.toThrow(
      /pricesPage.*categories/i,
    );
  },
);

test.each([null, undefined, { ...page, seo: {} }])(
  'requires the Prices singleton and SEO',
  async (value) => {
    mock([], value === undefined ? null : value);
    await expect(new LauraSanitySource().loadPrices()).rejects.toThrow(
      /pricesPage/,
    );
  },
);

test('unlinked categories use a general enquiry and missing artwork omits the inspiration strip', async () => {
  mock([
    {
      title: 'Gifts and keepsakes',
      offers: [
        {
          label: 'A special gift',
          mode: 'quote',
          guidance: 'Tell me about the recipient.',
        },
      ],
    },
  ]);
  const html = renderToStaticMarkup(
    <PricesPage data={await new LauraSanitySource().loadPrices()} />,
  );
  expect(html).toContain('Gifts and keepsakes');
  expect(html).toContain('href="/contact#enquiry"');
  expect(html).not.toContain('prices-inspiration');
});
