import { expect, test } from 'vitest';
import { schemaTypes } from './index';
import config from '../sanity.config';

const type = (name: string) => schemaTypes.find((item) => item.name === name);
test('Forma has isolated configuration and focused page, settings, work and guide editors', () => {
  expect(config).toMatchObject({
    projectId: 'ms27me7o',
    dataset: 'production',
    title: 'Forma Studio',
  });
  expect(
    schemaTypes
      .filter((item) => item.type === 'document')
      .map((item) => item.name),
  ).toEqual([
    'siteSettings',
    'homePage',
    'journalPage',
    'selectedWork',
    'journalGuide',
  ]);
});
test('homepage owns services, packages, steps and FAQs in its publishing lifecycle', () => {
  expect(type('homePage')?.fields.map((field) => field.name)).toEqual(
    expect.arrayContaining([
      'services',
      'packages',
      'steps',
      'faqs',
      'hero',
      'seo',
      'contact',
    ]),
  );
  expect(
    type('service')?.fields.find((field) => field.name === 'icon'),
  ).toMatchObject({
    options: { list: ['website', 'search', 'booking', 'content', 'support'] },
  });
});
test('images require alt text and reference Sanity assets, and guides retain sources', () => {
  expect(type('contentImage')).toMatchObject({
    type: 'image',
    fields: [
      expect.objectContaining({
        name: 'alt',
        validation: expect.any(Function),
      }),
    ],
  });
  expect(
    type('journalGuide')?.fields.find((field) => field.name === 'source'),
  ).toMatchObject({ type: 'contentSource', validation: expect.any(Function) });
  expect(type('contentSource')?.fields.map((field) => field.name)).toEqual([
    'title',
    'url',
    'accessed',
  ]);
  expect(
    type('siteSettings')?.fields.find((field) => field.name === 'enquiryEmail'),
  ).toMatchObject({ validation: expect.any(Function) });
});

test('every Studio field has readable help and the process fields explain their public location', () => {
  schemaTypes.map((type) =>
    type.fields.map((field) => {
      expect(field.description, `${type.name}.${field.name}`).toEqual(
        expect.any(String),
      );
      expect(String(field.description).trim().length).toBeGreaterThan(20);
    }),
  );
  expect(
    type('homePage')?.fields.find((field) => field.name === 'processTitle'),
  ).toMatchObject({
    title: 'Process heading',
    description:
      'Heading above the numbered steps showing how a website project runs.',
  });
});

test('an absent optional journal image is valid but an incomplete supplied image is rejected', async () => {
  const { validateImageSelection } = await import('./imageValidation');
  expect(validateImageSelection(undefined)).toBe(true);
  expect(validateImageSelection(null)).toBe(true);
  expect(validateImageSelection({ alt: 'Screenshot' })).toBe(
    'Choose an image or remove this optional image.',
  );
  expect(
    validateImageSelection({
      asset: { _ref: 'image-example' },
      alt: 'Screenshot',
    }),
  ).toBe(true);
});
