import { z } from 'zod';

// Required copy must contain visible characters. Never coerce missing values or supply fallback copy.
const text = z.string().trim().min(1);
const texts = z.array(text).min(1);
const publicId = text.refine(
  (id) => !id.startsWith('drafts.') && !id.startsWith('versions.'),
  'Must be a published document',
);
const httpUrl = z
  .url()
  .refine((url) => new URL(url).protocol === 'https:', 'Use an HTTPS URL');

export const sourceSchema = z.object({
  title: text.describe(
    'Human-readable name of the source linked below a guide or recorded for selected work.',
  ),
  url: httpUrl.describe(
    'HTTPS source page that supports this content; preserved during migration.',
  ),
  accessed: z.iso
    .date()
    .describe(
      'Calendar date (YYYY-MM-DD) when the source was checked; preserve the actual check date.',
    ),
});

export const imageSchema = z.object({
  alt: text.describe(
    'Non-empty description of this image for people using screen readers.',
  ),
  asset: z
    .object({
      _id: publicId.describe(
        'Published Sanity asset ID obtained by dereferencing image.asset; an unresolved asset is rejected.',
      ),
      url: httpUrl
        .refine(
          (url) => url.startsWith('https://cdn.sanity.io/images/'),
          'Use a Sanity image asset',
        )
        .describe(
          'HTTPS Sanity CDN image URL obtained from the asset document, never an arbitrary script or local file path.',
        ),
      width: z
        .number()
        .int()
        .positive()
        .describe(
          'Original image width in pixels; must be a positive integer to reserve layout space.',
        ),
      height: z
        .number()
        .int()
        .positive()
        .describe(
          'Original image height in pixels; must be a positive integer to reserve layout space.',
        ),
    })
    .describe(
      'Resolved Sanity image asset, including its public URL and original pixel dimensions; a missing reference fails the build.',
    ),
});

export const seoSchema = z.object({
  title: text.describe(
    'Full page title used in the browser tab, search results and Open Graph title.',
  ),
  description: text.describe(
    'Page summary emitted as the HTML description metadata during prerendering.',
  ),
  socialDescription: text.describe(
    'Page summary emitted as the Open Graph description for shared links.',
  ),
});

export const serviceSchema = z.object({
  _key: text.describe(
    'Stable Sanity array-item key; React uses it to preserve this service card when editors reorder cards.',
  ),
  title: text.describe('Service name displayed as a homepage card heading.'),
  icon: z
    .enum(['website', 'search', 'booking', 'content', 'support'])
    .describe(
      'Supported service category mapped to a Lucide icon in serviceIcons.ts; CMS data never contains React components.',
    ),
  description: text.describe(
    'Short explanation of this service displayed before its expandable details.',
  ),
  includes: texts.describe(
    'Non-empty list of deliverables revealed by the service card disclosure.',
  ),
});

export const packageSchema = z.object({
  _key: text.describe('Stable Sanity array-item key for this package card.'),
  title: text.describe(
    'Package name shown in its heading and the link to discuss that package.',
  ),
  description: text.describe('Short explanation of who this package suits.'),
  price: text.describe(
    'Display price including its currency symbol, such as £995; this is copy, not a payment amount.',
  ),
  popular: z
    .boolean()
    .describe(
      'Whether this package receives the highlighted card styling and the homepage package badge.',
    ),
  features: texts.describe(
    'Non-empty list of included features shown with check marks in the package card.',
  ),
});

export const stepSchema = z.object({
  _key: text.describe('Stable Sanity array-item key for this process step.'),
  title: text.describe(
    'Process-step heading; its displayed step number comes from the array order.',
  ),
  description: text.describe(
    'Explanation of what happens at this stage of a website project.',
  ),
});

export const faqSchema = z.object({
  _key: text.describe(
    'Stable Sanity array-item key for this frequently asked question.',
  ),
  question: text.describe(
    'Question displayed on the accessible button that expands the answer.',
  ),
  answer: text.describe(
    'Answer revealed when a visitor expands this question.',
  ),
});

export const contactSchema = z.object({
  eyebrow: text.describe('Short introduction above a contact section heading.'),
  title: text.describe(
    'Heading inviting the visitor to discuss a website project.',
  ),
  description: text.describe(
    'Supporting copy explaining the next step; this feature keeps the existing email enquiry flow.',
  ),
  action: text.describe(
    'Visible label on the contact action; the destination is fixed by the page, not arbitrary CMS HTML.',
  ),
});

export const workSchema = z.object({
  _id: publicId.describe(
    'ID of the resolved, published selectedWork document; drafts and release versions are rejected.',
  ),
  eyebrow: text.describe(
    'Project category shown above the selected-work title, such as Artist website.',
  ),
  title: text.describe('Project name displayed in the selected-work card.'),
  previewLabel: text.describe(
    'Accessible name for the linked project screenshot, describing where the preview link leads.',
  ),
  windowTitle: text.describe(
    'Short project name in the decorative browser bar above its screenshot.',
  ),
  description: text.describe(
    'Factual project summary displayed beside the visit link.',
  ),
  url: httpUrl.describe(
    'HTTPS address opened by both the screenshot link and the visit action.',
  ),
  action: text.describe(
    'Visible label for the link to the live project website.',
  ),
  image: imageSchema.describe(
    'Required project screenshot with alt text and a resolved Sanity image asset.',
  ),
  source: sourceSchema.describe(
    'Source URL and check date retained with the factual project record; not displayed in the card.',
  ),
});

export const guideSchema = z.object({
  _id: publicId.describe(
    'ID of the resolved, published journalGuide document; never a drafts.* or versions.* record.',
  ),
  id: text
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .describe(
      'Unique lowercase, hyphen-separated HTML anchor for this guide on /blog; distinct from the Sanity document ID.',
    ),
  editorialStatus: z
    .enum(['needs-review', 'approved'])
    .describe(
      'Internal review marker retained from existing editorial copy; only Sanity publication controls public visibility.',
    ),
  category: text.describe(
    'Short category label shown above the guide heading.',
  ),
  title: text.describe('Guide heading displayed in the journal card.'),
  excerpt: text.describe(
    'Short introduction visible before the visitor expands the guide.',
  ),
  action: text.describe(
    'Label on the native disclosure control that expands this guide in place.',
  ),
  paragraphs: texts.describe(
    'Non-empty list of plain-text paragraphs revealed by the disclosure; HTML is not accepted.',
  ),
  source: sourceSchema.describe(
    'Required further-reading link and actual source check date shown below the guide body.',
  ),
  image: imageSchema
    .nullish()
    .transform((value) => value ?? undefined)
    .describe(
      'Optional guide image; absent/null means show the application icon, while a supplied image must be complete.',
    ),
});

export const settingsSchema = z.object({
  _id: z
    .literal('siteSettings')
    .describe(
      'Fixed siteSettings singleton ID; required so a different document cannot stand in for shared settings.',
    ),
  brand: text.describe(
    'Studio name used in the accessible homepage link in the shared header.',
  ),
  logo: imageSchema.describe(
    'Header logo with accessible alt text and the original dimensions used to reserve its layout space.',
  ),
  enquiryEmail: z
    .email()
    .describe(
      'Validated recipient email address used by both homepage mailto links.',
    ),
  enquirySubject: text.describe(
    'Subject prefilled in the visitor’s email app; URL encoding happens in content.ts.',
  ),
  enquiryBody: text.describe(
    'Plain-text project prompts prefilled in the visitor’s email app; line breaks are preserved.',
  ),
  footerServices: text.describe(
    'Short service summary shown on the homepage footer.',
  ),
  talkLabel: text.describe(
    'Visible label on the header action linking to the homepage contact section.',
  ),
  navigation: z
    .array(
      z.object({
        _key: text.describe(
          'Stable Sanity array-item key for this navigation link.',
        ),
        name: text.describe(
          'Visible header link text shown on desktop and in the mobile menu.',
        ),
        href: z
          .enum(['#services', '#work', '#about', '/blog', '#contact'])
          .describe(
            'Existing site section or journal route; blog pages prefix section links with /.',
          ),
      }),
    )
    .min(1)
    .describe(
      'Ordered header links restricted to existing sections and /blog so editors cannot introduce unsupported routes.',
    ),
});

export const heroSchema = z.object({
  eyebrow: text.describe(
    'Short service introduction above the homepage’s main heading.',
  ),
  title: texts.describe(
    'Ordered non-empty heading lines; the component supplies responsive line breaks.',
  ),
  description: text.describe(
    'Homepage introduction explaining Forma Studio’s offer.',
  ),
  action: text.describe(
    'Primary homepage action label; its link goes to #contact.',
  ),
  workAction: text.describe(
    'Secondary homepage action label; its link goes to #work.',
  ),
  image: imageSchema.describe(
    'Required homepage hero image with alt text and a resolved Sanity asset; responsive URLs are generated in image.ts.',
  ),
  note: text.describe(
    'Short annotation displayed over the homepage hero image.',
  ),
  caption: text.describe(
    'Visible image credit or illustration disclosure below the hero; retain truthful attribution.',
  ),
});

export const preparationSchema = z.object({
  eyebrow: text.describe(
    'Short introduction above the first-conversation preparation card.',
  ),
  title: text.describe(
    'Heading explaining what a prospective customer can prepare.',
  ),
  description: text.describe(
    'Supporting copy explaining how to prepare for the first conversation.',
  ),
  items: texts.describe(
    'Non-empty list of details the customer can bring, displayed as bullet points.',
  ),
  action: text.describe('Label on the preparation card link to #contact.'),
});

export const homeSchema = z.object({
  servicesTitle: text.describe('Heading for the homepage services section.'),
  servicesDescription: text.describe(
    'Supporting line beside the services heading.',
  ),
  includesLabel: text.describe(
    'Shared label on each service card’s expandable deliverables list.',
  ),
  workEyebrow: text.describe(
    'Short introduction above the selected-work section heading.',
  ),
  workTitle: text.describe(
    'Heading that labels the selected-work region for all visitors and screen readers.',
  ),
  workDescription: text.describe(
    'Supporting line beside the selected-work heading.',
  ),
  packagesEyebrow: text.describe(
    'Short introduction above the package comparison section.',
  ),
  packagesDescription: text.describe(
    'Visible pricing qualification explaining scope, hosting and ongoing costs.',
  ),
  popularLabel: text.describe(
    'Badge text shown on packages whose popular flag is true.',
  ),
  pricePrefix: text.describe(
    'Text preceding every display price, such as From.',
  ),
  packageAction: text.describe(
    'Text preceding the package name in each contact link, such as Discuss.',
  ),
  processEyebrow: text.describe(
    'Short introduction above the ordered project process.',
  ),
  processTitle: text.describe('Heading for the project process section.'),
  processDescription: text.describe(
    'Supporting line beside the project process heading.',
  ),
  faqTitle: text.describe(
    'Heading for the expandable frequently asked questions.',
  ),
  _id: z
    .literal('homePage')
    .describe(
      'Fixed homePage singleton ID for the required homepage document.',
    ),
  seo: seoSchema.describe(
    'Required homepage metadata; routes/index.tsx passes it to pageHead.ts.',
  ),
  hero: heroSchema.describe(
    'Required introductory copy, image and attribution shown at the top of /.',
  ),
  services: z
    .array(serviceSchema)
    .min(1)
    .describe(
      'Non-empty ordered service cards, embedded here because they publish with the homepage.',
    ),
  packages: z
    .array(packageSchema)
    .min(1)
    .describe(
      'Non-empty ordered package cards, embedded here with their display prices and qualifications.',
    ),
  steps: z
    .array(stepSchema)
    .min(1)
    .describe(
      'Non-empty ordered process steps; the application numbers them from one.',
    ),
  faqs: z
    .array(faqSchema)
    .min(1)
    .describe(
      'Non-empty ordered questions and answers controlled by the accessible Faq component.',
    ),
  selectedWork: z
    .array(workSchema)
    .min(1)
    .describe(
      'Non-empty list of resolved, published selectedWork references; null or broken references stop the build.',
    ),
  packagesTitle: texts.describe(
    'Ordered package-heading lines; line breaks belong to the application layout.',
  ),
  preparation: preparationSchema.describe(
    'Required first-conversation preparation copy, list and contact link label.',
  ),
  contact: contactSchema
    .extend({
      note: text.describe(
        'Visible note explaining that the enquiry action opens the visitor’s email app.',
      ),
    })
    .describe(
      'Required homepage contact copy and email-app disclosure; the recipient comes from shared settings.',
    ),
});

export const journalSchema = z.object({
  _id: z
    .literal('journalPage')
    .describe(
      'Fixed journalPage singleton ID for the required /blog page document.',
    ),
  seo: seoSchema.describe(
    'Required journal metadata; routes/blog.tsx passes it to pageHead.ts.',
  ),
  eyebrow: text.describe(
    'Short introduction above the journal page’s main heading.',
  ),
  title: texts.describe(
    'Ordered journal-heading lines; the component supplies line breaks.',
  ),
  description: text.describe(
    'Journal introduction displayed above the guide cards.',
  ),
  backLabel: text.describe('Label on the journal introduction link back to /.'),
  guidesLabel: text.describe(
    'Accessible name for the region containing journal guides.',
  ),
  sourceLabel: text.describe(
    'Text introducing each guide’s further-reading link.',
  ),
  sourceDateLabel: text.describe(
    'Text preceding each source check date, such as Source checked.',
  ),
  homeLabel: text.describe('Label on the journal footer link back to /.'),
  contact: contactSchema.describe(
    'Required journal contact card copy; its action links to /#contact.',
  ),
  guides: z
    .array(guideSchema)
    .min(1)
    .refine(
      (guides) =>
        new Set(guides.map((guide) => guide.id)).size === guides.length,
      'Guide anchors must be unique',
    )
    .describe(
      'Non-empty ordered list of resolved, published journalGuide references with unique HTML anchors; broken references stop the build.',
    ),
});

export const formaContentSchema = z.object({
  settings: settingsSchema.describe(
    'Required published siteSettings singleton shared by the header, footer and email enquiry links.',
  ),
  home: homeSchema.describe(
    'Required published homePage singleton with all selected-work references resolved.',
  ),
  journal: journalSchema.describe(
    'Required published journalPage singleton with all journal-guide references resolved.',
  ),
});

export type FormaContent = z.infer<typeof formaContentSchema>;
export type ContentImage = z.infer<typeof imageSchema>;

export function parseFormaContent(input: unknown): FormaContent {
  const result = formaContentSchema.safeParse(input);
  if (!result.success) {
    const diagnostics = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(
      `Forma content validation failed. Check published siteSettings, homePage, journalPage and their referenced documents: ${diagnostics}`,
    );
  }
  return result.data;
}
