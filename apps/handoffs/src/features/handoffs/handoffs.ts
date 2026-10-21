import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';

type HandoffModule = {
  metadata: { title: string; summary: string };
  default: ComponentType<{ components?: MDXComponents }>;
};

const documents = import.meta.glob<HandoffModule>(
  '../../../../../docs/handoffs/*.mdx',
  { eager: true },
);

export const handoffs = Object.keys(documents)
  .sort()
  .map((path) => ({
    slug: path.slice(path.lastIndexOf('/') + 1, -4),
    ...documents[path]!.metadata,
    Content: documents[path]!.default,
  }));

export function getHandoff(slug: string) {
  return handoffs.find((handoff) => handoff.slug === slug);
}
