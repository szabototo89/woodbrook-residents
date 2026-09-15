export interface DesignProposalSite {
  key: string;
  projectName: string;
  directory: string;
  url: string;
}

export const DESIGN_PROPOSAL_SITES: DesignProposalSite[] = [
  {
    key: 'gallery',
    projectName: 'woodbrook-design-gallery',
    directory: 'apps/design-proposals',
    url: 'https://woodbrook-design-gallery.pages.dev/',
  },
  {
    key: 'the-dog-salon',
    projectName: 'woodbrook-dog-salon-concept',
    directory: 'apps/design-proposals/projects/the-dog-salon',
    url: 'https://woodbrook-dog-salon-concept.pages.dev/',
  },
  {
    key: 'spotless-dog-grooming',
    projectName: 'woodbrook-spotless-concept',
    directory: 'apps/design-proposals/projects/spotless-dog-grooming',
    url: 'https://woodbrook-spotless-concept.pages.dev/',
  },
  {
    key: 'spotless-dog-grooming-warm',
    projectName: 'woodbrook-spotless-warm-concept',
    directory: 'apps/design-proposals/projects/spotless-dog-grooming-warm',
    url: 'https://woodbrook-spotless-warm-concept.pages.dev/',
  },
];
