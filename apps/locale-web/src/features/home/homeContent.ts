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
      'Modern, mobile-friendly websites that look great and convert visitors into customers.',
  },
  {
    title: 'Local SEO',
    icon: Search,
    description:
      'Get found on Google by local customers searching for your services.',
  },
  {
    title: 'Booking & Enquiries',
    icon: CalendarDays,
    description:
      'Simple booking systems and enquiry forms to make it easy for customers to get in touch.',
  },
  {
    title: 'Content Updates',
    icon: NotebookPen,
    description:
      'Keep your website fresh with easy updates whenever you need a helping hand.',
  },
  {
    title: 'Ongoing Support',
    icon: MessageCircle,
    description:
      'Friendly, reliable support to keep everything running smoothly as your business grows.',
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
    title: 'Chat about your goals',
    description: 'We learn about your business and what you need.',
  },
  {
    title: 'Design & build',
    description: 'We create a modern website and set up the essentials.',
  },
  {
    title: 'Grow together',
    description: 'Ongoing support, updates and advice when you need it.',
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
