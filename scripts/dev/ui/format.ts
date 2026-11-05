import type { ProjectStatus } from '../types';

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  stopped: '#8b949e',
  starting: '#e3b341',
  running: '#3fb950',
  stopping: '#79c0ff',
  failed: '#f85149',
};

export const padEnd = (value: string, width: number): string =>
  value.length >= width ? value.slice(0, width) : value.padEnd(width);

export const truncate = (value: string, width: number): string =>
  value.length <= width ? value : `${value.slice(0, Math.max(0, width - 1))}…`;

export const formatTime = (at: number): string =>
  new Date(at).toISOString().slice(11, 19);

export const projectStatusColor = (status: ProjectStatus): string =>
  STATUS_COLORS[status];
