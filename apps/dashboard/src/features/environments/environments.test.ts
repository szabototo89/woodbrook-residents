import { expect, test } from 'vitest';

import { apps } from '../dashboard/registry';
import {
  filterEnvironments,
  getStatusMeta,
  getWorkspaceEnvironments,
  parseEnvironmentFilters,
  serializeEnvironmentFilters,
  summarizeEnvironments,
} from './environments';

test('environment status vocabulary uses normalized operational states', () => {
  expect(getStatusMeta('running').label).toBe('Running');
  expect(getStatusMeta('starting').label).toBe('Starting…');
  expect(getStatusMeta('stopping').label).toBe('Stopping…');
  expect(getStatusMeta('stopped').label).toBe('Stopped');
  expect(getStatusMeta('updating').label).toBe('Updating…');
  expect(getStatusMeta('paused').label).toBe('Paused');
  expect(getStatusMeta('failed').label).toBe('Failed');
  expect(getStatusMeta('unhealthy').label).toBe('Unhealthy');
  expect(getStatusMeta('expired').label).toBe('Expired');
  expect(getStatusMeta('deleting').label).toBe('Deleting…');
});

test('transitional states pulse while stable states do not', () => {
  expect(getStatusMeta('starting').isPulsing).toBe(true);
  expect(getStatusMeta('stopping').isPulsing).toBe(true);
  expect(getStatusMeta('updating').isPulsing).toBe(true);
  expect(getStatusMeta('deleting').isPulsing).toBe(true);
  expect(getStatusMeta('running').isPulsing).toBe(false);
  expect(getStatusMeta('stopped').isPulsing).toBe(false);
  expect(getStatusMeta('failed').isPulsing).toBe(false);
});

test('workspace environments derive honest local targets from the registry', () => {
  const envs = getWorkspaceEnvironments(apps);
  expect(envs.length).toBe(apps.length);
  for (const env of envs) {
    // No live backend probes local servers, so never report running.
    expect(env.status).toBe('stopped');
    expect(env.type).toBe('development');
    expect(env.ttl).toBeNull();
    expect(env.cost).toBeNull();
    expect(env.repository).toMatch(/^https:\/\//);
    expect(env.branch.length).toBeGreaterThan(0);
    expect(env.owner.length).toBeGreaterThan(0);
    expect(env.localUrl).toMatch(/^http:\/\/localhost:\d+$/);
  }
  const names = envs.map((env) => env.id);
  expect(names).toContain('web-local');
});

test('environment filtering supports search, status, owner, and lifecycle', () => {
  const envs = getWorkspaceEnvironments(apps);
  expect(filterEnvironments(envs, {}).length).toBe(envs.length);
  expect(
    filterEnvironments(envs, { search: 'cms' }).every((env) =>
      `${env.name} ${env.project}`.includes('cms'),
    ),
  ).toBe(true);
  expect(filterEnvironments(envs, { status: 'running' })).toEqual([]);
  expect(filterEnvironments(envs, { status: 'stopped' }).length).toBe(
    envs.length,
  );
  expect(filterEnvironments(envs, { lifecycle: 'no-ttl' }).length).toBe(
    envs.length,
  );
  expect(filterEnvironments(envs, { lifecycle: 'expiring-24h' })).toEqual([]);
  expect(filterEnvironments(envs, { lifecycle: 'expiring-3d' })).toEqual([]);
  expect(filterEnvironments(envs, { lifecycle: 'inactive-7d' })).toEqual([]);
  expect(filterEnvironments(envs, { owner: '  ENGINEERING ' }).length).toBe(
    envs.length,
  );
  expect(filterEnvironments(envs, { owner: 'other' })).toEqual([]);
  expect(
    filterEnvironments(envs, { template: 'tanstack' }).length,
  ).toBeGreaterThan(0);
  expect(filterEnvironments(envs, { search: '   ' }).length).toBe(envs.length);
  expect(parseEnvironmentFilters(new URLSearchParams())).toEqual({});
});

test('environment summary counts operational states without invented data', () => {
  const envs = getWorkspaceEnvironments(apps);
  const summary = summarizeEnvironments(envs);
  expect(summary.total).toBe(envs.length);
  expect(summary.running).toBe(0);
  expect(summary.stopped).toBe(envs.length);
  expect(summary.failed).toBe(0);
  expect(summary.expiring).toBe(0);
});

test('environment filters round-trip through URL search params', () => {
  const filters = parseEnvironmentFilters(
    new URLSearchParams(
      'search=cms&status=stopped&owner=engineering&template=strapi&lifecycle=no-ttl',
    ),
  );
  expect(filters).toEqual({
    search: 'cms',
    status: 'stopped',
    owner: 'engineering',
    template: 'strapi',
    lifecycle: 'no-ttl',
  });
  const params = serializeEnvironmentFilters(filters);
  expect(params.get('search')).toBe('cms');
  expect(params.get('status')).toBe('stopped');
  expect(params.get('lifecycle')).toBe('no-ttl');
  expect(serializeEnvironmentFilters({}).toString()).toBe('');
});
