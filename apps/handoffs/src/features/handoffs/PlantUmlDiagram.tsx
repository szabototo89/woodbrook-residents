import { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export function PlantUmlDiagram(props: {
  title: string;
  image: string;
  source: string;
}) {
  const [failedImage, setFailedImage] = useState<string>();

  return (
    <figure className="handoff-diagram">
      <details className="diagram-disclosure">
        <summary>View diagram</summary>
        {failedImage === props.image ? (
          <p role="status">
            Diagram could not be loaded. The source is available below.
          </p>
        ) : (
          <TransformWrapper
            minScale={0.1}
            maxScale={6}
            limitToBounds={false}
            fitOnInit
            keyboard={{ disabled: false, animationTime: 0 }}
            wheel={{ activationKeys: ['Control'] }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, fitToView }) => (
              <>
                <div className="diagram-viewer">
                  <div
                    className="diagram-toolbar"
                    role="group"
                    aria-label={`${props.title} controls`}
                  >
                    <button
                      type="button"
                      aria-label="Zoom out"
                      title="Zoom out"
                      onClick={() => void zoomOut(0.3, 0)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Zoom in"
                      title="Zoom in"
                      onClick={() => void zoomIn(0.3, 0)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5v14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => void fitToView({ animationTime: 0 })}
                      aria-label="Fit diagram"
                      title="Fit diagram"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" />
                      </svg>
                    </button>
                  </div>
                  <TransformComponent
                    wrapperClass="diagram-canvas"
                    contentClass="diagram-content"
                    wrapperProps={{
                      role: 'region',
                      'aria-label': props.title,
                      tabIndex: 0,
                    }}
                  >
                    <img
                      src={props.image}
                      alt={`${props.title} — C4 architecture diagram`}
                      draggable={false}
                      onError={() => setFailedImage(props.image)}
                    />
                  </TransformComponent>
                </div>
                <p className="diagram-help">
                  Drag to pan · Pinch or Ctrl + scroll to zoom · Arrow keys to
                  move
                </p>
              </>
            )}
          </TransformWrapper>
        )}
        <a
          className="diagram-full-size"
          href={props.image}
          target="_blank"
          rel="noreferrer"
        >
          Open full size
        </a>
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
