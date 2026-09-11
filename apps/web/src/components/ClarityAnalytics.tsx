export const CLARITY_TAG_URL = 'https://www.clarity.ms/tag/';

export function resolveClarityProjectId(
  env: Record<string, unknown>,
): string | undefined {
  const raw = env['VITE_CLARITY_PROJECT_ID'];
  if (typeof raw !== 'string') {
    return undefined;
  }
  const projectId = raw.trim();
  return projectId ? projectId : undefined;
}

export function getClarityProjectId(): string | undefined {
  return resolveClarityProjectId(import.meta.env);
}

export function createClaritySnippet(projectId: string) {
  return `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="${CLARITY_TAG_URL}"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`;
}

export function ClarityAnalytics() {
  const projectId = getClarityProjectId();

  if (!projectId) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: createClaritySnippet(projectId) }}
    />
  );
}
