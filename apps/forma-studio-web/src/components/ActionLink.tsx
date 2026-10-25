import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'button' | 'text';
  arrow?: 'right' | 'up-right' | 'left';
  iconSize?: number;
  children: ReactNode;
}

export function ActionLink(props: ActionLinkProps) {
  const {
    variant = 'button',
    arrow = 'right',
    iconSize = 16,
    className,
    children,
    ...linkProps
  } = props;
  const Icon =
    arrow === 'left'
      ? ArrowLeft
      : arrow === 'up-right'
        ? ArrowUpRight
        : ArrowRight;
  return (
    <a
      className={[variant === 'button' ? 'button' : 'text-link', className]
        .filter(Boolean)
        .join(' ')}
      {...linkProps}
    >
      {arrow === 'left' && <Icon size={iconSize} aria-hidden="true" />}
      {children}
      {arrow !== 'left' && (
        <>
          {' '}
          <Icon size={iconSize} aria-hidden="true" />
        </>
      )}
    </a>
  );
}
