import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface DisclosureProps {
  variant: 'service' | 'guide';
  summary: string;
  children: ReactNode;
}

export function Disclosure(props: DisclosureProps) {
  return (
    <details
      className={
        props.variant === 'service' ? 'service-details' : 'guide-details'
      }
    >
      <summary>
        {props.summary}
        {props.variant === 'guide' && (
          <>
            {' '}
            <ArrowRight size={15} aria-hidden="true" />
          </>
        )}
      </summary>
      {props.children}
    </details>
  );
}
