import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  linkLabel?: string;
  linkTo?: string;
};

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{props.eyebrow}</p>
        <h2>{props.title}</h2>
      </div>
      {props.linkLabel && props.linkTo ? (
        <Link className="text-link" to={props.linkTo}>
          {props.linkLabel} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
