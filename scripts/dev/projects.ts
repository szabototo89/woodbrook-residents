import type { DevProject } from './types';

const http = (port: number): DevProject['readiness'][number] => ({
  kind: 'http',
  url: `http://127.0.0.1:${port}/`,
});

const localUrl = (port: number): string => `http://localhost:${port}`;

/**
 * Every browser-based project that `bun run dev:all` starts.
 *
 * Add a project by appending one entry with a unique port. Keep each command
 * pointed at its own app directory: the launcher never shares one project's
 * server with another and never starts a process it does not own.
 */
export const DEV_PROJECTS: readonly DevProject[] = [
  {
    id: 'web',
    label: 'Woodbrook web',
    cwd: 'apps/web',
    command: ['bun', 'run', '--env-file=../../.env', 'dev'],
    env: { CONTENT_SOURCE: 'sanity' },
    ports: [3000],
    url: localUrl(3000),
    readiness: [http(3000)],
  },
  {
    id: 'dashboard',
    label: 'Resident dashboard',
    cwd: 'apps/dashboard',
    command: ['bun', 'run', 'dev'],
    ports: [3001],
    url: localUrl(3001),
    readiness: [http(3001)],
  },
  {
    id: 'design-proposal',
    label: 'Design proposal',
    cwd: 'apps/design-proposal',
    command: ['bun', 'run', 'dev'],
    ports: [3004],
    url: localUrl(3004),
    readiness: [http(3004)],
  },
  {
    id: 'design-proposals',
    label: 'Design proposals',
    cwd: 'apps/design-proposals',
    command: ['bun', 'run', 'dev'],
    ports: [3006],
    url: localUrl(3006),
    readiness: [http(3006)],
  },
  {
    id: 'forma-studio-web',
    label: 'Forma Studio web',
    cwd: 'apps/forma-studio-web',
    command: ['bun', 'run', 'dev'],
    ports: [3005],
    url: localUrl(3005),
    readiness: [http(3005)],
  },
  {
    id: 'forma-studio',
    label: 'Forma Studio',
    cwd: 'apps/forma-studio',
    command: ['bun', 'run', 'dev'],
    ports: [3335],
    url: localUrl(3335),
    readiness: [http(3335)],
  },
  {
    id: 'laura-faichney-web',
    label: 'Laura Faichney web',
    cwd: 'apps/laura-faichney-web',
    command: ['bun', 'run', 'dev'],
    ports: [3003],
    url: localUrl(3003),
    readiness: [http(3003)],
  },
  {
    id: 'laura-studio',
    label: 'Laura Faichney Studio',
    cwd: 'apps/laura-studio',
    command: ['bun', 'run', 'dev'],
    ports: [3334],
    url: localUrl(3334),
    readiness: [http(3334)],
  },
  {
    id: 'sanity-studio',
    label: 'Woodbrook Sanity Studio',
    cwd: 'apps/sanity-studio',
    command: ['bun', 'run', 'dev'],
    ports: [3333],
    url: localUrl(3333),
    readiness: [http(3333)],
  },
  {
    id: 'handoffs',
    label: 'Handoffs',
    cwd: 'apps/handoffs',
    command: ['bun', 'run', 'dev'],
    ports: [3002],
    url: localUrl(3002),
    readiness: [http(3002)],
  },
  {
    id: 'mobile',
    label: 'Mobile web',
    cwd: 'apps/mobile',
    command: ['bun', 'run', '--env-file=../../.env', 'dev'],
    ports: [3202, 3203],
    url: localUrl(3203),
    readiness: [{ kind: 'tcp', port: 3202 }, http(3203)],
  },
];

export const DEV_PROJECT_IDS = DEV_PROJECTS.map((project) => project.id);
