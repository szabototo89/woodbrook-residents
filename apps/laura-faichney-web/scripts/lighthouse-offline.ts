type AuditNetworkReport = {
  audits?: {
    'network-requests'?: { details?: { items?: { url?: string }[] } };
  };
};

export function assertOfflineAuditReport(report: AuditNetworkReport): void {
  const requests = report.audits?.['network-requests']?.details?.items;
  if (!requests) throw new Error('Lighthouse did not report network requests.');
  const sanityRequest = requests.find((request) => {
    if (!request.url) return false;
    const hostname = new URL(request.url).hostname;
    return hostname === 'sanity.io' || hostname.endsWith('.sanity.io');
  });
  if (sanityRequest) {
    throw new Error(
      `Offline Lighthouse attempted a Sanity request: ${sanityRequest.url}. Use build:static:offline before --skip-build.`,
    );
  }
}
