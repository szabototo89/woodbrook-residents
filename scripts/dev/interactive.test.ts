import { expect, test } from 'bun:test';
import { runInteractive, type InteractiveMountProps } from './interactive';
import { FakeDevController, projectView, viewOf, waitFor } from './testing';

const controller = () =>
  new FakeDevController(
    viewOf([projectView({ id: 'alpha', status: 'stopped' })]),
  );

test('starts projects after mounting and restores the terminal when the user quits', async () => {
  const app = controller();
  const destroyed: number[] = [];
  const mounted: { props?: InteractiveMountProps } = {};

  const running = runInteractive(app, {
    mount: async (props) => {
      mounted.props = props;
      return { destroy: () => destroyed.push(1) };
    },
  });

  await waitFor(() => mounted.props !== undefined);
  expect(app.startAllCalls).toBe(1);
  mounted.props?.onQuit();
  expect(await running).toBe(0);
  expect(app.stopAllCalls).toBeGreaterThanOrEqual(1);
  expect(destroyed.length).toBe(1);
});

test('quits and cleans up on a termination signal', async () => {
  const app = controller();
  const destroyed: number[] = [];
  const abort = new AbortController();

  const running = runInteractive(app, {
    signal: abort.signal,
    mount: async () => ({ destroy: () => destroyed.push(1) }),
  });

  abort.abort();
  expect(await running).toBe(0);
  expect(app.stopAllCalls).toBeGreaterThanOrEqual(1);
  expect(destroyed.length).toBe(1);
});

test('returns a failure status without mounting controls when the terminal cannot start', async () => {
  const app = controller();
  const code = await runInteractive(app, {
    mount: async () => {
      throw new Error('no terminal');
    },
  });

  expect(code).toBe(1);
  expect(app.stopAllCalls).toBe(1);
});
