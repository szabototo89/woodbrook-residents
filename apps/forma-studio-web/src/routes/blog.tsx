import { createFileRoute } from '@tanstack/react-router';
import { BlogPage } from '../features/blog/BlogPage';
import { content } from '../features/content/content';
import { pageHead } from '../features/content/pageHead';

export const Route = createFileRoute('/blog')({
  head: () => pageHead(content.journal.seo),
  component: BlogPage,
});
