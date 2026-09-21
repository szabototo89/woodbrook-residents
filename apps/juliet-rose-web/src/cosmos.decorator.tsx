import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/dm-sans';
import type { ReactNode } from 'react';

import './styles.css';

type CosmosDecoratorProps = {
  children: ReactNode;
};

export default function CosmosDecorator(props: CosmosDecoratorProps) {
  return <div className="cosmos-preview">{props.children}</div>;
}
