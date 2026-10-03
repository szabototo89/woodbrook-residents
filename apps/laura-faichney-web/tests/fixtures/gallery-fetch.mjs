// Loaded only by the e2e build; normal builds never include these fixtures.
import { fixtureResponse } from './site-fixtures.ts';

globalThis.fetch = fixtureResponse;
