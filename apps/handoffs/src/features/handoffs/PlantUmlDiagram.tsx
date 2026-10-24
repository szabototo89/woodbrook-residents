import {
  ExternalLink,
  FileCode2,
  Maximize2,
  Network,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

type PlantUmlDiagramProps = {
  title: string;
  image: string;
  source: string;
};

export function PlantUmlDiagram(props: PlantUmlDiagramProps) {
  const [failedImage, setFailedImage] = useState<string>();

  return (
    <figure className="handoff-diagram">
      <details className="diagram-disclosure">
        <summary>
          <Network size={14} aria-hidden="true" />
          View diagram
        </summary>
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
                      <ZoomOut size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Zoom in"
                      title="Zoom in"
                      onClick={() => void zoomIn(0.3, 0)}
                    >
                      <ZoomIn size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void fitToView({ animationTime: 0 })}
                      aria-label="Fit diagram"
                      title="Fit diagram"
                    >
                      <Maximize2 size={16} aria-hidden="true" />
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
          <ExternalLink size={13} aria-hidden="true" />
        </a>
        <details>
          <summary>
            <FileCode2 size={14} aria-hidden="true" />
            Diagram source
          </summary>
          <pre>
            <code>{props.source}</code>
          </pre>
        </details>
      </details>
    </figure>
  );
}
