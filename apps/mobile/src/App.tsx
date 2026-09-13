import './styles.css';

import { useEffect, useState } from '@lynx-js/react';

import { AppHeader } from './components/AppHeader.js';
import { StatusScreen } from './components/StatusScreen.js';
import { CollectionScreen } from './features/content/CollectionScreen.js';
import { DetailScreen } from './features/content/DetailScreen.js';
import { LocalInfoScreen } from './features/content/LocalInfoScreen.js';
import { loadMobileContent } from './features/content/contentClient.js';
import {
  getCollectionModel,
  getDetailModel,
} from './features/content/contentModels.js';
import type { Route } from './features/content/contentModels.js';
import type { ContentSnapshot } from './features/content/contentTypes.js';
import { WaysToHelpScreen } from './features/help/WaysToHelpScreen.js';
import { HomeScreen } from './features/home/HomeScreen.js';

type Props = { loadContent?: () => Promise<ContentSnapshot> };

export function App({ loadContent = loadMobileContent }: Props) {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [content, setContent] = useState<ContentSnapshot>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setFailed(false);
    loadContent()
      .then(setContent)
      .catch(() => setFailed(true));
  }, [attempt, loadContent]);

  if (!content) {
    return (
      <StatusScreen
        failed={failed}
        retry={() => setAttempt((value) => value + 1)}
      />
    );
  }

  const page =
    route.name === 'home' ? (
      <HomeScreen navigate={setRoute} />
    ) : route.name === 'help' ? (
      <WaysToHelpScreen content={content} />
    ) : route.name === 'collection' ? (
      route.collection === 'resources' ? (
        <LocalInfoScreen content={content} navigate={setRoute} />
      ) : (
        <CollectionScreen
          collection={route.collection}
          model={getCollectionModel(content, route.collection)}
          navigate={setRoute}
        />
      )
    ) : (
      <DetailScreen
        collection={route.collection}
        model={getDetailModel(content, route.collection, route.slug)}
        navigate={setRoute}
      />
    );

  return (
    <view className="app">
      <AppHeader navigate={setRoute} />
      {page}
    </view>
  );
}
