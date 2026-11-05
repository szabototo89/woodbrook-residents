import type { ContentEnvironmentKey } from './features/content/contentSourceFactory';
import { createContentSource } from './features/content/contentSourceFactory';
import { createMobileContentWorker } from './features/content/mobileContentWorker';
import type { MobileContentWorkerEnvironment } from './features/content/mobileContentWorker';
import { loadContentSnapshot } from './features/content/contentSnapshot';

type Environment = MobileContentWorkerEnvironment &
  Partial<Record<ContentEnvironmentKey, string>>;

export default createMobileContentWorker((environment: Environment) =>
  loadContentSnapshot(createContentSource(environment)),
);
