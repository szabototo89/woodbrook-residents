import {
  OPEN_URL_EVENT,
  requestedUrl,
} from '../src/features/content/externalUrl.js';

const PAGE_TITLE = 'Woodbrook Residents mobile';
const APPLICATION_LABEL = 'Woodbrook Residents mobile application';

let openUrlListenerInstalled = false;

function installOpenUrlListener(targetDocument: Document): void {
  if (openUrlListenerInstalled) return;
  openUrlListenerInstalled = true;
  targetDocument.addEventListener(OPEN_URL_EVENT, (event) => {
    const url = requestedUrl(event);
    if (!url) return;
    targetDocument.defaultView?.open(url, '_blank', 'noopener,noreferrer');
  });
}

export function mountMobileWebRenderer(
  targetDocument: Document,
  bundleUrl: string,
): HTMLElement {
  targetDocument.title = PAGE_TITLE;
  installOpenUrlListener(targetDocument);

  const shell = targetDocument.createElement('main');
  shell.className = 'mobile-web-shell';
  shell.setAttribute('aria-label', APPLICATION_LABEL);

  const lynxView = targetDocument.createElement('lynx-view');
  lynxView.setAttribute('url', bundleUrl);

  shell.append(lynxView);
  targetDocument.body.replaceChildren(shell);

  return lynxView;
}
