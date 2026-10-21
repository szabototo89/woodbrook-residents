import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { AuthPage } from '../features/auth/AuthPage';

export const Route = createFileRoute('/register')({
  head: () =>
    createPageHead({
      title: 'Create an account',
      description: 'Manage your Woodbrook account.',
      path: '/register',
      robots: 'noindex',
    }),
  component: () => <AuthPage page="register" />,
});
