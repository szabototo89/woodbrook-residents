// Help shown beside every Studio field. Keep this language useful to editors who do not write code.
export const editorialHelp: Record<
  string,
  Record<string, { title: string; description: string }>
> = {
  contentSource: {
    title: {
      title: 'Title',
      description:
        'Name of the website or guidance used to check this content.',
    },
    url: {
      title: 'Website address',
      description:
        'Full web address of the source. Start with https:// and keep the link that supports the content.',
    },
    accessed: {
      title: 'Date checked',
      description:
        'Date you actually checked this source. Keep the original date unless you check the source again.',
    },
  },
  contentImage: {
    alt: {
      title: 'Image description',
      description:
        'Describe what the image shows for people who cannot see it. Mention useful details rather than writing “image of”.',
    },
  },
  pageMetadata: {
    title: {
      title: 'Title',
      description:
        'Page title shown in the browser tab and when the page appears in search results or shared links.',
    },
    description: {
      title: 'Description',
      description:
        'Short summary of this page for search engines. Write a clear sentence about what visitors will find.',
    },
    socialDescription: {
      title: 'Shared-link summary',
      description:
        'Short summary shown when someone shares a link to this page.',
    },
  },
  service: {
    title: {
      title: 'Title',
      description: 'Service name displayed as a homepage card heading.',
    },
    icon: {
      title: 'Icon',
      description:
        'Choose the symbol that best matches the service. The website supplies the matching icon automatically.',
    },
    description: {
      title: 'Description',
      description:
        'Short explanation of this service displayed before its expandable details.',
    },
    includes: {
      title: 'Includes',
      description:
        'Add the things included in this service. Visitors see this list when they open the service details.',
    },
  },
  package: {
    title: {
      title: 'Title',
      description:
        'Package name shown in its heading and the link to discuss that package.',
    },
    description: {
      title: 'Description',
      description: 'Short explanation of who this package suits.',
    },
    price: {
      title: 'Price',
      description:
        'Starting price shown to visitors, including the currency symbol, such as £995. This does not take a payment.',
    },
    popular: {
      title: 'Highlight this package',
      description:
        'Switch this on to draw attention to this package and show the package badge above it.',
    },
    features: {
      title: 'Features',
      description:
        'Add each included feature as a separate item. The website shows them with check marks.',
    },
  },
  processStep: {
    title: {
      title: 'Title',
      description:
        'Name of this stage of the project. Its step number is set automatically by its position in the list.',
    },
    description: {
      title: 'Description',
      description:
        'Explanation of what happens at this stage of a website project.',
    },
  },
  faq: {
    question: {
      title: 'Question',
      description:
        'Question visitors select to show its answer. Write it as a customer would ask it.',
    },
    answer: {
      title: 'Answer',
      description: 'Answer revealed when a visitor expands this question.',
    },
  },
  contact: {
    eyebrow: {
      title: 'Intro label',
      description: 'Short introduction above a contact section heading.',
    },
    title: {
      title: 'Title',
      description: 'Heading inviting the visitor to discuss a website project.',
    },
    description: {
      title: 'Description',
      description:
        'Explain how to get in touch and what will happen after a customer contacts you.',
    },
    action: {
      title: 'Action',
      description:
        'Text on the contact button. On the homepage it opens an email; on the journal page it leads to the homepage contact section.',
    },
  },
  selectedWork: {
    eyebrow: {
      title: 'Intro label',
      description:
        'Project category shown above the selected-work title, such as Artist website.',
    },
    title: {
      title: 'Title',
      description: 'Project name displayed in the selected-work card.',
    },
    previewLabel: {
      title: 'Screenshot link description',
      description:
        'Describe the link for people using a screen reader, for example “Preview Laura Faichney’s live website”.',
    },
    windowTitle: {
      title: 'Preview bar title',
      description:
        'Short project name shown in the small browser-style bar above the screenshot.',
    },
    description: {
      title: 'Description',
      description: 'Factual project summary displayed beside the visit link.',
    },
    url: {
      title: 'Website address',
      description:
        'Full address of the live project website. Both the screenshot and the visit link open this address.',
    },
    action: {
      title: 'Action',
      description: 'Visible label for the link to the live project website.',
    },
    image: {
      title: 'Image',
      description:
        'Upload or choose the project screenshot, then add a useful image description.',
    },
    source: {
      title: 'Source and date checked',
      description:
        'Record where the project details came from and when you checked them. This source record is not shown on the project card.',
    },
    legacyId: {
      title: 'Import reference',
      description:
        'Original import reference. This is kept for maintenance and cannot be edited.',
    },
  },
  journalGuide: {
    id: {
      title: 'Guide link name',
      description:
        'Unique link name for this guide, such as local-search. Use lowercase words separated by hyphens; do not use spaces.',
    },
    editorialStatus: {
      title: 'Copy review',
      description:
        'Record whether this guide still needs a copy review. This marker does not publish or hide the guide; use Publish to make it available.',
    },
    category: {
      title: 'Category',
      description: 'Short category label shown above the guide heading.',
    },
    title: {
      title: 'Title',
      description: 'Guide heading displayed in the journal card.',
    },
    excerpt: {
      title: 'Excerpt',
      description:
        'Short introduction visible before the visitor expands the guide.',
    },
    action: {
      title: 'Action',
      description:
        'Text visitors select to open and read the full guide without leaving the page.',
    },
    paragraphs: {
      title: 'Paragraphs',
      description:
        'Add the guide’s paragraphs in reading order. Visitors see these when they open the guide. Enter ordinary text rather than web formatting code.',
    },
    source: {
      title: 'Source and date checked',
      description:
        'Add the further-reading website and the date you checked it. Both are shown below the guide.',
    },
    image: {
      title: 'Image',
      description:
        'Optional image above this guide. Leave it empty to use a simple website icon. Add an image description when choosing an image.',
    },
    legacyId: {
      title: 'Import reference',
      description:
        'Original import reference. This is kept for maintenance and cannot be edited.',
    },
  },
  siteSettings: {
    brand: {
      title: 'Brand',
      description:
        'Business name read out by screen readers on the header link back to the homepage.',
    },
    logo: {
      title: 'Logo',
      description:
        'Choose the logo shown at the top of both pages. Add an image description, usually the business name.',
    },
    enquiryEmail: {
      title: 'Enquiry email',
      description:
        'Email address that receives project enquiries. Both Email us links use this address.',
    },
    enquirySubject: {
      title: 'Enquiry subject',
      description:
        'Subject line filled in when a visitor opens an enquiry in their email app.',
    },
    enquiryBody: {
      title: 'Enquiry body',
      description:
        'Starting questions filled in for the visitor’s email. Put each prompt on a separate line.',
    },
    footerServices: {
      title: 'Footer services',
      description: 'Short service summary shown on the homepage footer.',
    },
    talkLabel: {
      title: 'Header button label',
      description:
        'Visible label on the header action linking to the homepage contact section.',
    },
    navigation: {
      title: 'Navigation',
      description:
        'Menu links in display order. Choose one of the existing website sections or the journal; new page addresses cannot be added here.',
    },
  },
  homeHero: {
    eyebrow: {
      title: 'Intro label',
      description:
        'Short service introduction above the homepage’s main heading.',
    },
    title: {
      title: 'Title',
      description:
        'Main homepage heading, entered in short lines. The website adapts the line breaks for phones.',
    },
    description: {
      title: 'Description',
      description: 'Homepage introduction explaining Forma Studio’s offer.',
    },
    action: {
      title: 'Action',
      description:
        'Label on the main homepage button. This button takes visitors to the contact section.',
    },
    workAction: {
      title: 'Work action',
      description:
        'Label on the second homepage link. This link takes visitors to the selected-work section.',
    },
    image: {
      title: 'Image',
      description:
        'Choose the large homepage image and add an image description. Use the caption below to explain any illustration or mockup.',
    },
    note: {
      title: 'Note',
      description: 'Short annotation displayed over the homepage hero image.',
    },
    caption: {
      title: 'Caption',
      description:
        'Visible credit below the image. Say when the picture is an illustration or mockup so visitors understand what they are seeing.',
    },
  },
  preparation: {
    eyebrow: {
      title: 'Intro label',
      description:
        'Short introduction above the first-conversation preparation card.',
    },
    title: {
      title: 'Title',
      description:
        'Heading explaining what a prospective customer can prepare.',
    },
    description: {
      title: 'Description',
      description:
        'Supporting copy explaining how to prepare for the first conversation.',
    },
    items: {
      title: 'Items',
      description:
        'Add useful details the customer can bring to the first conversation, one item per bullet point.',
    },
    action: {
      title: 'Action',
      description:
        'Label on the preparation card link. This takes visitors to the homepage contact section.',
    },
  },
  homePage: {
    servicesTitle: {
      title: 'Services title',
      description: 'Heading for the homepage services section.',
    },
    servicesDescription: {
      title: 'Services description',
      description: 'Supporting line beside the services heading.',
    },
    includesLabel: {
      title: 'Service details label',
      description:
        'Shared label on each service card’s expandable deliverables list.',
    },
    workEyebrow: {
      title: 'Work intro label',
      description:
        'Short introduction above the selected-work section heading.',
    },
    workTitle: {
      title: 'Work title',
      description:
        'Heading that labels the selected-work region for all visitors and screen readers.',
    },
    workDescription: {
      title: 'Work description',
      description: 'Supporting line beside the selected-work heading.',
    },
    packagesEyebrow: {
      title: 'Packages intro label',
      description: 'Short introduction above the package comparison section.',
    },
    packagesDescription: {
      title: 'Packages description',
      description:
        'Visible pricing qualification explaining scope, hosting and ongoing costs.',
    },
    popularLabel: {
      title: 'Popular label',
      description:
        'Short badge shown on any package where Highlight this package is switched on.',
    },
    pricePrefix: {
      title: 'Price prefix',
      description: 'Text preceding every display price, such as From.',
    },
    packageAction: {
      title: 'Package action',
      description:
        'Text preceding the package name in each contact link, such as Discuss.',
    },
    processEyebrow: {
      title: 'Process intro label',
      description: 'Short introduction above the ordered project process.',
    },
    processTitle: {
      title: 'Process heading',
      description:
        'Heading above the numbered steps showing how a website project runs.',
    },
    processDescription: {
      title: 'Process introduction',
      description:
        'Short introduction beside the process heading. Use this to explain the approach in one sentence.',
    },
    faqTitle: {
      title: 'Questions heading',
      description: 'Heading for the expandable frequently asked questions.',
    },
    seo: {
      title: 'Search and sharing',
      description:
        'Title and summaries used in browser tabs, search listings and shared links for the homepage.',
    },
    hero: {
      title: 'Homepage introduction',
      description:
        'Top section of the homepage: main heading, introduction, image and links to contact and selected work.',
    },
    services: {
      title: 'Services',
      description:
        'Service cards shown in this order on the homepage. Changes are published with this page.',
    },
    packages: {
      title: 'Packages',
      description:
        'Package cards shown in this order. Include the starting price and the features for each package.',
    },
    steps: {
      title: 'Project steps',
      description:
        'Add and arrange the stages of a website project. The website numbers them automatically in this order.',
    },
    faqs: {
      title: 'Frequently asked questions',
      description:
        'Questions visitors can open to read an answer. Add and arrange them in the order you want them shown.',
    },
    selectedWork: {
      title: 'Selected work',
      description:
        'Choose published projects to show on the homepage, in display order. Publish each linked project before rebuilding the website.',
    },
    packagesTitle: {
      title: 'Packages title',
      description:
        'Heading above the packages, entered in short lines. The website controls how those lines fit each screen.',
    },
    preparation: {
      title: 'Preparation',
      description:
        'Advice about what a customer can bring to the first conversation, followed by a link to the contact section.',
    },
    contact: {
      title: 'Contact',
      description:
        'Homepage contact message and button label. The enquiry address is set separately in Site settings.',
    },
  },
  journalPage: {
    seo: {
      title: 'Search and sharing',
      description:
        'Title and summaries used in browser tabs, search listings and shared links for the journal page.',
    },
    eyebrow: {
      title: 'Intro label',
      description: 'Short introduction above the journal page’s main heading.',
    },
    title: {
      title: 'Title',
      description:
        'Main journal heading, entered in short lines. The website controls the line breaks.',
    },
    description: {
      title: 'Description',
      description: 'Journal introduction displayed above the guide cards.',
    },
    backLabel: {
      title: 'Back label',
      description:
        'Text on the link above the journal introduction that returns visitors to the homepage.',
    },
    guidesLabel: {
      title: 'Guides label',
      description:
        'Name of the guides section read out to visitors using a screen reader.',
    },
    sourceLabel: {
      title: 'Source label',
      description: 'Text introducing each guide’s further-reading link.',
    },
    sourceDateLabel: {
      title: 'Source date label',
      description:
        'Text preceding each source check date, such as Source checked.',
    },
    homeLabel: {
      title: 'Home label',
      description:
        'Text on the journal footer link that returns visitors to the homepage.',
    },
    contact: {
      title: 'Contact',
      description:
        'Message and button shown below the guides. The button takes visitors to the homepage contact section.',
    },
    guides: {
      title: 'Guides',
      description:
        'Choose the guides to show and arrange their order. Publish every linked guide before rebuilding the website. Each guide needs a different link name.',
    },
  },
  homeContact: {
    eyebrow: {
      title: 'Intro label',
      description: 'Short introduction above a contact section heading.',
    },
    title: {
      title: 'Title',
      description: 'Heading inviting the visitor to discuss a website project.',
    },
    description: {
      title: 'Description',
      description:
        'Explain how to get in touch and what will happen after a customer contacts you.',
    },
    action: {
      title: 'Action',
      description:
        'Text on the contact button. On the homepage it opens an email; on the journal page it leads to the homepage contact section.',
    },
    note: {
      title: 'Note',
      description:
        'Short note beside the email link explaining that it opens the visitor’s email app and what to expect next.',
    },
  },
  navigationItem: {
    name: {
      title: 'Name',
      description:
        'Text visitors see on this menu link. Keep it short enough for the mobile menu.',
    },
    href: {
      title: 'Destination',
      description:
        'Choose the existing website section or journal page this menu link opens.',
    },
  },
};
