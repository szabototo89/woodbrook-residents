import { afterEach, expect, test } from 'bun:test';
import { runNonInteractive, type TextSink } from './noninteractive';
import { createDevManager, type DevManager } from './process-manager';
import {
  freePort,
  projectStatus,
  repoRoot,
  serverProject,
  sleep,
  waitFor,
} from './testing';

const managers: DevManager[] = [];

function collector(): { sink: TextSink; text: () => string } {
  const chunks: string[] = [];
  return {
    sink: { write: (text) => chunks.push(text) },
    text: () => chunks.join(''),
  };
}

afterEach(async () => {
  await Promise.all(managers.map((manager) => manager.dispose()));
  managers.splice(0, managers.length);
});

test('streams identified logs and stops every owned project when aborted', async () => {
  const port = await freePort();
  const manager = createDevManager({
    repoRoot,
    projects: [serverProject('alpha', port)],
    probeIntervalMs: 20,
    defaultReadyTimeoutMs: 5000,
    stopTimeoutMs: 2000,
  });
  managers.push(manager);
  const stdout = collector();
  const stderr = collector();
  const abort = new AbortController();

  const running = runNonInteractive(manager, {
    signal: abort.signal,
    stdout: stdout.sink,
    stderr: stderr.sink,
  });

  await waitFor(() => stdout.text().includes('[alpha] ready at'));
  expect(stdout.text()).toContain('Starting 1 projects: alpha.');
  expect(stdout.text()).toContain('[alpha] alpha: listening at');

  abort.abort();
  const code = await running;

  expect(code).toBe(0);
  expect(projectStatus(manager.getView(), 'alpha')).toBe('stopped');
  expect(stdout.text()).toContain('Stopping all projects.');
});

test('returns exit code 1 when every project fails to start', async () => {
  const manager = createDevManager({
    repoRoot,
    projects: [
      {
        id: 'bad',
        label: 'bad',
        cwd: '.',
        command: ['bun', 'scripts/dev/fixtures/fail.ts'],
        env: { EXIT_CODE: '4', NAME: 'bad' },
        ports: [await freePort()],
        url: 'http://localhost:1',
        readiness: [{ kind: 'tcp', port: 1 }],
      },
    ],
    probeIntervalMs: 20,
    defaultReadyTimeoutMs: 5000,
    stopTimeoutMs: 1000,
  });
  managers.push(manager);
  const stdout = collector();
  const stderr = collector();

  const code = await runNonInteractive(manager, {
    stdout: stdout.sink,
    stderr: stderr.sink,
  });

  expect(code).toBe(1);
  expect(stdout.text()).toContain('[bad] failed:');
  expect(stderr.text()).toContain('[bad] bad: intentional failure');
});

test('keeps the runner alive when one project crashes and another keeps running', async () => {
  const [crashPort, steadyPort] = await Promise.all([freePort(), freePort()]);
  const manager = createDevManager({
    repoRoot,
    projects: [
      serverProject('crash', crashPort, {
        env: { EXIT_AFTER_MS: '200', EXIT_CODE: '2' },
      }),
      serverProject('steady', steadyPort),
    ],
    probeIntervalMs: 20,
    defaultReadyTimeoutMs: 5000,
    stopTimeoutMs: 2000,
  });
  managers.push(manager);
  const stdout = collector();
  const abort = new AbortController();

  const running = runNonInteractive(manager, {
    signal: abort.signal,
    stdout: stdout.sink,
    stderr: collector().sink,
  });

  await waitFor(() => stdout.text().includes('[crash] failed:'));
  expect(projectStatus(manager.getView(), 'steady')).toBe('running');
  await sleep(100);
  abort.abort();

  expect(await running).toBe(0);
  expect(projectStatus(manager.getView(), 'crash')).not.toBe('running');
});
