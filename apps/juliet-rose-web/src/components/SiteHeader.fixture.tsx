import { SiteHeader } from './SiteHeader';

export default {
  Default: <SiteHeader />,
  ActiveTreatmentsNavigation: <SiteHeader activeNavigationItem="/treatments" />,
  ActiveGiftCardsNavigation: <SiteHeader activeNavigationItem="/gift-cards" />,
};
