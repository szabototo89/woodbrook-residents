import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { StudioSections } from './StudioSections';
import { getHomeContentAccessTokenInjector } from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveStudioSections(
  props: React.ComponentProps<typeof StudioSections> & {
    viewMode?: ServicesViewMode;
  },
) {
  const viewMode = useWixViewMode(props.viewMode);
  const homeContent = useHomeContent(viewMode);
  return <StudioSections {...props} homeContent={homeContent} />;
}

const StudioSectionsElement = reactToWebComponent(
  LiveStudioSections,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      giftCardUrl: 'string',
      phoneHref: 'string',
      phoneLabel: 'string',
      emailHref: 'string',
      emailLabel: 'string',
      studioImageUrl: 'string',
      studioImageAlt: 'string',
      policyUrl: 'string',
    },
  },
);

export default class AuthenticatedStudioSectionsElement extends StudioSectionsElement {
  accessTokenListener = getHomeContentAccessTokenInjector();
}
