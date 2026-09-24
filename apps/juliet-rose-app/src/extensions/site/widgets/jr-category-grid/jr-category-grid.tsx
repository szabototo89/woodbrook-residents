import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { CategoryGrid } from './CategoryGrid';
import { CATEGORY_CARDS } from '../../treatments/treatments';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
} from '../../homeContent/homeContent';
import { getHomeContentAccessTokenInjector } from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveCategoryGrid(props: {
  viewMode?: ServicesViewMode;
  eyebrow?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
}) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useHomeContent(viewMode);
  return (
    <CategoryGrid
      cards={CATEGORY_CARDS}
      eyebrow={mergeText(
        props.eyebrow,
        content?.categoriesEyebrow,
        HOME_CONTENT_DEFAULTS.categoriesEyebrow,
      )}
      title={mergeText(
        props.title,
        content?.categoriesTitle,
        HOME_CONTENT_DEFAULTS.categoriesTitle,
      )}
      viewAllLabel={mergeText(
        props.viewAllLabel,
        content?.categoriesViewAllLabel,
        HOME_CONTENT_DEFAULTS.categoriesViewAllLabel,
      )}
      viewAllHref={props.viewAllHref}
    />
  );
}

const JrCategoryGridElement = reactToWebComponent(
  LiveCategoryGrid,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      eyebrow: 'string',
      title: 'string',
      viewAllLabel: 'string',
      viewAllHref: 'string',
    },
  },
);

export default class AuthenticatedCategoryGridElement extends JrCategoryGridElement {
  accessTokenListener = getHomeContentAccessTokenInjector();
}
