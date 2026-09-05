import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const issueCategorySchema = z.enum([
  'lighting',
  'litter',
  'drainage',
  'roads-paths',
  'landscaping',
  'traffic',
  'other',
]);

export const issueReportSchema = z.object({
  category: issueCategorySchema,
  location: z.string().trim().min(3).max(180),
  details: z.string().trim().min(15).max(3000),
  reporterName: z.string().trim().max(100).optional(),
  reporterEmail: z.union([z.literal(''), z.email()]).optional(),
  consent: z.literal(true),
});

export type IssueReportInput = z.infer<typeof issueReportSchema>;

export const submitIssueReport = createServerFn({ method: 'POST' })
  .validator(issueReportSchema)
  .handler(async ({ data }) => {
    const strapiUrl = process.env.STRAPI_URL ?? 'http://localhost:1337';
    const response = await fetch(`${strapiUrl}/api/issue-reports`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...data,
          reporterName: data.reporterName || undefined,
          reporterEmail: data.reporterEmail || undefined,
          state: 'new',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('The report could not be saved.');
    }

    return { ok: true };
  });
