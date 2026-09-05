import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function SectionHeading({
  eyebrow,
  title,
  linkLabel,
  linkTo,
}: {
  eyebrow: string;
  title: string;
  linkLabel?: string;
  linkTo?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {linkLabel && linkTo ? (
        <Link className="text-link" to={linkTo}>
          {linkLabel} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
