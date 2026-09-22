import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { CategoryGrid } from './CategoryGrid';
import { CATEGORY_CARDS } from '../../treatments/treatments';

function CategoryGridWidget(props: {
  viewAllLabel?: string;
  viewAllHref?: string;
}) {
  return (
    <CategoryGrid
      cards={CATEGORY_CARDS}
      viewAllLabel={props.viewAllLabel}
      viewAllHref={props.viewAllHref}
    />
  );
}

const JrCategoryGridElement = reactToWebComponent(
  CategoryGridWidget,
  React,
  ReactDOM,
  {
    props: {
      viewAllLabel: 'string',
      viewAllHref: 'string',
    },
  },
);

export default JrCategoryGridElement;
