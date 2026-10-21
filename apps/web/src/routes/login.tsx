import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { AuthPage } from '../features/auth/AuthPage';

export const Route = createFileRoute('/login')({
  head: () =>
    createPageHead({
      title: 'Log in',
      description: 'Manage your Woodbrook account.',
      path: '/login',
      robots: 'noindex',
    }),
  component: () => <AuthPage page="login" />,
});
