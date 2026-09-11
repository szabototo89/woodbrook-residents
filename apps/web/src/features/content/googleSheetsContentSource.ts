import { GoogleAuth } from 'google-auth-library';

import type { ContentSource } from './contentSource';
import {
  consultationCategories,
  eventCategories,
  eventStatuses,
  projectCategories,
  projectStages,
  providerTypes,
  resourceCategories,
  surveyStages,
  updateKinds,
} from './contentTaxonomy';
import type {
  CommunityEvent,
  ContentSnapshot,
  Project,
  Resource,
  Survey,
  Update,
} from './contentTypes';

const spreadsheetTimeZone = 'Europe/Dublin';
const sheetsApiScope = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const sheetRanges = [
  'Updates!A:Q',
  'Events!A:W',
  'Projects!A:V',
  'Consultations!A:R',
  'Local_Info!A:AE',
] as const;

type SheetTab =
  'Updates' | 'Events' | 'Projects' | 'Consultations' | 'Local_Info';

export type GoogleSheetsValues = Record<SheetTab, unknown[][]>;

type GoogleSheetsConfig = {
  spreadsheetId: string;
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
};

type BatchGetResponse = {
  valueRanges?: Array<{ range?: string; values?: unknown[][] }>;
};

class SheetRow {
  private readonly cells = new Map<string, unknown>();

  constructor(
    readonly tab: SheetTab,
    readonly number: number,
    headers: unknown[],
    values: unknown[],
  ) {
    headers.forEach((header, index) => {
      if (typeof header === 'string' && header) {
        this.cells.set(header, values[index]);
      }
    });
  }

  error(field: string, message: string): never {
    throw new Error(
      `${this.tab} row ${this.number} field "${field}": ${message}`,
    );
  }

  value(field: string) {
    return this.cells.get(field);
  }

  text(field: string, required = false) {
    const value = this.value(field);
    if (value === undefined || value === null || value === '') {
      if (required) {
        this.error(field, 'is required.');
      }
      return undefined;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      this.error(field, 'must be text.');
    }

    const text = String(value).trim();
    if (!text && required) {
      this.error(field, 'is required.');
    }
    return text || undefined;
  }

  boolean(field: string, required = false) {
    const value = this.value(field);
    if (value === undefined || value === null || value === '') {
      if (required) {
        this.error(field, 'is required.');
      }
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string' && /^(true|false)$/i.test(value.trim())) {
      return value.trim().toLowerCase() === 'true';
    }

    return this.error(field, 'must be TRUE or FALSE.');
  }

  numeric(field: string, required = false) {
    const value = this.value(field);
    if (value === undefined || value === null || value === '') {
      if (required) {
        this.error(field, 'is required.');
      }
      return undefined;
    }

    const number = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(number)) {
      this.error(field, 'must be a number.');
    }
    return number;
  }

  date(field: string, required = false) {
    const value = this.value(field);
    if (value === undefined || value === null || value === '') {
      if (required) {
        this.error(field, 'is required.');
      }
      return undefined;
    }

    if (typeof value === 'number') {
      return spreadsheetSerialToParts(value).date;
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    return this.error(
      field,
      'must be a real spreadsheet date or an ISO date (YYYY-MM-DD).',
    );
  }

  dateTime(field: string, timeZone: string, required = false) {
    const value = this.value(field);
    if (value === undefined || value === null || value === '') {
      if (required) {
        this.error(field, 'is required.');
      }
      return undefined;
    }

    if (typeof value === 'number') {
      const parts = spreadsheetSerialToParts(value);
      return zonedPartsToIso(parts, timeZone);
    }
    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
      return new Date(value).toISOString();
    }

    return this.error(field, 'must be a real spreadsheet date-time.');
  }

  enum<const T extends readonly string[]>(field: string, allowed: T) {
    const value = this.text(field, true)!;
    const normalized = value.toLowerCase().replace(/[ _]+/g, '-');
    const match = allowed.find((candidate) => candidate === normalized);
    if (!match) {
      this.error(field, `unsupported value "${value}".`);
    }
    return match as T[number];
  }

  url(field: string) {
    const value = this.text(field);
    if (!value) {
      return undefined;
    }

    try {
      const url = new URL(value);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        this.error(field, 'must use http or https.');
      }
    } catch {
      this.error(field, 'must be a valid public URL.');
    }
    return value;
  }

  publicLink(field: string) {
    const value = this.text(field);
    if (!value) {
      return undefined;
    }

    if (value.startsWith('/') && !value.startsWith('//')) {
      return value;
    }

    return this.url(field);
  }

  dateList(field: string) {
    const value = this.text(field);
    if (!value) {
      return [];
    }

    return value
      .split(/[\n,;]+/)
      .map((date) => date.trim())
      .filter(Boolean)
      .map((date) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          this.error(
            field,
            `contains invalid date "${date}"; use ISO dates (YYYY-MM-DD) separated by commas.`,
          );
        }
        return date;
      });
  }
}

type DateTimeParts = {
  date: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function spreadsheetSerialToParts(serial: number): DateTimeParts {
  const milliseconds = Date.UTC(1899, 11, 30) + serial * 86_400_000;
  const value = new Date(milliseconds);
  const year = value.getUTCFullYear();
  const month = value.getUTCMonth() + 1;
  const day = value.getUTCDate();

  return {
    date: `${year.toString().padStart(4, '0')}-${month
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    year,
    month,
    day,
    hour: value.getUTCHours(),
    minute: value.getUTCMinutes(),
    second: value.getUTCSeconds(),
  };
}

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
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return asUtc - timestamp;
}

function zonedPartsToIso(parts: DateTimeParts, timeZone: string) {
  const localTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  let timestamp = localTimestamp - timeZoneOffset(localTimestamp, timeZone);
  timestamp = localTimestamp - timeZoneOffset(timestamp, timeZone);
  return new Date(timestamp).toISOString();
}

function rowsFor(tab: SheetTab, values: unknown[][]) {
  const [headers = [], ...rows] = values;
  if (headers.length === 0) {
    return [];
  }

  return rows
    .map((row, index) => new SheetRow(tab, index + 2, headers, row))
    .filter((row) => row.boolean('publish', true));
}

function requiredUrl(row: SheetRow, field: string) {
  return row.url(field) ?? row.error(field, 'is required.');
}

function identity(row: SheetRow) {
  const documentId = row.text('record_id', true)!;
  const slug = row.text('slug', true)!;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    row.error('slug', 'must be lowercase kebab-case.');
  }
  return { documentId, slug };
}

function sortOrder(row: SheetRow) {
  return row.numeric('sort_order') ?? Number.MAX_SAFE_INTEGER;
}

function mapRows<T>(
  tab: SheetTab,
  values: unknown[][],
  map: (row: SheetRow) => T,
  compare: (left: T, right: T) => number = () => 0,
) {
  return rowsFor(tab, values)
    .map((row) => ({ item: map(row), order: sortOrder(row) }))
    .sort(
      (left, right) =>
        left.order - right.order || compare(left.item, right.item),
    )
    .map(({ item }) => item);
}

function mapUpdates(values: unknown[][]): Update[] {
  return mapRows(
    'Updates',
    values,
    (row) => ({
      ...identity(row),
      title: row.text('title', true)!,
      kind: row.enum('category', updateKinds),
      summary: row.text('summary', true)!,
      body: row.text('body_markdown') ?? '',
      publishedOn: row.date('published_on', true)!,
      sourceName: row.text('source_name', true)!,
      sourceUrl: requiredUrl(row, 'source_url'),
      sourceReviewedOn: row.date('source_checked_on', true)!,
      imagePath: row.url('image_url'),
      imageAlt: row.text('image_alt'),
      imageCredit: row.text('image_credit'),
      featured: row.boolean('featured'),
    }),
    (left, right) => right.publishedOn.localeCompare(left.publishedOn),
  );
}

function mapProjects(values: unknown[][]): Project[] {
  return mapRows(
    'Projects',
    values,
    (row) => {
      row.numeric('latitude');
      row.numeric('longitude');
      row.date('target_date');

      return {
        ...identity(row),
        category: row.enum('category', projectCategories),
        stage: row.enum('status', projectStages),
        title: row.text('title', true)!,
        summary: row.text('summary', true)!,
        details: row.text('body_markdown') ?? '',
        updatedOn: row.date('reviewed_on', true)!,
        nextStep: row.text('next_step', true)!,
        sourceName: row.text('source_name', true)!,
        sourceUrl: requiredUrl(row, 'source_url'),
        sourceReviewedOn: row.date('reviewed_on', true)!,
        imagePath: row.url('image_url'),
        imageAlt: row.text('image_alt'),
        imageCredit: row.text('image_credit'),
        featured: row.boolean('featured'),
      };
    },
    (left, right) => right.updatedOn.localeCompare(left.updatedOn),
  );
}

function mapEvents(values: unknown[][]): CommunityEvent[] {
  return mapRows(
    'Events',
    values,
    (row) => {
      row.enum('category', eventCategories);
      row.enum('status', eventStatuses);
      row.boolean('all_day', true);
      row.text('source_name', true);
      row.url('map_url');
      const timeZone = row.text('timezone', true) ?? spreadsheetTimeZone;
      const locationName = row.text('location_name');
      const address = row.text('address');

      return {
        ...identity(row),
        title: row.text('title', true)!,
        summary: row.text('summary', true)!,
        startsAt: row.dateTime('start_at', timeZone, true)!,
        endsAt: row.dateTime('end_at', timeZone),
        location:
          locationName ?? address ?? row.error('location_name', 'is required.'),
        bookingUrl: row.url('registration_url') ?? row.url('organiser_url'),
        sourceUrl: requiredUrl(row, 'source_url'),
        sourceReviewedOn: row.date('source_checked_on', true)!,
      };
    },
    (left, right) => left.startsAt.localeCompare(right.startsAt),
  );
}

function mapSurveys(values: unknown[][]): Survey[] {
  return mapRows(
    'Consultations',
    values,
    (row) => {
      row.enum('category', consultationCategories);
      return {
        ...identity(row),
        title: row.text('title', true)!,
        stage: row.enum('status', surveyStages),
        summary: row.text('summary', true)!,
        opensOn: row.date('opens_on', true)!,
        closesOn: row.date('closes_on', true)!,
        responseUrl: row.url('response_url'),
        sourceName: row.text('source_name', true)!,
        sourceUrl: requiredUrl(row, 'source_url'),
        sourceReviewedOn: row.date('source_checked_on', true)!,
        relatedProjectId: row.text('related_project_id'),
      };
    },
    (left, right) =>
      (right.closesOn ?? right.opensOn ?? '').localeCompare(
        left.closesOn ?? left.opensOn ?? '',
      ),
  );
}

function mapResources(values: unknown[][]): Resource[] {
  return mapRows(
    'Local_Info',
    values,
    (row) => {
      const details: Resource['details'] = [];
      const addDetail = (label: string, value: string, showOnCard: boolean) => {
        if (
          !details.some(
            (detail) => detail.label === label && detail.value === value,
          )
        ) {
          details.push({ id: details.length + 1, label, value, showOnCard });
        }
      };
      const detailLabel = row.text('detail_label');
      const detailValue = row.text('detail_value');
      const address = row.text('address');
      row.url('map_url');
      if (detailLabel && detailValue) {
        addDetail(detailLabel, detailValue, true);
      } else if (address) {
        addDetail('Address', address, true);
      }
      const optionalDetails = [
        ['Opening hours', row.text('opening_hours')],
        ['Accessibility', row.text('accessibility')],
        ['Out-of-hours contact', row.text('out_of_hours_contact')],
        ['Please note', row.text('disclaimer')],
      ] as const;
      optionalDetails.forEach(([label, value]) => {
        if (value) addDetail(label, value, false);
      });
      row.boolean('emergency_only', true);
      const collectionDates = [
        ...row.dateList('recycling_dates').map((date) => ({
          date,
          stream: 'recycling' as const,
        })),
        ...row.dateList('waste_compost_dates').map((date) => ({
          date,
          stream: 'waste-compost' as const,
        })),
      ]
        .sort(
          (left, right) =>
            left.date.localeCompare(right.date) ||
            left.stream.localeCompare(right.stream),
        )
        .map((collectionDate, index) => ({
          id: index + 1,
          ...collectionDate,
        }));

      return {
        ...identity(row),
        title: row.text('name', true)!,
        category: row.enum('category', resourceCategories),
        serviceType: row.text('type_label', true)!,
        providerType: row.enum('entity_type', providerTypes),
        description: row.text('description', true)!,
        url: row.url('website_url'),
        phone: row.text('phone'),
        email: row.text('email'),
        outOfHours: row.boolean('out_of_hours', true),
        featured: row.boolean('featured'),
        details,
        collectionDates,
        documentUrl: row.publicLink('document_url'),
        documentLabel: row.text('document_label'),
        displayOrder: row.numeric('sort_order') ?? 0,
        sourceName: row.text('source_name', true)!,
        sourceUrl: requiredUrl(row, 'source_url'),
        sourceReviewedOn: row.date('source_checked_on', true)!,
      };
    },
    (left, right) => left.title.localeCompare(right.title, 'en-IE'),
  );
}

export function parseGoogleSheetsContent(
  sheets: GoogleSheetsValues,
): ContentSnapshot {
  return {
    updates: mapUpdates(sheets.Updates),
    projects: mapProjects(sheets.Projects),
    events: mapEvents(sheets.Events),
    surveys: mapSurveys(sheets.Consultations),
    resources: mapResources(sheets.Local_Info),
  };
}

export class GoogleSheetsContentSource implements ContentSource {
  readonly name = 'google-sheets';

  constructor(private readonly config: GoogleSheetsConfig) {}

  async loadSnapshot() {
    if (!this.config.serviceAccountEmail) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is required.');
    }
    if (!this.config.serviceAccountPrivateKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required.');
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: this.config.serviceAccountEmail,
        private_key: this.config.serviceAccountPrivateKey,
      },
      scopes: [sheetsApiScope],
    });
    const requestUrl = new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values:batchGet`,
    );
    sheetRanges.forEach((range) =>
      requestUrl.searchParams.append('ranges', range),
    );
    requestUrl.searchParams.set('majorDimension', 'ROWS');
    requestUrl.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
    requestUrl.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');

    const response = await auth.request<BatchGetResponse>({
      url: requestUrl.toString(),
    });
    const values = response.data.valueRanges ?? [];
    if (values.length !== sheetRanges.length) {
      throw new Error(
        `Google Sheets returned ${values.length} ranges; expected ${sheetRanges.length}.`,
      );
    }

    const sheets = Object.fromEntries(
      sheetRanges.map((range, index) => [
        range.slice(0, range.indexOf('!')),
        values[index]?.values ?? [],
      ]),
    ) as GoogleSheetsValues;

    return parseGoogleSheetsContent(sheets);
  }
}
