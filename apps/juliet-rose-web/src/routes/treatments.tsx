import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../app/siteMetadata';
import { TreatmentListPage } from '../features/treatments/TreatmentListPage';

const description =
  'Browse Juliet Rose massage, facial, beauty and treatment package prices in Stillorgan, Dublin.';

export const Route = createFileRoute('/treatments')({
  head: () =>
    createPageHead({ title: 'Treatments', description, path: '/treatments' }),
  component: TreatmentListPage,
});
