import type { CmsSettings } from './lauraSanity';

type Enquiry = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export function enquiryMailto(
  settings: Pick<CmsSettings, 'email' | 'mailtoSubject'>,
  enquiry: Enquiry,
): string {
  const body = [
    `Name: ${enquiry.name.trim()}`,
    `Email: ${enquiry.email.trim()}`,
    ...(enquiry.phone.trim() ? [`Phone: ${enquiry.phone.trim()}`] : []),
    `Service: ${enquiry.service}`,
    '',
    enquiry.message.trim(),
  ].join('\n');
  return `mailto:${settings.email}?subject=${encodeURIComponent(`${settings.mailtoSubject} — ${enquiry.service}`)}&body=${encodeURIComponent(body)}`;
}
