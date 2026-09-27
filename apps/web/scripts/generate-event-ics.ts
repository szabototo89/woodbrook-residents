import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatErrorChain } from '../src/features/content/contentBuildDiagnostics';
import { loadContentSnapshot } from '../src/features/content/contentSnapshot';
import { createContentSource } from '../src/features/content/contentSourceFactory';
import {
  buildEventCalendar,
  eventCalendarFileName,
} from '../src/features/events/eventCalendar';

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const outputRoot = path.join(appRoot, 'dist', 'client', 'ics');

async function generateEventCalendars() {
  const snapshot = await loadContentSnapshot(createContentSource());
  await mkdir(outputRoot, { recursive: true });

  for (const event of snapshot.events) {
    await Bun.write(
      path.join(outputRoot, eventCalendarFileName(event)),
      buildEventCalendar(event),
    );
  }

  console.log(`Wrote ${snapshot.events.length} event calendar files to /ics.`);
}

try {
  await generateEventCalendars();
} catch (error) {
  console.error(formatErrorChain(error)[0]);
  process.exitCode = 1;
}
