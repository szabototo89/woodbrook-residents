const PAGE_TITLE = 'Woodbrook Residents mobile';
const APPLICATION_LABEL = 'Woodbrook Residents mobile application';

export function mountMobileWebRenderer(
  targetDocument: Document,
  bundleUrl: string,
): HTMLElement {
  targetDocument.title = PAGE_TITLE;

  const shell = targetDocument.createElement('main');
  shell.className = 'mobile-web-shell';

  const lynxView = targetDocument.createElement('lynx-view');
  lynxView.setAttribute('url', bundleUrl);
  lynxView.setAttribute('role', 'application');
  lynxView.setAttribute('aria-label', APPLICATION_LABEL);

  shell.append(lynxView);
  targetDocument.body.replaceChildren(shell);

  return lynxView;
}
