import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { AuthPage } from '../features/auth/AuthPage';

export const Route = createFileRoute('/forgot-password')({
  head: () =>
    createPageHead({
      title: 'Reset your password',
      description: 'Manage your Woodbrook account.',
      path: '/forgot-password',
      robots: 'noindex',
    }),
  component: () => <AuthPage page="forgot-password" />,
});
