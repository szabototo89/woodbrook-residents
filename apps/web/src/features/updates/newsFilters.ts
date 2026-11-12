import { updateKinds } from '../content/contentTaxonomy';
import { compareContentDates } from '../content/contentDates';
import type { UpdateKind, UpdatesContent } from '../content/contentTypes';

export type NewsParams = {
  category: 'all' | UpdateKind;
  sort: 'newest' | 'oldest';
};

export function parseNewsParams(search: Record<string, unknown>): NewsParams {
  return {
    category: updateKinds.find((kind) => kind === search.category) ?? 'all',
    sort: search.sort === 'oldest' ? 'oldest' : 'newest',
  };
}

export function selectNews(content: UpdatesContent, params: NewsParams) {
  if (params.category === 'all' && params.sort === 'newest') {
    return { featuredUpdate: content.featuredUpdate, items: content.items };
  }

  const articles = content.featuredUpdate
    ? [content.featuredUpdate, ...content.items]
    : content.items;
  return {
    featuredUpdate: undefined,
    items: articles
      .filter(
        (article) =>
          params.category === 'all' || article.kind === params.category,
      )
      .sort((left, right) =>
        compareContentDates(left.publishedOn, right.publishedOn, params.sort),
      ),
  };
}
