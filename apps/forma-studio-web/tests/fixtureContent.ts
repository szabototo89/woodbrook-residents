import legacy from '../migration/legacy-content.json';
const content: unknown = JSON.parse(
  JSON.stringify(legacy).replaceAll(
    '/images/',
    'https://cdn.sanity.io/images/ms27me7o/production/',
  ),
);

export default content;
