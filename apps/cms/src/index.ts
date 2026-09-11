import type { Core } from '@strapi/strapi';

import {
  events,
  projects,
  resources,
  siteSetting,
  surveys,
  updates,
} from './seed/content';

async function upsertSeedDocument(
  strapi: Core.Strapi,
  uid:
    | 'api::event.event'
    | 'api::project.project'
    | 'api::resource.resource'
    | 'api::survey.survey'
    | 'api::update.update',
  uniqueField: string,
  uniqueValue: string,
  data: Record<string, unknown>,
) {
  const existing = await strapi.documents(uid).findFirst({
    filters: { [uniqueField]: uniqueValue },
  });

  const payload = JSON.parse(JSON.stringify(data));
  if (existing) {
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      data: payload,
      status: 'published',
    });
    return;
  }

  await strapi.documents(uid).create({
    data: payload,
    status: 'published',
  });
}

async function seedEditorialContent(strapi: Core.Strapi) {
  const existingSettings = await strapi
    .documents('api::site-setting.site-setting')
    .findFirst();

  if (existingSettings) {
    await strapi.documents('api::site-setting.site-setting').update({
      documentId: existingSettings.documentId,
      data: siteSetting,
      status: 'published',
    });
  } else {
    await strapi.documents('api::site-setting.site-setting').create({
      data: siteSetting,
      status: 'published',
    });
  }

  type SeedJob = {
    uid:
      | 'api::event.event'
      | 'api::project.project'
      | 'api::resource.resource'
      | 'api::survey.survey'
      | 'api::update.update';
    uniqueField: string;
    uniqueValue: string;
    data: Record<string, unknown>;
  };
  const seedJobs: SeedJob[] = [
    ...updates.map((update) => ({
      uid: 'api::update.update' as const,
      uniqueField: 'slug',
      uniqueValue: update.slug,
      data: update,
    })),
    ...projects.map((project) => ({
      uid: 'api::project.project' as const,
      uniqueField: 'slug',
      uniqueValue: project.slug,
      data: project,
    })),
    ...events.map((event) => ({
      uid: 'api::event.event' as const,
      uniqueField: 'slug',
      uniqueValue: event.slug,
      data: event,
    })),
    ...surveys.map((survey) => ({
      uid: 'api::survey.survey' as const,
      uniqueField: 'slug',
      uniqueValue: survey.slug,
      data: survey,
    })),
    ...resources.map((resource) => ({
      uid: 'api::resource.resource' as const,
      uniqueField: 'title',
      uniqueValue: resource.title,
      data: resource,
    })),
  ];

  await seedJobs.reduce(async (previous, job) => {
    await previous;
    await upsertSeedDocument(
      strapi,
      job.uid,
      job.uniqueField,
      job.uniqueValue,
      job.data,
    );
  }, Promise.resolve());
}

const publicReadActions = [
  'api::site-setting.site-setting.find',
  'api::update.update.find',
  'api::update.update.findOne',
  'api::project.project.find',
  'api::project.project.findOne',
  'api::event.event.find',
  'api::event.event.findOne',
  'api::survey.survey.find',
  'api::survey.survey.findOne',
  'api::resource.resource.find',
  'api::resource.resource.findOne',
  'api::issue-report.issue-report.create',
];

async function enablePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    return;
  }

  await publicReadActions.reduce(async (previous, action) => {
    await previous;
    const permissionQuery = strapi.db.query(
      'plugin::users-permissions.permission',
    );
    const existing = await permissionQuery.findOne({
      where: { action, role: publicRole.id },
    });

    if (!existing) {
      await permissionQuery.create({
        data: { action, enabled: true, role: publicRole.id },
      });
      return;
    }

    if (!existing.enabled) {
      await permissionQuery.update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }, Promise.resolve());
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedEditorialContent(strapi);
    await enablePublicPermissions(strapi);
  },
};
