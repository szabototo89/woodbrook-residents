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

  if (existing) {
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      data: data as never,
      status: 'published',
    });
    return;
  }

  await strapi.documents(uid).create({
    data: data as never,
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

  for (const update of updates) {
    await upsertSeedDocument(
      strapi,
      'api::update.update',
      'slug',
      update.slug,
      update,
    );
  }

  for (const project of projects) {
    await upsertSeedDocument(
      strapi,
      'api::project.project',
      'slug',
      project.slug,
      project,
    );
  }

  for (const event of events) {
    await upsertSeedDocument(
      strapi,
      'api::event.event',
      'slug',
      event.slug,
      event,
    );
  }

  for (const survey of surveys) {
    await upsertSeedDocument(
      strapi,
      'api::survey.survey',
      'slug',
      survey.slug,
      survey,
    );
  }

  for (const resource of resources) {
    await upsertSeedDocument(
      strapi,
      'api::resource.resource',
      'title',
      resource.title,
      resource,
    );
  }
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

  for (const action of publicReadActions) {
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
      continue;
    }

    if (!existing.enabled) {
      await permissionQuery.update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }
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
