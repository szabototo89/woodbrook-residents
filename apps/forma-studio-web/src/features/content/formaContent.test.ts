import { expect, test, vi } from 'vitest';
import legacy from '../../../migration/legacy-content.json';
import { parseFormaContent } from './schema';
import { fetchFormaContent, FORMA_QUERY } from './fetchContent';

function contentFixture() {
  const fixture = structuredClone(legacy);
  const resolved = (image: typeof fixture.settings.logo) => ({
    ...image,
    asset: {
      ...image.asset,
      url: `https://cdn.sanity.io/images/ms27me7o/production/${image.asset._id}`,
    },
  });
  fixture.settings.logo = resolved(fixture.settings.logo);
  fixture.home.hero.image = resolved(fixture.home.hero.image);
  fixture.home.selectedWork[0]!.image = resolved(
    fixture.home.selectedWork[0]!.image,
  );
  fixture.journal.guides[0]!.image = resolved(
    fixture.journal.guides[0]!.image!,
  );
  return fixture;
}
function replaceField(payload: object, path: string, value: unknown) {
  const keys = path.split('.');
  const parent = keys
    .slice(0, -1)
    .reduce<object>((current, key) => Reflect.get(current, key), payload);
  Reflect.set(parent, keys.at(-1)!, value);
}

test('valid published content retains services, references and dated guide sources', () => {
  const content = parseFormaContent(contentFixture());
  expect(content.home.services[0]?.title).toBe('Website Design');
  expect(content.journal.guides[0]?.source.accessed).toBe('2026-10-03');
  expect(content.home.selectedWork[0]?.url).toBe(
    'https://laura-faichney-all-things-art.pages.dev',
  );
});

test.each([
  ['missing homepage', 'home', null, 'home'],
  ['blank copy', 'home.hero.description', ' ', 'home.hero.description'],
  [
    'unsupported icon',
    'home.services.0.icon',
    'unknown',
    'home.services.0.icon',
  ],
  [
    'unsafe URL',
    'home.selectedWork.0.url',
    'javascript:alert(1)',
    'home.selectedWork.0.url',
  ],
  [
    'invalid email',
    'settings.enquiryEmail',
    'invalid',
    'settings.enquiryEmail',
  ],
  [
    'invalid date',
    'journal.guides.0.source.accessed',
    '2026-02-30',
    'journal.guides.0.source.accessed',
  ],
  [
    'missing source',
    'journal.guides.0.source.url',
    undefined,
    'journal.guides.0.source.url',
  ],
  ['broken reference', 'home.selectedWork.0', null, 'home.selectedWork.0'],
  [
    'unpublished guide',
    'journal.guides.0._id',
    'drafts.secret',
    'journal.guides.0._id',
  ],
  [
    'release version',
    'home.selectedWork.0._id',
    'versions.release.secret',
    'home.selectedWork.0._id',
  ],
  ['unresolved image', 'home.hero.image.asset', null, 'home.hero.image.asset'],
  ['missing alt', 'settings.logo.alt', '', 'settings.logo.alt'],
  [
    'missing dimensions',
    'home.hero.image.asset.width',
    undefined,
    'home.hero.image.asset.width',
  ],
  ['no guides', 'journal.guides', [], 'journal.guides'],
  [
    'duplicate anchor',
    'journal.guides',
    [legacy.journal.guides[1], legacy.journal.guides[1]],
    'journal.guides',
  ],
])(
  'rejects %s with a document and field diagnostic',
  (_name, path, value, field) => {
    const payload = contentFixture();
    replaceField(payload, path, value);
    expect(() => parseFormaContent(payload)).toThrow(field);
  },
);

test('unknown fields never reach the public snapshot', () => {
  const payload = contentFixture();
  Reflect.set(payload.settings, 'internalSecret', 'private');
  expect(JSON.stringify(parseFormaContent(payload))).not.toContain('private');
});

test('fetches fresh published content and validates the response', async () => {
  const request = vi
    .fn()
    .mockResolvedValue(Response.json({ result: contentFixture() }));
  const result = await fetchFormaContent(
    { projectId: 'ms27me7o', dataset: 'production', token: 'test-secret' },
    request,
  );
  const url = new URL(request.mock.calls[0]![0]);
  expect(url.hostname).toBe('ms27me7o.api.sanity.io');
  expect(url.searchParams.get('perspective')).toBe('published');
  expect(url.searchParams.get('query')).toBe(FORMA_QUERY);
  expect(FORMA_QUERY).toContain('drafts.**');
  expect(FORMA_QUERY).toContain('versions.**');
  expect(FORMA_QUERY).toContain('asset->');
  expect(result.settings.enquiryEmail).toBe('szabototo89@gmail.com');
});

test.each([
  [
    'HTTP failure',
    () => Promise.resolve(new Response('test-secret', { status: 401 })),
  ],
  ['network failure', () => Promise.reject(new Error('test-secret'))],
  ['bad JSON', () => Promise.resolve(new Response('test-secret'))],
  [
    'missing result',
    () => Promise.resolve(Response.json({ error: 'test-secret' })),
  ],
  [
    'invalid content',
    () => Promise.resolve(Response.json({ result: { home: null } })),
  ],
])('fails closed on %s without logging secrets', async (_name, request) => {
  const result = fetchFormaContent(
    { projectId: 'ms27me7o', dataset: 'production', token: 'test-secret' },
    request,
  );
  await expect(result).rejects.toThrow(/Forma content/);
  await expect(result).rejects.not.toThrow('test-secret');
});

test('a guide without an optional image accepts Sanity null projections', () => {
  const payload = contentFixture();
  replaceField(payload, 'journal.guides.1.image', null);
  expect(parseFormaContent(payload).journal.guides[1]?.image).toBeUndefined();
});
