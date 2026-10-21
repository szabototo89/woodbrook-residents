import { useEffect, useId, useState } from 'react';

export function MermaidDiagram(props: { source: string }) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [result, setResult] = useState<{ svg: string } | { error: true }>();

  useEffect(() => {
    const controller = new AbortController();
    async function renderDiagram() {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          suppressErrorRendering: true,
        });
        const { svg } = await mermaid.render(id, props.source);
        if (!controller.signal.aborted) setResult({ svg });
      } catch {
        if (!controller.signal.aborted) setResult({ error: true });
      }
    }
    void renderDiagram();
    return () => controller.abort();
  }, [id, props.source]);

  return (
    <figure className="handoff-diagram">
      <details className="diagram-disclosure">
        <summary>View diagram</summary>
        {result && 'svg' in result ? (
          <div
            role="img"
            aria-label="C4 architecture diagram"
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: result.svg }}
          />
        ) : (
          <p role="status">
            {result
              ? 'Diagram could not be rendered. The source is available below.'
              : 'Rendering architecture diagram…'}
          </p>
        )}
        <details>
          <summary>Diagram source</summary>
          <pre>
            <code>{props.source}</code>
          </pre>
        </details>
      </details>
    </figure>
  );
}
