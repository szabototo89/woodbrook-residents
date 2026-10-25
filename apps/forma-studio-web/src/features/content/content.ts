import snapshot from 'virtual:forma-content';
import { parseFormaContent } from './schema';
export const content = parseFormaContent(snapshot);
export function enquiryHref() {
  const settings = content.settings;
  return `mailto:${settings.enquiryEmail}?subject=${encodeURIComponent(settings.enquirySubject)}&body=${encodeURIComponent(settings.enquiryBody)}`;
}
