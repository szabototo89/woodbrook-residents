import { afterEach, expect, test } from 'bun:test';
import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createDevManager, type DevManager } from './process-manager';
import {
  freePort,
  isListening,
  isProcessAlive,
  projectStatus,
  readPids,
  repoRoot,
  serverProject,
  sleep,
  tempDir,
  waitFor,
} from './testing';
import type { DevManagerOptions, DevProject } from './types';

const managers: DevManager[] = [];

function makeManager(
  projects: readonly DevProject[],
  options: Partial<DevManagerOptions> = {},
): DevManager {
  const manager = createDevManager({
    repoRoot,
    projects,
    probeIntervalMs: 20,
    defaultReadyTimeoutMs: 6000,
    stopTimeoutMs: 2500,
    ...options,
  });
  managers.push(manager);
  return manager;
}

afterEach(async () => {
  await Promise.all(managers.map((manager) => manager.dispose()));
  managers.splice(0, managers.length);
});

test('starts projects concurrently without waiting for an earlier server to become ready', async () => {
  const [slowPort, fastPort] = await Promise.all([freePort(), freePort()]);
  const slow = serverProject('slow', slowPort, {
    env: { READY_DELAY_MS: '900' },
  });
  const fast = serverProject('fast', fastPort);
  const manager = makeManager([slow, fast]);

  const started = manager.startAll();
  await waitFor(() => projectStatus(manager.getView(), 'fast') === 'running');
  expect(projectStatus(manager.getView(), 'slow')).toBe('starting');
  await started;

  expect(projectStatus(manager.getView(), 'slow')).toBe('running');
  expect(projectStatus(manager.getView(), 'fast')).toBe('running');
});

test('marks a project ready only after its readiness check succeeds', async () => {
  const port = await freePort();
  const manager = makeManager([
    serverProject('delayed', port, { env: { READY_DELAY_MS: '500' } }),
  ]);

  const started = manager.start('delayed');
  await sleep(200);
  expect(projectStatus(manager.getView(), 'delayed')).toBe('starting');
  expect(await isListening(port)).toBe(false);

  await started;
  expect(projectStatus(manager.getView(), 'delayed')).toBe('running');
  expect(await isListening(port)).toBe(true);
});

test('stops one project, frees its port, and starts it again without touching another project', async () => {
  const [alphaPort, betaPort] = await Promise.all([freePort(), freePort()]);
  const manager = makeManager([
    serverProject('alpha', alphaPort),
    serverProject('beta', betaPort),
  ]);

  await manager.startAll();
  expect(projectStatus(manager.getView(), 'alpha')).toBe('running');
  expect(projectStatus(manager.getView(), 'beta')).toBe('running');

  await manager.stop('alpha');
  expect(projectStatus(manager.getView(), 'alpha')).toBe('stopped');
  expect(await isListening(alphaPort)).toBe(false);
  expect(projectStatus(manager.getView(), 'beta')).toBe('running');
  expect(await isListening(betaPort)).toBe(true);

  const rebound = Bun.serve({
    hostname: '127.0.0.1',
    port: alphaPort,
    fetch() {
      return new Response('free');
    },
  });
  expect(rebound.port).toBe(alphaPort);
  rebound.stop(true);

  await manager.start('alpha');
  expect(projectStatus(manager.getView(), 'alpha')).toBe('running');
  expect(await isListening(alphaPort)).toBe(true);
});

test('ignores repeated start requests instead of creating duplicate instances', async () => {
  const port = await freePort();
  const pidFile = join(tempDir(), 'pid');
  const manager = makeManager([
    serverProject('single', port, { env: { PID_FILE: pidFile } }),
  ]);

  await Promise.all([manager.start('single'), manager.start('single')]);
  await waitFor(() => projectStatus(manager.getView(), 'single') === 'running');

  const [fixturePid] = readPids(pidFile);
  const view = manager.getView();
  expect(view.projects[0]?.pid).toBe(fixturePid);
  const listeningLines = view.projects[0]?.logs.filter((line) =>
    line.text.includes('listening at'),
  );
  expect(listeningLines?.length).toBe(1);
});

test('stops the complete process group, including a wrapper and its child server', async () => {
  const port = await freePort();
  const pidFile = join(tempDir(), 'pids');
  const manager = makeManager([
    {
      id: 'tree',
      label: 'tree',
      cwd: '.',
      command: ['bun', 'scripts/dev/fixtures/wrapper.ts'],
      env: { CHILD_PORT: String(port), NAME: 'tree', PID_FILE: pidFile },
      ports: [port],
      url: `http://localhost:${port}`,
      readiness: [{ kind: 'http', url: `http://127.0.0.1:${port}/` }],
    },
  ]);

  await manager.start('tree');
  expect(projectStatus(manager.getView(), 'tree')).toBe('running');
  const pids = readPids(pidFile);
  expect(pids.length).toBe(2);
  expect(pids.map((pid) => isProcessAlive(pid))).toEqual([true, true]);

  await manager.stop('tree');
  await waitFor(() => pids.every((pid) => !isProcessAlive(pid)));
  expect(await isListening(port)).toBe(false);
});

test('reports an occupied port without starting or terminating its owner', async () => {
  const port = await freePort();
  const occupant = Bun.serve({
    hostname: '127.0.0.1',
    port,
    fetch() {
      return new Response('occupant');
    },
  });
  const manager = makeManager([serverProject('blocked', port)]);

  await manager.start('blocked');

  const view = manager.getView();
  expect(projectStatus(view, 'blocked')).toBe('failed');
  expect(view.projects[0]?.error).toContain(`Port ${port}`);
  expect(view.projects[0]?.pid).toBeUndefined();
  const response = await fetch(`http://127.0.0.1:${port}/`);
  expect(await response.text()).toBe('occupant');
  occupant.stop(true);
});

test('detects a port owned by an IPv6-only process before spawning', async () => {
  const port = await freePort();
  const occupant = Bun.serve({
    hostname: '::1',
    port,
    fetch() {
      return new Response('ipv6 occupant');
    },
  });
  const manager = makeManager([serverProject('blocked-v6', port)]);

  await manager.start('blocked-v6');

  const view = manager.getView();
  expect(projectStatus(view, 'blocked-v6')).toBe('failed');
  expect(view.projects[0]?.error).toContain(`Port ${port}`);
  expect(view.projects[0]?.pid).toBeUndefined();
  const response = await fetch(`http://[::1]:${port}/`);
  expect(await response.text()).toBe('ipv6 occupant');
  occupant.stop(true);
});

test('accepts readiness from a server that listens on IPv6 only', async () => {
  const port = await freePort();
  const manager = makeManager([
    serverProject('v6', port, {
      readyTimeoutMs: 1000,
      env: { HOST: '::1' },
    }),
  ]);

  await manager.start('v6');

  expect(projectStatus(manager.getView(), 'v6')).toBe('running');
});

test('keeps startup errors visible and allows a later start after the cause is fixed', async () => {
  const port = await freePort();
  const failFile = join(tempDir(), 'fixed');
  writeFileSync(failFile, 'broken');
  const manager = makeManager([
    {
      id: 'flaky',
      label: 'flaky',
      cwd: '.',
      command: ['bun', 'scripts/dev/fixtures/fail.ts'],
      env: {
        FAIL_FILE: failFile,
        EXIT_CODE: '5',
        PORT: String(port),
        NAME: 'flaky',
      },
      ports: [port],
      url: `http://localhost:${port}`,
      readiness: [{ kind: 'http', url: `http://127.0.0.1:${port}/` }],
    },
  ]);

  await manager.start('flaky');
  const failed = manager.getView().projects[0];
  expect(failed?.status).toBe('failed');
  expect(failed?.error).toContain('5');
  expect(
    failed?.logs.some((line) => line.text.includes('intentional failure')),
  ).toBe(true);

  rmSync(failFile);
  await manager.start('flaky');
  expect(projectStatus(manager.getView(), 'flaky')).toBe('running');
});

test('marks a project failed when its process exits unexpectedly while others keep running', async () => {
  const [crashPort, steadyPort] = await Promise.all([freePort(), freePort()]);
  const manager = makeManager([
    serverProject('crash', crashPort, {
      env: { EXIT_AFTER_MS: '300', EXIT_CODE: '3' },
    }),
    serverProject('steady', steadyPort),
  ]);

  await manager.startAll();
  await waitFor(
    () => projectStatus(manager.getView(), 'crash') === 'failed',
    3000,
  );
  expect(projectStatus(manager.getView(), 'steady')).toBe('running');
  expect(manager.getView().projects[0]?.error).toContain('3');
  expect(await isListening(steadyPort)).toBe(true);
});

test('force kills a project that ignores SIGTERM and still frees its port', async () => {
  const port = await freePort();
  const pidFile = join(tempDir(), 'stubborn');
  const manager = makeManager(
    [
      serverProject('stubborn', port, {
        env: { IGNORE_SIGTERM: '1', PID_FILE: pidFile },
      }),
    ],
    { stopTimeoutMs: 400 },
  );

  await manager.start('stubborn');
  const [pid] = readPids(pidFile);
  await manager.stop('stubborn');

  expect(projectStatus(manager.getView(), 'stubborn')).toBe('stopped');
  if (pid !== undefined) expect(isProcessAlive(pid)).toBe(false);
  expect(await isListening(port)).toBe(false);
});

test('bounds retained log history', async () => {
  const port = await freePort();
  const manager = makeManager(
    [serverProject('chatty', port, { env: { BURST_LINES: '300' } })],
    { maxLogLines: 50 },
  );

  await manager.start('chatty');
  const logs = manager.getView().projects[0]?.logs ?? [];
  expect(logs.length).toBeLessThanOrEqual(50);
  expect(logs.some((line) => line.text.includes('listening at'))).toBe(true);
});

test('shows the URL that a project announces when it differs from the assigned port', async () => {
  const port = await freePort();
  const announcedPort = await freePort();
  const manager = makeManager([
    serverProject('moved', port, {
      env: { ANNOUNCED_PORT: String(announcedPort) },
    }),
  ]);

  await manager.start('moved');
  await waitFor(
    () =>
      manager.getView().projects[0]?.url ===
      `http://localhost:${announcedPort}`,
  );
});
