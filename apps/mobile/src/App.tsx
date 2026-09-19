import './styles.css';

import { useEffect, useState } from '@lynx-js/react';

import { AppHeader } from './components/AppHeader.js';
import { OfflineNotice } from './components/OfflineNotice.js';
import { StatusScreen } from './components/StatusScreen.js';
import { TabBar } from './components/TabBar.js';
import { CollectionScreen } from './features/content/CollectionScreen.js';
import { DetailScreen } from './features/content/DetailScreen.js';
import {
  LocalInfoScreen,
  type LocalInfoFilters,
} from './features/content/LocalInfoScreen.js';
import { loadMobileContent } from './features/content/contentClient.js';
import {
  getCollectionModel,
  getDetailModel,
} from './features/content/contentModels.js';
import type { Route } from './features/content/contentModels.js';
import type { ContentSnapshot } from './features/content/contentTypes.js';
import { WaysToHelpScreen } from './features/help/WaysToHelpScreen.js';
import { HomeScreen } from './features/home/HomeScreen.js';
import { MoreScreen } from './features/more/MoreScreen.js';

type Props = { loadContent?: () => Promise<ContentSnapshot> };

const emptySnapshot: ContentSnapshot = {
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

const homeRoute: Route = { name: 'home' };

export const LOAD_TIMEOUT_MS = 12_000;

const initialFilters: LocalInfoFilters = {
  query: '',
  category: 'all',
  outOfHoursOnly: false,
};

function sameRoute(left: Route, right: Route): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function App(props: Props) {
  const loadContent = props.loadContent ?? loadMobileContent;
  const [history, setHistory] = useState<Route[]>([homeRoute]);
  const [content, setContent] = useState<ContentSnapshot>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [filters, setFilters] = useState<LocalInfoFilters>(initialFilters);

  useEffect(() => {
    setFailed(false);
    const request = { current: false };
    const timer = setTimeout(() => {
      if (!request.current) {
        request.current = true;
        setContent(emptySnapshot);
        setFailed(true);
      }
    }, LOAD_TIMEOUT_MS);
    loadContent()
      .then((snapshot) => {
        request.current = true;
        clearTimeout(timer);
        setContent(snapshot);
        setFailed(false);
      })
      .catch(() => {
        request.current = true;
        clearTimeout(timer);
        setContent(emptySnapshot);
        setFailed(true);
      });
    return () => clearTimeout(timer);
  }, [attempt, loadContent]);

  if (!content) {
    return <StatusScreen />;
  }

  const route = history[history.length - 1] ?? homeRoute;

  const navigate = (next: Route) =>
    setHistory((previous) => {
      const current = previous[previous.length - 1] ?? homeRoute;
      return sameRoute(current, next) ? previous : [...previous, next];
    });
  const navigateTab = (next: Route) => setHistory([next]);
  const goBack = (fallback: Route) =>
    setHistory((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : [fallback],
    );

  const page =
    route.name === 'home' ? (
      <HomeScreen content={content} navigate={navigate} />
    ) : route.name === 'help' ? (
      <WaysToHelpScreen content={content} navigate={navigate} />
    ) : route.name === 'more' ? (
      <MoreScreen navigate={navigate} />
    ) : route.name === 'collection' ? (
      route.collection === 'resources' ? (
        <LocalInfoScreen
          content={content}
          navigate={navigate}
          filters={filters}
          onFiltersChange={setFilters}
        />
      ) : (
        <CollectionScreen
          collection={route.collection}
          model={getCollectionModel(content, route.collection)}
          navigate={navigate}
        />
      )
    ) : (
      <DetailScreen
        collection={route.collection}
        model={getDetailModel(content, route.collection, route.slug)}
        goBack={goBack}
      />
    );

  return (
    <view className="app">
      <AppHeader navigate={navigateTab} compact={route.name === 'detail'} />
      {failed ? (
        <OfflineNotice retry={() => setAttempt((value) => value + 1)} />
      ) : null}
      {page}
      <TabBar route={route} navigateTab={navigateTab} />
    </view>
  );
}
