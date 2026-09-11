import { GoogleAuth } from 'google-auth-library';

type Direction = 'strapi-to-sheets' | 'sheets-to-strapi' | 'two-way';
type ConflictPolicy = 'report' | 'strapi-wins' | 'sheets-wins';
type JsonObject = Record<string, unknown>;

type Config = {
  apply: boolean;
  conflictPolicy: ConflictPolicy;
  direction: Direction;
  spreadsheetId: string;
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
  strapiApiToken?: string;
  strapiUrl: string;
};

type SheetTable = {
  headers: string[];
  rows: SheetRecord[];
};

export type SheetRecord = {
  rowNumber: number;
  values: unknown[];
  cells: Record<string, unknown>;
};

export type StrapiRecord = {
  documentId: string;
  slug: string;
  data: JsonObject;
};

export type CollectionDescriptor = {
  key: string;
  strapiPath: string;
  tab: string;
  range: string;
  sheetToStrapi: (row: SheetRecord) => JsonObject;
  strapiToSheet: (record: StrapiRecord) => JsonObject;
};

export type SyncAction =
  | {
      type: 'append-sheet';
      collection: string;
      tab: string;
      record: StrapiRecord;
    }
  | {
      type: 'update-sheet';
      collection: string;
      tab: string;
      row: SheetRecord;
      record: StrapiRecord;
    }
  | {
      type: 'create-strapi';
      collection: string;
      strapiPath: string;
      row: SheetRecord;
      data: JsonObject;
    }
  | {
      type: 'update-strapi';
      collection: string;
      strapiPath: string;
      documentId: string;
      row: SheetRecord;
      data: JsonObject;
    };

export type SyncConflict = {
  collection: string;
  slug: string;
  sheetRow: number;
  differingFields: string[];
};

export type SyncPlan = {
  actions: SyncAction[];
  conflicts: SyncConflict[];
  duplicates: string[];
};

const value = (row: SheetRecord, header: string) => row.cells[header];
const text = (row: SheetRecord, header: string) => {
  const cell = value(row, header);
  if (cell === undefined || cell === null || cell === '') return undefined;
  return String(cell).trim() || undefined;
};
const bool = (row: SheetRecord, header: string) => {
  const cell = value(row, header);
  if (typeof cell === 'boolean') return cell;
  return typeof cell === 'string' && cell.trim().toLowerCase() === 'true';
};
const number = (row: SheetRecord, header: string) => {
  const cell = value(row, header);
  if (cell === undefined || cell === null || cell === '') return undefined;
  const parsed = Number(cell);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const enumText = (row: SheetRecord, header: string) =>
  text(row, header)?.toLowerCase().replace(/[ _]+/g, '-');
const spreadsheetDate = (row: SheetRecord, header: string) => {
  const cell = value(row, header);
  if (typeof cell !== 'number') return text(row, header);
  const date = new Date(Date.UTC(1899, 11, 30) + cell * 86_400_000);
  return date.toISOString().slice(0, 10);
};
const spreadsheetDates = (row: SheetRecord, header: string) =>
  (text(row, header) ?? '')
    .split(/[\n,;]+/)
    .map((date) => date.trim())
    .filter(Boolean);
const spreadsheetDateTime = (row: SheetRecord, header: string) => {
  const cell = value(row, header);
  if (typeof cell !== 'number') return text(row, header);
  const wallTime = new Date(Date.UTC(1899, 11, 30) + cell * 86_400_000);
  const timeZone = text(row, 'timezone') ?? 'Europe/Dublin';
  const localTimestamp = Date.UTC(
    wallTime.getUTCFullYear(),
    wallTime.getUTCMonth(),
    wallTime.getUTCDate(),
    wallTime.getUTCHours(),
    wallTime.getUTCMinutes(),
    wallTime.getUTCSeconds(),
  );
  let timestamp = localTimestamp - timeZoneOffset(localTimestamp, timeZone);
  timestamp = localTimestamp - timeZoneOffset(timestamp, timeZone);
  return new Date(timestamp).toISOString();
};

function timeZoneOffset(timestamp: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-IE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  return (
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second),
    ) - timestamp
  );
}
const compact = (object: JsonObject) =>
  Object.fromEntries(
    Object.entries(object).filter(([, item]) => item !== undefined),
  );
const publicUrl = (candidate: unknown) =>
  typeof candidate === 'string' && /^https?:\/\//i.test(candidate)
    ? candidate
    : undefined;

function collectionDatesFromSheet(row: SheetRecord) {
  return [
    ...spreadsheetDates(row, 'recycling_dates').map((date) => ({
      date,
      stream: 'recycling',
    })),
    ...spreadsheetDates(row, 'waste_compost_dates').map((date) => ({
      date,
      stream: 'waste-compost',
    })),
  ].sort((left, right) => left.date.localeCompare(right.date));
}

function collectionDatesToSheet(candidate: unknown) {
  const collectionDates = Array.isArray(candidate) ? candidate : [];
  const datesFor = (stream: string) =>
    collectionDates
      .filter(
        (item): item is JsonObject =>
          typeof item === 'object' &&
          item !== null &&
          item.stream === stream &&
          typeof item.date === 'string',
      )
      .map((item) => item.date)
      .sort()
      .join(', ');

  return {
    recycling_dates: datesFor('recycling'),
    waste_compost_dates: datesFor('waste-compost'),
  };
}

function detailsFromSheet(row: SheetRecord) {
  const details: Array<{
    label: string;
    value: string;
    showOnCard: boolean;
  }> = [];
  const add = (
    label: string,
    detailValue: string | undefined,
    showOnCard = false,
  ) => {
    if (
      detailValue &&
      !details.some(
        (detail) => detail.label === label && detail.value === detailValue,
      )
    ) {
      details.push({ label, value: detailValue, showOnCard });
    }
  };

  const detailLabel = text(row, 'detail_label');
  const detailValue = text(row, 'detail_value');
  if (detailLabel && detailValue) add(detailLabel, detailValue, true);
  else add('Address', text(row, 'address'), true);
  add('Opening hours', text(row, 'opening_hours'));
  add('Accessibility', text(row, 'accessibility'));
  add('Out-of-hours contact', text(row, 'out_of_hours_contact'));
  add('Please note', text(row, 'disclaimer'));
  return details;
}

function detailsToSheet(detailsValue: unknown) {
  const details = Array.isArray(detailsValue)
    ? detailsValue.filter(
        (
          detail,
        ): detail is { label: string; value: string; showOnCard?: boolean } =>
          typeof detail === 'object' &&
          detail !== null &&
          typeof (detail as JsonObject).label === 'string' &&
          typeof (detail as JsonObject).value === 'string',
      )
    : [];
  const featured = details.find((detail) => detail.showOnCard) ?? details[0];
  const byLabel = (label: string) =>
    details.find((detail) => detail.label.toLowerCase() === label.toLowerCase())
      ?.value;

  return compact({
    address: byLabel('Address'),
    detail_label: featured?.label,
    detail_value: featured?.value,
    opening_hours: byLabel('Opening hours'),
    accessibility: byLabel('Accessibility'),
    out_of_hours_contact:
      byLabel('Out-of-hours contact') ?? byLabel('24/7 contact'),
    disclaimer: byLabel('Please note'),
  });
}

export const contentCollections: CollectionDescriptor[] = [
  {
    key: 'updates',
    strapiPath: 'updates',
    tab: 'Updates',
    range: 'A:Q',
    sheetToStrapi: (row) =>
      compact({
        slug: text(row, 'slug'),
        title: text(row, 'title'),
        kind: enumText(row, 'category'),
        summary: text(row, 'summary'),
        body: text(row, 'body_markdown') ?? '',
        publishedOn: spreadsheetDate(row, 'published_on'),
        sourceName: text(row, 'source_name'),
        sourceUrl: text(row, 'source_url'),
        sourceReviewedOn: spreadsheetDate(row, 'source_checked_on'),
        imagePath: text(row, 'image_url'),
        imageAlt: text(row, 'image_alt'),
        imageCredit: text(row, 'image_credit'),
        featured: bool(row, 'featured'),
      }),
    strapiToSheet: ({ documentId, data }) =>
      compact({
        record_id: documentId,
        slug: data.slug,
        featured: data.featured ?? false,
        category: data.kind,
        published_on: data.publishedOn,
        title: data.title,
        summary: data.summary,
        body_markdown: data.body,
        image_url: publicUrl(data.imagePath),
        image_alt: data.imageAlt,
        image_credit: data.imageCredit,
        source_name: data.sourceName,
        source_url: data.sourceUrl,
        source_checked_on: data.sourceReviewedOn,
      }),
  },
  {
    key: 'projects',
    strapiPath: 'projects',
    tab: 'Projects',
    range: 'A:V',
    sheetToStrapi: (row) =>
      compact({
        slug: text(row, 'slug'),
        title: text(row, 'title'),
        category: enumText(row, 'category'),
        stage: enumText(row, 'status'),
        summary: text(row, 'summary'),
        details: text(row, 'body_markdown') ?? '',
        updatedOn: spreadsheetDate(row, 'reviewed_on'),
        nextStep: text(row, 'next_step'),
        sourceName: text(row, 'source_name'),
        sourceUrl: text(row, 'source_url'),
        sourceReviewedOn: spreadsheetDate(row, 'reviewed_on'),
        imagePath: text(row, 'image_url'),
        imageAlt: text(row, 'image_alt'),
        imageCredit: text(row, 'image_credit'),
        featured: bool(row, 'featured'),
      }),
    strapiToSheet: ({ documentId, data }) =>
      compact({
        record_id: documentId,
        slug: data.slug,
        featured: data.featured ?? false,
        category: data.category,
        status: data.stage,
        title: data.title,
        summary: data.summary,
        body_markdown: data.details,
        next_step: data.nextStep,
        image_url: publicUrl(data.imagePath),
        image_alt: data.imageAlt,
        image_credit: data.imageCredit,
        source_name: data.sourceName,
        source_url: data.sourceUrl,
        reviewed_on: data.sourceReviewedOn ?? data.updatedOn,
      }),
  },
  {
    key: 'events',
    strapiPath: 'events',
    tab: 'Events',
    range: 'A:W',
    sheetToStrapi: (row) =>
      compact({
        slug: text(row, 'slug'),
        title: text(row, 'title'),
        summary: text(row, 'summary'),
        startsAt: spreadsheetDateTime(row, 'start_at'),
        endsAt: spreadsheetDateTime(row, 'end_at'),
        location: text(row, 'location_name') ?? text(row, 'address'),
        bookingUrl: text(row, 'registration_url') ?? text(row, 'organiser_url'),
        sourceUrl: text(row, 'source_url'),
        sourceReviewedOn: spreadsheetDate(row, 'source_checked_on'),
      }),
    strapiToSheet: ({ documentId, data }) =>
      compact({
        record_id: documentId,
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        start_at: data.startsAt,
        end_at: data.endsAt,
        timezone: 'Europe/Dublin',
        location_name: data.location,
        registration_url: data.bookingUrl,
        source_url: data.sourceUrl,
        source_checked_on: data.sourceReviewedOn,
      }),
  },
  {
    key: 'surveys',
    strapiPath: 'surveys',
    tab: 'Consultations',
    range: 'A:R',
    sheetToStrapi: (row) =>
      compact({
        slug: text(row, 'slug'),
        title: text(row, 'title'),
        stage: enumText(row, 'status'),
        summary: text(row, 'summary'),
        opensOn: spreadsheetDate(row, 'opens_on'),
        closesOn: spreadsheetDate(row, 'closes_on'),
        responseUrl: text(row, 'response_url'),
        sourceName: text(row, 'source_name'),
        sourceUrl: text(row, 'source_url'),
        sourceReviewedOn: spreadsheetDate(row, 'source_checked_on'),
      }),
    strapiToSheet: ({ documentId, data }) =>
      compact({
        record_id: documentId,
        slug: data.slug,
        status: data.stage,
        title: data.title,
        summary: data.summary,
        opens_on: data.opensOn,
        closes_on: data.closesOn,
        response_url: data.responseUrl,
        source_name: data.sourceName,
        source_url: data.sourceUrl,
        source_checked_on: data.sourceReviewedOn,
      }),
  },
  {
    key: 'resources',
    strapiPath: 'resources',
    tab: 'Local_Info',
    range: 'A:AE',
    sheetToStrapi: (row) =>
      compact({
        slug: text(row, 'slug'),
        title: text(row, 'name'),
        category: enumText(row, 'category'),
        serviceType: text(row, 'type_label'),
        providerType: enumText(row, 'entity_type'),
        description: text(row, 'description'),
        url: text(row, 'website_url'),
        phone: text(row, 'phone'),
        email: text(row, 'email'),
        outOfHours: bool(row, 'out_of_hours'),
        featured: bool(row, 'featured'),
        details: detailsFromSheet(row),
        collectionDates: collectionDatesFromSheet(row),
        documentUrl: text(row, 'document_url'),
        documentLabel: text(row, 'document_label'),
        displayOrder: number(row, 'sort_order') ?? 0,
        sourceName: text(row, 'source_name'),
        sourceUrl: text(row, 'source_url'),
        sourceReviewedOn: spreadsheetDate(row, 'source_checked_on'),
      }),
    strapiToSheet: ({ documentId, data }) =>
      compact({
        record_id: documentId,
        slug: data.slug,
        category: data.category,
        type_label: data.serviceType,
        entity_type: data.providerType,
        name: data.title,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website_url: data.url,
        out_of_hours: data.outOfHours ?? false,
        featured: data.featured ?? false,
        emergency_only: false,
        source_name: data.sourceName,
        source_url: data.sourceUrl,
        source_checked_on: data.sourceReviewedOn,
        sort_order: data.displayOrder,
        ...detailsToSheet(data.details),
        ...collectionDatesToSheet(data.collectionDates),
        document_url: data.documentUrl,
        document_label: data.documentLabel,
      }),
  },
];

function normalize(candidate: unknown): unknown {
  if (candidate === undefined || candidate === null || candidate === '')
    return null;
  if (typeof candidate === 'string') return candidate.trim();
  if (Array.isArray(candidate)) return candidate.map(normalize);
  if (typeof candidate === 'object') {
    return Object.fromEntries(
      Object.entries(candidate as JsonObject)
        .filter(([key]) => key !== 'id')
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, normalize(item)]),
    );
  }
  return candidate;
}

function comparableSheetData(
  descriptor: CollectionDescriptor,
  row: SheetRecord,
) {
  return descriptor.sheetToStrapi(row);
}

function comparableStrapiData(
  descriptor: CollectionDescriptor,
  record: StrapiRecord,
) {
  const sheetShape = descriptor.strapiToSheet(record);
  const syntheticRow: SheetRecord = {
    rowNumber: 0,
    values: [],
    cells: sheetShape,
  };
  return descriptor.sheetToStrapi(syntheticRow);
}

function differingFields(left: JsonObject, right: JsonObject) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...keys].filter(
    (key) =>
      JSON.stringify(normalize(left[key])) !==
      JSON.stringify(normalize(right[key])),
  );
}

function uniqueBySlug<T>(
  records: T[],
  slugFor: (record: T) => string | undefined,
  label: string,
) {
  const unique = new Map<string, T>();
  const duplicates: string[] = [];
  const duplicateSlugs = new Set<string>();
  for (const record of records) {
    const slug = slugFor(record);
    if (!slug) continue;
    if (unique.has(slug)) {
      duplicates.push(`${label}: ${slug}`);
      duplicateSlugs.add(slug);
      unique.delete(slug);
    } else if (!duplicateSlugs.has(slug)) {
      unique.set(slug, record);
    }
  }
  return { unique, duplicates, duplicateSlugs };
}

export function planCollectionSync(options: {
  descriptor: CollectionDescriptor;
  direction: Direction;
  conflictPolicy: ConflictPolicy;
  sheetRows: SheetRecord[];
  strapiRecords: StrapiRecord[];
}): SyncPlan {
  const { descriptor, direction, conflictPolicy } = options;
  const sheetIndex = uniqueBySlug(
    options.sheetRows,
    (row) => text(row, 'slug'),
    `${descriptor.tab} sheet`,
  );
  const strapiIndex = uniqueBySlug(
    options.strapiRecords,
    (record) => record.slug,
    `${descriptor.strapiPath} Strapi collection`,
  );
  const plan: SyncPlan = {
    actions: [],
    conflicts: [],
    duplicates: [...sheetIndex.duplicates, ...strapiIndex.duplicates],
  };
  const slugs = new Set([
    ...sheetIndex.unique.keys(),
    ...strapiIndex.unique.keys(),
  ]);

  for (const slug of [...slugs].sort()) {
    if (
      sheetIndex.duplicateSlugs.has(slug) ||
      strapiIndex.duplicateSlugs.has(slug)
    ) {
      continue;
    }
    const row = sheetIndex.unique.get(slug);
    const record = strapiIndex.unique.get(slug);
    if (!row && record && direction !== 'sheets-to-strapi') {
      plan.actions.push({
        type: 'append-sheet',
        collection: descriptor.key,
        tab: descriptor.tab,
        record,
      });
      continue;
    }
    if (
      row &&
      !record &&
      direction !== 'strapi-to-sheets' &&
      bool(row, 'publish')
    ) {
      plan.actions.push({
        type: 'create-strapi',
        collection: descriptor.key,
        strapiPath: descriptor.strapiPath,
        row,
        data: descriptor.sheetToStrapi(row),
      });
      continue;
    }
    if (!row || !record) continue;

    const differences = differingFields(
      comparableSheetData(descriptor, row),
      comparableStrapiData(descriptor, record),
    );
    if (differences.length === 0) continue;

    if (conflictPolicy === 'strapi-wins' && direction !== 'sheets-to-strapi') {
      plan.actions.push({
        type: 'update-sheet',
        collection: descriptor.key,
        tab: descriptor.tab,
        row,
        record,
      });
    } else if (
      conflictPolicy === 'sheets-wins' &&
      direction !== 'strapi-to-sheets' &&
      bool(row, 'publish')
    ) {
      plan.actions.push({
        type: 'update-strapi',
        collection: descriptor.key,
        strapiPath: descriptor.strapiPath,
        documentId: record.documentId,
        row,
        data: descriptor.sheetToStrapi(row),
      });
    } else {
      plan.conflicts.push({
        collection: descriptor.key,
        slug,
        sheetRow: row.rowNumber,
        differingFields: differences,
      });
    }
  }
  return plan;
}

function parseArguments(argv: string[]) {
  const options = new Map<string, string>();
  let apply = false;
  let help = false;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!;
    if (argument === '--apply') apply = true;
    else if (argument === '--help' || argument === '-h') help = true;
    else if (argument.startsWith('--') && argument.includes('=')) {
      const [key, ...parts] = argument.slice(2).split('=');
      options.set(key!, parts.join('='));
    } else if (argument.startsWith('--')) {
      const next = argv[index + 1];
      if (!next || next.startsWith('--'))
        throw new Error(`${argument} needs a value.`);
      options.set(argument.slice(2), next);
      index += 1;
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  return { apply, help, options };
}

function required(name: string, candidate: string | undefined) {
  const result = candidate?.trim();
  if (!result) throw new Error(`${name} is required.`);
  return result;
}

function readConfig(argv: string[]): Config | 'help' {
  const parsed = parseArguments(argv);
  if (parsed.help) return 'help';
  const direction =
    parsed.options.get('direction') ??
    process.env.CONTENT_SYNC_DIRECTION ??
    'strapi-to-sheets';
  const conflictPolicy =
    parsed.options.get('conflict') ??
    process.env.CONTENT_SYNC_CONFLICT ??
    'report';
  if (
    !['strapi-to-sheets', 'sheets-to-strapi', 'two-way'].includes(direction)
  ) {
    throw new Error(`Unsupported sync direction: ${direction}`);
  }
  if (!['report', 'strapi-wins', 'sheets-wins'].includes(conflictPolicy)) {
    throw new Error(`Unsupported conflict policy: ${conflictPolicy}`);
  }
  return {
    apply: parsed.apply,
    direction: direction as Direction,
    conflictPolicy: conflictPolicy as ConflictPolicy,
    spreadsheetId: required(
      'GOOGLE_SHEETS_SPREADSHEET_ID',
      parsed.options.get('spreadsheet-id') ??
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    ),
    serviceAccountEmail: required(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    ),
    serviceAccountPrivateKey: required(
      'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    ).replace(/\\n/g, '\n'),
    strapiUrl: required(
      'STRAPI_URL',
      parsed.options.get('strapi-url') ?? process.env.STRAPI_URL,
    ).replace(/\/$/, ''),
    strapiApiToken: process.env.STRAPI_API_TOKEN?.trim() || undefined,
  };
}

function printHelp() {
  console.log(`Usage: bun run sync:content -- [options]

Options:
  --direction <strapi-to-sheets|sheets-to-strapi|two-way>
  --conflict <report|strapi-wins|sheets-wins>
  --strapi-url <url>
  --spreadsheet-id <id>
  --apply                 Perform writes (the default is dry-run)
  --help

Environment:
  STRAPI_URL
  STRAPI_API_TOKEN        Required only when writing to Strapi
  GOOGLE_SHEETS_SPREADSHEET_ID
  GOOGLE_SERVICE_ACCOUNT_EMAIL
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  CONTENT_SYNC_DIRECTION  Optional default direction
  CONTENT_SYNC_CONFLICT   Optional default conflict policy

New Strapi records are appended to Sheets with publish=FALSE and an admin note,
so spreadsheet-only editorial fields can be reviewed before publication.`);
}

class GoogleSheetsClient {
  private readonly auth: GoogleAuth;

  constructor(private readonly config: Config) {
    this.auth = new GoogleAuth({
      credentials: {
        client_email: config.serviceAccountEmail,
        private_key: config.serviceAccountPrivateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  async loadTables() {
    const url = new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values:batchGet`,
    );
    for (const descriptor of contentCollections) {
      url.searchParams.append(
        'ranges',
        `${descriptor.tab}!${descriptor.range}`,
      );
    }
    url.searchParams.set('majorDimension', 'ROWS');
    url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
    url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');
    const response = await this.auth.request<{
      valueRanges?: Array<{ values?: unknown[][] }>;
    }>({ url: url.toString() });

    return Object.fromEntries(
      contentCollections.map((descriptor, index) => {
        const [rawHeaders = [], ...rawRows] =
          response.data.valueRanges?.[index]?.values ?? [];
        const headers = rawHeaders.map(String);
        const rows = rawRows
          .map((values, rowIndex) => ({
            rowNumber: rowIndex + 2,
            values,
            cells: Object.fromEntries(
              headers.map((header, columnIndex) => [
                header,
                values[columnIndex],
              ]),
            ),
          }))
          .filter((row) =>
            Object.values(row.cells).some((cell) => cell !== ''),
          );
        return [descriptor.tab, { headers, rows } satisfies SheetTable];
      }),
    ) as Record<string, SheetTable>;
  }

  async updateRow(
    descriptor: CollectionDescriptor,
    table: SheetTable,
    row: SheetRecord,
    record: StrapiRecord,
  ) {
    const patch = descriptor.strapiToSheet(record);
    const values = table.headers.map((header, index) =>
      Object.hasOwn(patch, header)
        ? (patch[header] ?? '')
        : (row.values[index] ?? ''),
    );
    await this.writeRange(
      `${descriptor.tab}!A${row.rowNumber}:${columnName(table.headers.length)}${row.rowNumber}`,
      [values],
    );
  }

  async appendRows(
    descriptor: CollectionDescriptor,
    table: SheetTable,
    records: StrapiRecord[],
  ) {
    if (records.length === 0) return;
    const rows = records.map((record) => {
      const patch: JsonObject = {
        ...descriptor.strapiToSheet(record),
        publish: false,
        admin_notes: 'Synced from Strapi; review before publishing.',
      };
      return table.headers.map((header) => patch[header] ?? '');
    });
    const range = encodeURIComponent(
      `${descriptor.tab}!A:${columnName(table.headers.length)}`,
    );
    const url = new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values/${range}:append`,
    );
    url.searchParams.set('valueInputOption', 'RAW');
    url.searchParams.set('insertDataOption', 'INSERT_ROWS');
    await this.auth.request({
      url: url.toString(),
      method: 'POST',
      data: { majorDimension: 'ROWS', values: rows },
    });
  }

  private async writeRange(range: string, values: unknown[][]) {
    const url = new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values/${encodeURIComponent(range)}`,
    );
    url.searchParams.set('valueInputOption', 'RAW');
    await this.auth.request({
      url: url.toString(),
      method: 'PUT',
      data: { majorDimension: 'ROWS', range, values },
    });
  }
}

class StrapiClient {
  constructor(private readonly config: Config) {}

  private headers(write = false) {
    return compact({
      Accept: 'application/json',
      'Content-Type': write ? 'application/json' : undefined,
      Authorization: this.config.strapiApiToken
        ? `Bearer ${this.config.strapiApiToken}`
        : undefined,
    }) as Record<string, string>;
  }

  async loadRecords(descriptor: CollectionDescriptor) {
    const items: JsonObject[] = [];
    let page = 1;
    let pageCount = 1;
    do {
      const url = new URL(
        `${this.config.strapiUrl}/api/${descriptor.strapiPath}`,
      );
      url.searchParams.set('status', 'published');
      url.searchParams.set('pagination[page]', String(page));
      url.searchParams.set('pagination[pageSize]', '200');
      if (descriptor.key === 'resources') url.searchParams.set('populate', '*');
      const response = await fetch(url, { headers: this.headers() });
      const body = (await response.json()) as {
        data?: JsonObject[];
        error?: { message?: string };
        meta?: { pagination?: { pageCount?: number } };
      };
      if (!response.ok) {
        throw new Error(
          `Strapi read failed for ${descriptor.strapiPath} (${response.status}): ${body.error?.message ?? response.statusText}`,
        );
      }
      items.push(...(body.data ?? []));
      pageCount = body.meta?.pagination?.pageCount ?? 1;
      page += 1;
    } while (page <= pageCount);

    return items.map((item) => ({
      documentId: String(item.documentId),
      slug: String(item.slug),
      data: Object.fromEntries(
        Object.entries(item).filter(
          ([key]) =>
            ![
              'id',
              'documentId',
              'createdAt',
              'updatedAt',
              'publishedAt',
              'locale',
            ].includes(key),
        ),
      ),
    }));
  }

  async create(path: string, data: JsonObject) {
    await this.write(`${this.config.strapiUrl}/api/${path}`, 'POST', data);
  }

  async update(path: string, documentId: string, data: JsonObject) {
    await this.write(
      `${this.config.strapiUrl}/api/${path}/${encodeURIComponent(documentId)}`,
      'PUT',
      data,
    );
  }

  private async write(url: string, method: 'POST' | 'PUT', data: JsonObject) {
    if (!this.config.strapiApiToken) {
      throw new Error('STRAPI_API_TOKEN is required when writing to Strapi.');
    }
    const response = await fetch(url, {
      method,
      headers: this.headers(true),
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(
        `Strapi ${method} failed (${response.status}): ${body.error?.message ?? response.statusText}`,
      );
    }
  }
}

function columnName(columnCount: number) {
  let result = '';
  let value = columnCount;
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

function combinePlans(plans: SyncPlan[]): SyncPlan {
  return {
    actions: plans.flatMap((plan) => plan.actions),
    conflicts: plans.flatMap((plan) => plan.conflicts),
    duplicates: plans.flatMap((plan) => plan.duplicates),
  };
}

async function loadPlan(
  config: Config,
  sheets: GoogleSheetsClient,
  strapi: StrapiClient,
) {
  const [tables, recordSets] = await Promise.all([
    sheets.loadTables(),
    Promise.all(
      contentCollections.map((descriptor) => strapi.loadRecords(descriptor)),
    ),
  ]);
  const plan = combinePlans(
    contentCollections.map((descriptor, index) =>
      planCollectionSync({
        descriptor,
        direction: config.direction,
        conflictPolicy: config.conflictPolicy,
        sheetRows: tables[descriptor.tab]?.rows ?? [],
        strapiRecords: recordSets[index] ?? [],
      }),
    ),
  );
  return { plan, tables };
}

function printPlan(plan: SyncPlan, apply: boolean) {
  console.log(apply ? 'Applied content sync:' : 'Content sync dry run:');
  const counts = new Map<string, number>();
  for (const action of plan.actions) {
    const key = `${action.type} (${action.collection})`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (counts.size === 0) console.log('  no changes');
  else for (const [label, count] of counts) console.log(`  ${label}: ${count}`);
  for (const conflict of plan.conflicts) {
    console.log(
      `  conflict ${conflict.collection}/${conflict.slug} at sheet row ${conflict.sheetRow}: ${conflict.differingFields.join(', ')}`,
    );
  }
  for (const duplicate of plan.duplicates)
    console.log(`  duplicate ${duplicate}`);
}

async function applyPlan(
  plan: SyncPlan,
  tables: Record<string, SheetTable>,
  sheets: GoogleSheetsClient,
  strapi: StrapiClient,
) {
  for (const descriptor of contentCollections) {
    const table = tables[descriptor.tab];
    if (!table || table.headers.length === 0) {
      throw new Error(`${descriptor.tab} is missing its header row.`);
    }
    const appends = plan.actions
      .filter(
        (action): action is Extract<SyncAction, { type: 'append-sheet' }> =>
          action.type === 'append-sheet' && action.tab === descriptor.tab,
      )
      .map((action) => action.record);
    await sheets.appendRows(descriptor, table, appends);
  }
  for (const action of plan.actions) {
    if (action.type === 'update-sheet') {
      const descriptor = contentCollections.find(
        (item) => item.tab === action.tab,
      )!;
      await sheets.updateRow(
        descriptor,
        tables[action.tab]!,
        action.row,
        action.record,
      );
    } else if (action.type === 'create-strapi') {
      await strapi.create(action.strapiPath, action.data);
    } else if (action.type === 'update-strapi') {
      await strapi.update(action.strapiPath, action.documentId, action.data);
    }
  }
}

async function main() {
  const config = readConfig(process.argv.slice(2));
  if (config === 'help') {
    printHelp();
    return;
  }
  const sheets = new GoogleSheetsClient(config);
  const strapi = new StrapiClient(config);
  const initial = await loadPlan(config, sheets, strapi);
  printPlan(initial.plan, false);
  if (!config.apply) {
    if (initial.plan.conflicts.length || initial.plan.duplicates.length)
      process.exitCode = 2;
    return;
  }
  await applyPlan(initial.plan, initial.tables, sheets, strapi);
  const verified = await loadPlan(config, sheets, strapi);
  printPlan(verified.plan, true);
  if (verified.plan.actions.length) {
    throw new Error('Verification found unapplied sync actions.');
  }
  if (verified.plan.conflicts.length || verified.plan.duplicates.length)
    process.exitCode = 2;
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
