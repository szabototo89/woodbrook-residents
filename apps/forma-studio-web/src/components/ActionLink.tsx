import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

interface ActionLinkProps {
  href: string;
  variant?: 'button' | 'text';
  arrow?: 'right' | 'up-right' | 'left';
  iconSize?: number;
  className?: string;
  children: ReactNode;
}

const arrowIcons = {
  right: ArrowRight,
  'up-right': ArrowUpRight,
  left: ArrowLeft,
} as const;

const defaultVariant = 'button';
const defaultArrow = 'right';
const defaultIconSize = 16;

export function ActionLink(props: ActionLinkProps) {
  const arrow = props.arrow ?? defaultArrow;
  const Icon = arrowIcons[arrow];
  const icon = (
    <Icon size={props.iconSize ?? defaultIconSize} aria-hidden="true" />
  );
  const classes = [
    (props.variant ?? defaultVariant) === 'button' ? 'button' : 'text-link',
    props.className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={classes} href={props.href}>
      {arrow === 'left' && icon}
      {props.children}
      {arrow !== 'left' && <> {icon}</>}
    </a>
  );
}
