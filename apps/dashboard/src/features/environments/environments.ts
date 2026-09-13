import type { StatusDotVariant } from '@astryxdesign/core/StatusDot';

import type { DashboardApp } from '../dashboard/registry';

export type EnvironmentStatus =
  | 'running'
  | 'starting'
  | 'stopping'
  | 'stopped'
  | 'updating'
  | 'paused'
  | 'failed'
  | 'unhealthy'
  | 'expired'
  | 'deleting';

export type EnvironmentType =
  'development' | 'preview' | 'staging' | 'production';

export interface StatusMeta {
  label: string;
  variant: StatusDotVariant;
  isPulsing: boolean;
}

const STATUS_META: Record<EnvironmentStatus, StatusMeta> = {
  running: { label: 'Running', variant: 'success', isPulsing: false },
  starting: { label: 'Starting…', variant: 'accent', isPulsing: true },
  stopping: { label: 'Stopping…', variant: 'accent', isPulsing: true },
  stopped: { label: 'Stopped', variant: 'neutral', isPulsing: false },
  updating: { label: 'Updating…', variant: 'accent', isPulsing: true },
  paused: { label: 'Paused', variant: 'warning', isPulsing: false },
  failed: { label: 'Failed', variant: 'error', isPulsing: false },
  unhealthy: { label: 'Unhealthy', variant: 'error', isPulsing: false },
  expired: { label: 'Expired', variant: 'neutral', isPulsing: false },
  deleting: { label: 'Deleting…', variant: 'neutral', isPulsing: true },
};

export function getStatusMeta(status: EnvironmentStatus): StatusMeta {
  return STATUS_META[status];
}

export interface WorkspaceEnvironment {
  id: string;
  name: string;
  project: string;
  type: EnvironmentType;
  template: string;
  owner: string;
  repository: string;
  branch: string;
  region: string;
  localUrl: string;
  status: EnvironmentStatus;
  /** Null means no TTL is configured for this local target. */
  ttl: null;
  /** Null means cost tracking is not configured. */
  cost: null;
  detail: string;
}

const REPOSITORY = 'https://github.com/szabototo89/woodbrook-residents';

export function getWorkspaceEnvironments(
  appList: DashboardApp[],
): WorkspaceEnvironment[] {
  return appList.map((app) => ({
    id: `${app.name}-local`,
    name: `${app.name}-local`,
    project: app.name,
    type: 'development',
    template: app.stack,
    owner: 'Engineering',
    repository: REPOSITORY,
    branch: 'main',
    region: 'local',
    localUrl: app.localUrl,
    // There is no live backend probing local servers, so never report
    // running. Stopped is the honest default with a start-locally recovery.
    status: 'stopped',
    ttl: null,
    cost: null,
    detail: app.description,
  }));
}

export type LifecycleFilter =
  'expiring-24h' | 'expiring-3d' | 'no-ttl' | 'inactive-7d';

export interface EnvironmentFilters {
  search?: string;
  status?: EnvironmentStatus;
  owner?: string;
  template?: string;
  lifecycle?: LifecycleFilter;
}

export function filterEnvironments(
  envs: WorkspaceEnvironment[],
  filters: EnvironmentFilters,
): WorkspaceEnvironment[] {
  const search = filters.search?.trim().toLowerCase();
  return envs.filter((env) => {
    if (
      search &&
      !`${env.name} ${env.project} ${env.template} ${env.branch}`
        .toLowerCase()
        .includes(search)
    ) {
      return false;
    }
    if (filters.status && env.status !== filters.status) return false;
    if (
      filters.owner &&
      env.owner.toLowerCase() !== filters.owner.trim().toLowerCase()
    ) {
      return false;
    }
    if (
      filters.template &&
      !env.template
        .toLowerCase()
        .includes(filters.template.trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.lifecycle === 'no-ttl' && env.ttl !== null) return false;
    if (
      (filters.lifecycle === 'expiring-24h' ||
        filters.lifecycle === 'expiring-3d' ||
        filters.lifecycle === 'inactive-7d') &&
      env.ttl === null
    ) {
      return false;
    }
    return true;
  });
}

export interface EnvironmentSummary {
  total: number;
  running: number;
  stopped: number;
  failed: number;
  expiring: number;
}

export function summarizeEnvironments(
  envs: WorkspaceEnvironment[],
): EnvironmentSummary {
  return {
    total: envs.length,
    running: envs.filter((env) => env.status === 'running').length,
    stopped: envs.filter((env) => env.status === 'stopped').length,
    failed: envs.filter(
      (env) => env.status === 'failed' || env.status === 'unhealthy',
    ).length,
    expiring: envs.filter((env) => env.ttl !== null).length,
  };
}

const FILTER_KEYS: Array<keyof EnvironmentFilters> = [
  'search',
  'status',
  'owner',
  'template',
  'lifecycle',
];

export function parseEnvironmentFilters(
  params: URLSearchParams,
): EnvironmentFilters {
  const filters: EnvironmentFilters = {};
  for (const key of FILTER_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      filters[key] = value as never;
    }
  }
  return filters;
}

export function serializeEnvironmentFilters(
  filters: EnvironmentFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key]?.trim();
    if (value) params.set(key, value);
  }
  return params;
}
