import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../features/home/HomePage';
import { content } from '../features/content/content';
import { pageHead } from '../features/content/pageHead';

export const Route = createFileRoute('/')({
  head: () => pageHead(content.home.seo),
  component: HomePage,
});
