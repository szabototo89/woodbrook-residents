import { z } from 'zod';

import {
  eventSchema,
  projectSchema,
  resourceSchema,
  siteSettingSchema,
  surveySchema,
  updateSchema,
} from './contentSchemas';
import type { ContentSource } from './contentSource';
import type { ContentSnapshot } from './contentTypes';

const collectionEnvelopeSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z
      .array(itemSchema)
      .describe('Published Strapi collection response items.'),
  });

const singleEnvelopeSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: itemSchema
      .nullable()
      .describe('Published Strapi single-type response item.'),
  });

export class StrapiContentSource implements ContentSource {
  readonly name = 'strapi';

  constructor(private readonly baseUrl: string) {}

  private async fetchJson(path: string) {
    const response = await fetch(`${this.baseUrl}/api/${path}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(
        `Strapi request to ${path} failed with status ${response.status}.`,
      );
    }

    return response.json();
  }

  private async loadCollection<T extends z.ZodType>(
    path: string,
    schema: T,
  ): Promise<Array<z.output<T>>> {
    const response = await this.fetchJson(path);
    return collectionEnvelopeSchema(schema).parse(response).data;
  }

  async loadSnapshot(): Promise<ContentSnapshot> {
    const [siteSettingResponse, updates, projects, events, surveys, resources] =
      await Promise.all([
        this.fetchJson('site-setting'),
        this.loadCollection(
          'updates?sort[0]=publishedOn:desc&pagination[pageSize]=200',
          updateSchema,
        ),
        this.loadCollection(
          'projects?sort[0]=featured:desc&sort[1]=updatedOn:desc&pagination[pageSize]=200',
          projectSchema,
        ),
        this.loadCollection(
          'events?sort[0]=startsAt:asc&pagination[pageSize]=200',
          eventSchema,
        ),
        this.loadCollection(
          'surveys?sort[0]=stage:asc&sort[1]=closesOn:desc&pagination[pageSize]=200',
          surveySchema,
        ),
        this.loadCollection(
          'resources?populate[details]=*&populate[collectionDates]=*&sort[0]=displayOrder:asc&sort[1]=title:asc&pagination[pageSize]=200',
          resourceSchema,
        ),
      ]);

    const siteSetting =
      singleEnvelopeSchema(siteSettingSchema).parse(siteSettingResponse).data ??
      undefined;

    return { siteSetting, updates, projects, events, surveys, resources };
  }
}
