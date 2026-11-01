import { expect, test } from 'bun:test';
import { DEV_PROJECTS } from './projects';
import { devUsage, parseDevCliOptions } from './cli';

const tty = { stdoutIsTty: true, env: {} };

test('opens the interactive list only for a usable terminal', () => {
  expect(parseDevCliOptions([], tty).interactive).toBe(true);
  expect(
    parseDevCliOptions([], { stdoutIsTty: false, env: {} }).interactive,
  ).toBe(false);
  expect(
    parseDevCliOptions([], { stdoutIsTty: true, env: { CI: '1' } }).interactive,
  ).toBe(false);
  expect(
    parseDevCliOptions([], { stdoutIsTty: true, env: { TERM: 'dumb' } })
      .interactive,
  ).toBe(false);
});

test('lets an explicit option override terminal detection', () => {
  expect(parseDevCliOptions(['--no-interactive'], tty).interactive).toBe(false);
  expect(
    parseDevCliOptions(['--interactive'], {
      stdoutIsTty: false,
      env: { CI: 'true' },
    }).interactive,
  ).toBe(true);
});

test('rejects unknown options and documents the inventory', () => {
  expect(() => parseDevCliOptions(['--nope'], tty)).toThrow('Unknown option');

  const usage = devUsage(DEV_PROJECTS);
  expect(usage).toContain('bun run dev:all');
  expect(usage).toContain('--no-interactive');
  expect(usage).toContain('http://localhost:3000');
  expect(usage).toContain('mobile');
});
