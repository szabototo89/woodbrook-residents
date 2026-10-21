import { isValidElement, type ReactNode } from 'react';
import { MermaidDiagram } from './MermaidDiagram';

export function HandoffPre(props: { children?: ReactNode }) {
  if (
    isValidElement<{ className?: string; children: string }>(props.children) &&
    props.children.props.className === 'language-mermaid'
  ) {
    return <MermaidDiagram source={props.children.props.children} />;
  }
  return <pre>{props.children}</pre>;
}
