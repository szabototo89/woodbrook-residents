import type { HTMLAttributes, ReactNode } from 'react';

type CardElement = 'section' | 'article' | 'div';
export type CardVariant = 'panel' | 'white' | 'muted';
export type CardPadding = 'none' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  variant?: CardVariant;
  padding?: CardPadding;
  popular?: boolean;
  children: ReactNode;
}

const defaultPadding: Record<CardVariant, CardPadding> = {
  panel: 'lg',
  white: 'md',
  muted: 'md',
};

export function Card(props: CardProps) {
  const {
    as: tagName = 'section',
    variant = 'panel',
    padding,
    popular = false,
    className,
    children,
    ...rest
  } = props;
  const resolvedPadding = padding ?? defaultPadding[variant];
  const classes = [
    'card',
    `card--${variant}`,
    `card--padding-${resolvedPadding}`,
    popular ? 'card--popular' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  if (tagName === 'article') {
    return (
      <article className={classes} {...rest}>
        {children}
      </article>
    );
  }
  if (tagName === 'div') {
    return (
      <div className={classes} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <section className={classes} {...rest}>
      {children}
    </section>
  );
}
