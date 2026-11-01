import { expect, test } from 'bun:test';
import { testRender } from '@opentui/react/test-utils';
import { act } from 'react';
import { FakeDevController, projectView, viewOf } from '../testing';
import { DevManagerApp } from './DevManagerApp';

const now = 1_700_000_000_000;

const makeController = (): FakeDevController =>
  new FakeDevController(
    viewOf([
      projectView({
        id: 'alpha',
        label: 'Alpha site',
        status: 'running',
        url: 'http://localhost:3000',
        ports: [3000],
        logs: [
          { at: now, stream: 'system', text: 'Ready at http://localhost:3000' },
          { at: now, stream: 'stdout', text: 'alpha: listening at 3000' },
        ],
      }),
      projectView({
        id: 'beta',
        label: 'Beta site',
        status: 'failed',
        url: 'http://localhost:3001',
        ports: [3001],
        error: 'Port 3001 is already in use.',
      }),
      projectView({
        id: 'gamma',
        label: 'Gamma site',
        status: 'stopped',
        url: 'http://localhost:3002',
        ports: [3002],
      }),
    ]),
  );

test('renders project states, URLs and logs, and reacts to keyboard controls', async () => {
  const controller = makeController();
  const quits: number[] = [];
  const setup = await testRender(
    <DevManagerApp manager={controller} onQuit={() => quits.push(1)} />,
    { width: 120, height: 40 },
  );

  try {
    await setup.renderOnce();
    const initial = setup.captureCharFrame();
    expect(initial).toContain('Woodbrook dev manager');
    expect(initial).toContain('1/3 running');
    expect(initial).toContain('Alpha site');
    expect(initial).toContain('http://localhost:3000');
    expect(initial).toContain('Port 3001 is already in use.');
    expect(initial).toContain('alpha: listening at 3000');
    expect(initial).toContain('s start');
    expect(initial).toContain('q quit');
    const alphaRow = initial
      .split('\n')
      .find((line) => line.includes('Alpha site'));
    expect(alphaRow).toContain('> running');

    await act(async () => {
      await setup.mockInput.pressKeys(['ARROW_DOWN'], 20);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await setup.flush();
    });
    await setup.renderOnce();
    const selected = setup.captureCharFrame();
    const betaRow = selected
      .split('\n')
      .find((line) => line.includes('Beta site'));
    expect(betaRow).toContain('> failed');

    await act(async () => {
      setup.mockInput.pressKey('s');
      setup.mockInput.pressKey('x');
      setup.mockInput.pressKey('r');
      await setup.flush();
    });
    expect(controller.started).toEqual(['beta']);
    expect(controller.stopping).toEqual(['beta']);
    expect(controller.restarted).toEqual(['beta']);

    await act(async () => {
      setup.resize(90, 24);
      await setup.flush();
    });
    await setup.renderOnce();
    const resized = setup.captureCharFrame();
    expect(resized).toContain('Up/Down select');
    expect(resized).toContain('Beta site');

    await act(async () => {
      setup.mockInput.pressKey('q');
      await setup.flush();
    });
    expect(quits.length).toBe(1);
  } finally {
    setup.renderer.destroy();
  }
});
