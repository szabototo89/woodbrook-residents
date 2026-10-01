import { z } from 'zod';

export const infraGroupSchema = z.enum([
  'source',
  'hosting',
  'cms',
  'analytics',
  'local',
]);

export const appSchema = z.object({
  name: z.string().min(1).describe('Dashboard application name.'),
  description: z
    .string()
    .min(10)
    .describe('Short dashboard application summary.'),
  stack: z.string().min(2).describe('Technology stack label.'),
  localUrl: z
    .string()
    .regex(/^http:\/\/localhost:\d+$/)
    .describe('Local development URL.'),
  scripts: z
    .record(z.string(), z.string())
    .describe('Package script name to command mapping.'),
  infraGroups: z
    .array(infraGroupSchema)
    .min(1)
    .describe('Infrastructure groups for the application.'),
});

export const infraLinkSchema = z.object({
  label: z.string().min(3).describe('Infrastructure link label.'),
  url: z
    .string()
    .regex(/^https:\/\//)
    .describe('HTTPS URL for the infrastructure link.'),
  group: infraGroupSchema.describe('Infrastructure group for the link.'),
});

export const actionSchema = z.object({
  label: z.string().min(3).describe('Dashboard action label.'),
  command: z
    .string()
    .regex(/^bun run /)
    .describe('Bun run command for the action.'),
  cwd: z.string().min(1).describe('Working directory for the action command.'),
});

export function validateRegistry(input: unknown) {
  return z
    .object({
      apps: z.array(appSchema).min(1).describe('Dashboard applications list.'),
      infraLinks: z
        .array(infraLinkSchema)
        .min(1)
        .describe('Infrastructure links list.'),
      actions: z.array(actionSchema).min(1).describe('Dashboard actions list.'),
    })
    .parse(input);
}
