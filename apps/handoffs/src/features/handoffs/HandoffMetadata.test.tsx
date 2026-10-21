import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { HandoffMetadata } from './HandoffMetadata';

test('the header shows recorded Git context and its UTC timestamp', () => {
  const markup = renderToStaticMarkup(
    <HandoffMetadata
      metadata={{
        title: 'Test handoff',
        summary: 'Summary',
        status: 'ready for review',
        agent: 'opencode',
        session: 'ses_test',
        worktree: '/tmp/session-worktree',
        branch: 'session/test-feature',
        commit: 'abc1234',
        updatedAt: '2026-10-21T11:45:00Z',
      }}
    />,
  );
  expect(markup).toContain('Worktree');
  expect(markup).toContain('/tmp/session-worktree');
  expect(markup).toContain('Coding agent');
  expect(markup).toContain('opencode');
  expect(markup).toContain('Session');
  expect(markup).toContain('ses_test');
  expect(markup).toContain('session/test-feature');
  expect(markup).toContain('Recorded HEAD');
  expect(markup).toContain('abc1234');
  expect(markup).toContain('Updated (UTC)');
  expect(markup.toLowerCase()).toContain('datetime="2026-10-21t11:45:00z"');
  expect(markup).toContain('ready for review');
});

test('older handoffs explicitly show when metadata has not been recorded', () => {
  const markup = renderToStaticMarkup(
    <HandoffMetadata
      metadata={{ title: 'Old document', summary: 'Summary' }}
    />,
  );
  expect(markup.match(/Not recorded/g)).toHaveLength(7);
});
