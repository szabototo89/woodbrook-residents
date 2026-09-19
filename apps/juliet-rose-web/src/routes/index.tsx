import { createFileRoute } from '@tanstack/react-router';

import { createPageHead, SITE_NAME } from '../app/siteMetadata';
import { JulietRoseHomePage } from '../features/home/JulietRoseHomePage';

const description =
  'Beauty treatments in Stillorgan, South Dublin, including facials, advanced skin treatments, massage, beauty essentials and treatment packages.';

export const Route = createFileRoute('/')({
  head: () => createPageHead({ title: SITE_NAME, description, path: '/' }),
  component: JulietRoseHomePage,
});
