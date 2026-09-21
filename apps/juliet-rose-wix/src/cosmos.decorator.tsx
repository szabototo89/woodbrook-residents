import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/dm-sans';
import type { ReactNode } from 'react';

type CosmosDecoratorProps = Readonly<{
  children: ReactNode;
}>;

export default function CosmosDecorator(props: CosmosDecoratorProps) {
  return <>{props.children}</>;
}
