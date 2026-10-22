import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { AccountDetailsPage } from '../features/account/AccountDetailsPage';

export const Route = createFileRoute('/account')({
  head: () =>
    createPageHead({
      title: 'Account details',
      description: 'Manage your private Woodbrook account details.',
      path: '/account',
      robots: 'noindex',
    }),
  component: AccountDetailsPage,
});
