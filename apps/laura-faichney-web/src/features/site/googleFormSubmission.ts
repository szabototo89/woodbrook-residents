export const googleFormSubmissionUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdzi1qQfNPhVfYByQIrMl4_bv_nogGTDtO_9iYfjfFo7kRtyg/formResponse?hl=en';

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export function googleFormFields(enquiry: Enquiry): Record<string, string> {
  return {
    'entry.1440085785': enquiry.name.trim(),
    'entry.2023704522': enquiry.email.trim(),
    'entry.1459025164': enquiry.phone.trim(),
    'entry.829351925': enquiry.service,
    'entry.992508615': enquiry.message.trim(),
  };
}
