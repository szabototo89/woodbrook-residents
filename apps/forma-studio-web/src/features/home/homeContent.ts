import {
  CalendarDays,
  Laptop,
  MessageCircle,
  NotebookPen,
  Search,
} from 'lucide-react';

// Reference copy, kept independent of presentation for a future build-time CMS snapshot.
export const services = [
  {
    title: 'Website Design',
    icon: Laptop,
    description:
      'A clear, mobile-friendly home for your business, with an easy path from browsing to getting in touch.',
    includes: [
      'Responsive page layouts',
      'Service and contact pages',
      'A clear enquiry journey',
    ],
  },
  {
    title: 'Local SEO',
    icon: Search,
    description:
      'Help nearby customers understand what you offer and where you work when they search online.',
    includes: [
      'Page titles and descriptions',
      'Local service and location copy',
      'Search-friendly page structure',
    ],
  },
  {
    title: 'Booking & Enquiries',
    icon: CalendarDays,
    description:
      'Give visitors a simple way to ask a question or take the next step with your business.',
    includes: [
      'Enquiry forms or booking links',
      'Clear calls to action',
      'A mobile-friendly contact journey',
    ],
  },
  {
    title: 'Content Updates',
    icon: NotebookPen,
    description:
      'Keep your services, photos and business details current without starting from scratch.',
    includes: [
      'Copy and image changes',
      'Service and business detail updates',
      'Help with routine content edits',
    ],
  },
  {
    title: 'Ongoing Support',
    icon: MessageCircle,
    description:
      'Get help with your website after launch, with the scope and cost agreed around your needs.',
    includes: [
      'Website troubleshooting',
      'Advice on improvements',
      'An agreed support plan',
    ],
  },
];
export const packages = [
  {
    title: 'Essentials',
    description: 'A great start for new businesses.',
    price: '£995',
    popular: false,
    features: [
      'Beautiful 3–5 page website',
      'Mobile-friendly design',
      'Basic SEO setup',
    ],
  },
  {
    title: 'Growth',
    description: 'Everything you need to get found and grow.',
    price: '£1,495',
    popular: true,
    features: [
      'Larger website (up to 10 pages)',
      'Local SEO optimisation',
      'Booking or enquiry system',
      'Content training & support',
    ],
  },
  {
    title: 'Complete',
    description: 'A full solution with ongoing support.',
    price: '£1,995',
    popular: false,
    features: [
      'Custom website design',
      'Advanced local SEO',
      'Booking & enquiry tools',
      'Ongoing updates and support',
    ],
  },
];
export const steps = [
  {
    title: 'Plan your website',
    description:
      'Tell us about your business, audience and goals. Together we agree the pages, scope, quote and timeline.',
  },
  {
    title: 'Design, build & review',
    description:
      'We shape the design around your content. You review it and share feedback before we prepare it for launch.',
  },
  {
    title: 'Launch & hand over',
    description:
      'We check the website on mobile and desktop, publish it and explain how to keep it current. Support is agreed separately.',
  },
];
export const faqs = [
  {
    question: 'How long does a website take?',
    answer:
      'Most small websites take around 3–6 weeks once your content is ready. We agree a timeline together before the project begins.',
  },
  {
    question: 'Can you help with my existing website?',
    answer:
      'We can review your current website and talk through improvements to its design, content and how customers find you.',
  },
  {
    question: 'Do you offer ongoing support?',
    answer:
      'Choose the support that suits your business, from occasional content updates to an ongoing plan. We agree the scope and cost with you first.',
  },
];

export const enquiryEmail = 'szabototo89@gmail.com';
export const enquiryHref = `mailto:${enquiryEmail}?subject=${encodeURIComponent('Website project enquiry')}&body=${encodeURIComponent('Business name: \nCurrent website (if any): \nWhat you need: \nIdeal timing: ')}`;
