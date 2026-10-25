import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
  descriptionArrow?: boolean;
}

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {props.eyebrow ? (
        <div>
          <p className="eyebrow">{props.eyebrow}</p>
          <h2 id={props.id}>{props.title}</h2>
        </div>
      ) : (
        <h2 id={props.id}>{props.title}</h2>
      )}
      <p>
        {props.description}
        {props.descriptionArrow && (
          <>
            {' '}
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </p>
    </div>
  );
}
