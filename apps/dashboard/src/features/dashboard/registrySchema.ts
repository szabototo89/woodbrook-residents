import { z } from 'zod';

export const appSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  stack: z.string().min(2),
  localUrl: z.string().regex(/^http:\/\/localhost:\d+$/),
  scripts: z.record(z.string(), z.string()),
});

export const infraLinkSchema = z.object({
  label: z.string().min(3),
  url: z.string().regex(/^https:\/\//),
  group: z.enum(['source', 'hosting', 'cms', 'analytics', 'local']),
});

export const actionSchema = z.object({
  label: z.string().min(3),
  command: z.string().regex(/^bun run /),
  cwd: z.string().min(1),
});

export function validateRegistry(input: unknown) {
  return z
    .object({
      apps: z.array(appSchema).min(1),
      infraLinks: z.array(infraLinkSchema).min(1),
      actions: z.array(actionSchema).min(1),
    })
    .parse(input);
}
