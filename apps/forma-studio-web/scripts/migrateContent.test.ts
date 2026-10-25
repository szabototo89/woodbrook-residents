import { expect, test } from 'vitest';
import fixture from '../tests/fixtureContent';
import { parseFormaContent } from '../src/features/content/schema';
import { migrationDocuments } from './migrationDocuments';

test('migration preserves sources and editorial drafts and uses resolved references', () => {
  const content = parseFormaContent(fixture);
  const docs = migrationDocuments(content, (id) => `new-${id}`);
  expect(docs.find((doc) => doc._id === 'homePage')).toMatchObject({
    selectedWork: [
      {
        _type: 'reference',
        _key: 'new-legacy-laura-project',
        _ref: 'new-legacy-laura-project',
      },
    ],
  });
  const journal = docs.find((doc) => doc._id === 'journalPage');
  if (!journal || !('guides' in journal))
    throw new Error('Migration did not create the journal references.');
  expect(journal.guides).toContainEqual({
    _type: 'reference',
    _key: 'new-legacy-guide-website-design',
    _ref: 'new-legacy-guide-website-design',
  });
  const guides = docs.filter((doc) => doc._type === 'journalGuide');
  expect(guides).toHaveLength(6);
  expect(guides.filter((doc) => doc._id.startsWith('drafts.'))).toHaveLength(3);
  expect(JSON.stringify(guides)).toContain('2026-10-03');
  expect(JSON.stringify(guides)).toContain(
    'https://support.google.com/business/answer/7091',
  );
  expect(JSON.stringify(docs)).not.toContain('"width"');
  expect(content.home.hero.image.asset.url).toContain('https://cdn.sanity.io');
});
