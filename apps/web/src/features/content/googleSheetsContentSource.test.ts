import { beforeEach, describe, expect, it, vi } from 'vitest';

const googleAuthMock = vi.hoisted(() => ({
  constructor: vi.fn(),
  request: vi.fn(),
}));

vi.mock('google-auth-library', () => ({
  GoogleAuth: class {
    constructor(options: unknown) {
      googleAuthMock.constructor(options);
    }

    request(options: unknown) {
      return googleAuthMock.request(options);
    }
  },
}));

import {
  GoogleSheetsContentSource,
  parseGoogleSheetsContent,
} from './googleSheetsContentSource';

const projectHeaders = [
  'record_id',
  'slug',
  'publish',
  'featured',
  'category',
  'status',
  'title',
  'summary',
  'body_markdown',
  'next_step',
  'location_name',
  'latitude',
  'longitude',
  'image_url',
  'image_alt',
  'image_credit',
  'source_name',
  'source_url',
  'reviewed_on',
  'target_date',
  'sort_order',
  'admin_notes',
];

const eventHeaders = [
  'record_id',
  'slug',
  'publish',
  'featured',
  'category',
  'status',
  'title',
  'summary',
  'start_at',
  'end_at',
  'timezone',
  'all_day',
  'location_name',
  'address',
  'map_url',
  'organiser_name',
  'organiser_url',
  'registration_url',
  'source_name',
  'source_url',
  'source_checked_on',
  'sort_order',
  'admin_notes',
];

describe('parseGoogleSheetsContent', () => {
  beforeEach(() => {
    googleAuthMock.constructor.mockReset();
    googleAuthMock.request.mockReset();
  });

  it('filters drafts and maps a published project into the domain model', () => {
    const sheets = {
      Updates: [[]],
      Events: [[]],
      Projects: [
        projectHeaders,
        ['draft-project', 'draft-project', false, false, 'Housing', 'Active'],
        [
          'woodbrook-project',
          'woodbrook-project',
          true,
          true,
          'Housing',
          'Active',
          'Woodbrook project',
          'Project summary',
          'Project details',
          'Watch the next milestone',
          'Woodbrook',
          53.21,
          -6.11,
          'https://example.com/image.jpg',
          'Woodbrook view',
          'Example photographer',
          'Example source',
          'https://example.com/project',
          46242,
          '',
          10,
          'private note',
        ],
      ],
      Consultations: [[]],
      Local_Info: [[]],
    };

    const snapshot = parseGoogleSheetsContent(sheets);

    expect(snapshot.projects).toEqual([
      expect.objectContaining({
        documentId: 'woodbrook-project',
        slug: 'woodbrook-project',
        category: 'housing',
        stage: 'active',
        details: 'Project details',
        updatedOn: '2026-08-08',
        sourceReviewedOn: '2026-08-08',
        featured: true,
      }),
    ]);
    expect(JSON.stringify(snapshot)).not.toContain('private note');
  });

  it('maps local information fields into public resource details', () => {
    const headers = [
      'record_id',
      'slug',
      'publish',
      'featured',
      'category',
      'type_label',
      'entity_type',
      'name',
      'description',
      'phone',
      'email',
      'website_url',
      'address',
      'map_url',
      'detail_label',
      'detail_value',
      'opening_hours',
      'accessibility',
      'out_of_hours',
      'out_of_hours_contact',
      'emergency_only',
      'source_name',
      'source_url',
      'source_checked_on',
      'disclaimer',
      'sort_order',
      'admin_notes',
      'recycling_dates',
      'waste_compost_dates',
      'document_url',
      'document_label',
    ];
    const snapshot = parseGoogleSheetsContent({
      Updates: [[]],
      Events: [[]],
      Projects: [[]],
      Consultations: [[]],
      Local_Info: [
        headers,
        [
          'practice',
          'practice',
          true,
          false,
          'Health',
          'GP practice',
          'Business',
          'Local practice',
          'Primary care',
          '01 234 5678',
          'hello@example.com',
          'https://example.com',
          'Main Street',
          '',
          'Address',
          'Main Street',
          'Monday–Friday',
          'Wheelchair accessible',
          true,
          '01 999 9999',
          false,
          'Example source',
          'https://example.com',
          46242,
          'Call ahead',
          20,
          '',
          '2026-09-15, 2026-09-29',
          '2026-09-22\n2026-10-06',
          '/documents/bin-schedule.pdf',
          '2026 bin collection schedule',
        ],
      ],
    });

    expect(snapshot.resources[0]).toMatchObject({
      documentId: 'practice',
      title: 'Local practice',
      category: 'health',
      serviceType: 'GP practice',
      providerType: 'business',
      url: 'https://example.com',
      outOfHours: true,
      featured: false,
      displayOrder: 20,
      collectionDates: [
        { id: 1, date: '2026-09-15', stream: 'recycling' },
        { id: 2, date: '2026-09-22', stream: 'waste-compost' },
        { id: 3, date: '2026-09-29', stream: 'recycling' },
        { id: 4, date: '2026-10-06', stream: 'waste-compost' },
      ],
      documentUrl: '/documents/bin-schedule.pdf',
      documentLabel: '2026 bin collection schedule',
      details: [
        { label: 'Address', value: 'Main Street', showOnCard: true },
        {
          label: 'Opening hours',
          value: 'Monday–Friday',
          showOnCard: false,
        },
        {
          label: 'Accessibility',
          value: 'Wheelchair accessible',
          showOnCard: false,
        },
        {
          label: 'Out-of-hours contact',
          value: '01 999 9999',
          showOnCard: false,
        },
        { label: 'Please note', value: 'Call ahead', showOnCard: false },
      ],
    });
  });

  it('reports the tab, row, and field for invalid published content', () => {
    expect(() =>
      parseGoogleSheetsContent({
        Updates: [[]],
        Events: [[]],
        Projects: [projectHeaders, ['project-1', 'project-1', true]],
        Consultations: [[]],
        Local_Info: [[]],
      }),
    ).toThrow('Projects row 2 field "category"');
  });

  it('requires build-only service-account credentials before reading', async () => {
    const source = new GoogleSheetsContentSource({
      spreadsheetId: 'sheet-id',
      serviceAccountEmail: '',
      serviceAccountPrivateKey: '',
    });

    await expect(source.loadSnapshot()).rejects.toThrow(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL is required.',
    );
  });

  it('reads all content tabs in one authenticated read-only batch request', async () => {
    googleAuthMock.request.mockResolvedValue({
      data: {
        valueRanges: Array.from({ length: 5 }, () => ({ values: [[]] })),
      },
    });
    const source = new GoogleSheetsContentSource({
      spreadsheetId: 'private-sheet',
      serviceAccountEmail: 'reader@example.test',
      serviceAccountPrivateKey: 'private-key',
    });

    await expect(source.loadSnapshot()).resolves.toMatchObject({
      updates: [],
      projects: [],
      events: [],
      surveys: [],
      resources: [],
    });
    expect(googleAuthMock.constructor).toHaveBeenCalledWith(
      expect.objectContaining({
        credentials: {
          client_email: 'reader@example.test',
          private_key: 'private-key',
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      }),
    );
    expect(googleAuthMock.request).toHaveBeenCalledTimes(1);
    const request = googleAuthMock.request.mock.calls[0]?.[0] as {
      url: string;
    };
    const requestUrl = new URL(request.url);

    expect(requestUrl.pathname).toContain('/private-sheet/values:batchGet');
    expect(requestUrl.searchParams.getAll('ranges')).toEqual([
      'Updates!A:Q',
      'Events!A:W',
      'Projects!A:V',
      'Consultations!A:R',
      'Local_Info!A:AE',
    ]);
    expect(requestUrl.searchParams.get('valueRenderOption')).toBe(
      'UNFORMATTED_VALUE',
    );
    expect(requestUrl.searchParams.get('dateTimeRenderOption')).toBe(
      'SERIAL_NUMBER',
    );
    expect(request).not.toHaveProperty('params');
  });

  it('accepts every deliberately configured spreadsheet taxonomy family', () => {
    const updateHeaders = [
      'record_id',
      'slug',
      'publish',
      'featured',
      'category',
      'published_on',
      'title',
      'summary',
      'body_markdown',
      'image_url',
      'image_alt',
      'image_credit',
      'source_name',
      'source_url',
      'source_checked_on',
      'sort_order',
      'admin_notes',
    ];
    const localHeaders = [
      'record_id',
      'slug',
      'publish',
      'featured',
      'category',
      'type_label',
      'entity_type',
      'name',
      'description',
      'phone',
      'email',
      'website_url',
      'address',
      'map_url',
      'detail_label',
      'detail_value',
      'opening_hours',
      'accessibility',
      'out_of_hours',
      'out_of_hours_contact',
      'emergency_only',
      'source_name',
      'source_url',
      'source_checked_on',
      'disclaimer',
      'sort_order',
      'admin_notes',
    ];
    const snapshot = parseGoogleSheetsContent({
      Updates: [
        updateHeaders,
        [
          'education-update',
          'education-update',
          true,
          false,
          'Education',
          '2026-09-09',
          'Education update',
          'Summary',
          '',
          '',
          '',
          '',
          'Source',
          'https://example.com/update',
          '2026-09-09',
          1,
        ],
      ],
      Events: [[]],
      Projects: [
        projectHeaders,
        [
          'environment-project',
          'environment-project',
          true,
          false,
          'Environment',
          'Proposed',
          'Environment project',
          'Summary',
          'Details',
          'Next',
          '',
          '',
          '',
          '',
          '',
          '',
          'Source',
          'https://example.com/project',
          '2026-09-09',
          '',
          1,
        ],
      ],
      Consultations: [[]],
      Local_Info: [
        localHeaders,
        [
          'childcare',
          'childcare',
          true,
          false,
          'Childcare',
          'Childcare',
          'Other',
          'Childcare provider',
          'Description',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          false,
          '',
          false,
          'Source',
          'https://example.com/local',
          '2026-09-09',
          '',
          1,
        ],
      ],
    });

    expect(snapshot.updates[0]?.kind).toBe('education');
    expect(snapshot.projects[0]).toMatchObject({
      category: 'environment',
      stage: 'proposed',
    });
    expect(snapshot.resources[0]).toMatchObject({
      category: 'childcare',
      providerType: 'other',
    });
  });

  it('maps Dublin spreadsheet date-times and consultation relations', () => {
    const consultationHeaders = [
      'record_id',
      'slug',
      'publish',
      'featured',
      'category',
      'status',
      'title',
      'summary',
      'body_markdown',
      'opens_on',
      'closes_on',
      'response_url',
      'source_name',
      'source_url',
      'source_checked_on',
      'related_project_id',
      'sort_order',
      'admin_notes',
    ];
    const snapshot = parseGoogleSheetsContent({
      Updates: [[]],
      Events: [
        eventHeaders,
        [
          'event-1',
          'event-1',
          true,
          false,
          'Community',
          'Scheduled',
          'Community event',
          'Summary',
          46242.5,
          46242.625,
          'Europe/Dublin',
          false,
          'Community centre',
          '',
          '',
          'Organiser',
          'https://example.com/organiser',
          'https://example.com/register',
          'Source',
          'https://example.com/event',
          46242,
          1,
        ],
      ],
      Projects: [
        projectHeaders,
        [
          'project-1',
          'project-1',
          true,
          false,
          'Community',
          'Active',
          'Project',
          'Summary',
          'Details',
          'Next',
          '',
          '',
          '',
          '',
          '',
          '',
          'Source',
          'https://example.com/project',
          46242,
          '',
          1,
        ],
      ],
      Consultations: [
        consultationHeaders,
        [
          'consultation-1',
          'consultation-1',
          true,
          false,
          'Planning',
          'Open',
          'Consultation',
          'Summary',
          '',
          46242,
          46252,
          'https://example.com/respond',
          'Source',
          'https://example.com/consultation',
          46242,
          'project-1',
          1,
        ],
      ],
      Local_Info: [[]],
    });

    expect(snapshot.events[0]).toMatchObject({
      startsAt: '2026-08-08T11:00:00.000Z',
      endsAt: '2026-08-08T14:00:00.000Z',
      location: 'Community centre',
      bookingUrl: 'https://example.com/register',
    });
    expect(snapshot.surveys[0]).toMatchObject({
      opensOn: '2026-08-08',
      closesOn: '2026-08-18',
      relatedProjectId: 'project-1',
    });
  });

  it('uses sort order first and the content date second', () => {
    const headers = [
      'record_id',
      'slug',
      'publish',
      'featured',
      'category',
      'published_on',
      'title',
      'summary',
      'body_markdown',
      'image_url',
      'image_alt',
      'image_credit',
      'source_name',
      'source_url',
      'source_checked_on',
      'sort_order',
      'admin_notes',
    ];
    const row = (id: string, date: string, order: number | '') => [
      id,
      id,
      true,
      false,
      'Community',
      date,
      id,
      'Summary',
      '',
      '',
      '',
      '',
      'Source',
      `https://example.com/${id}`,
      date,
      order,
    ];
    const snapshot = parseGoogleSheetsContent({
      Updates: [
        headers,
        row('older-with-priority', '2026-01-01', 1),
        row('older', '2026-08-01', ''),
        row('newer', '2026-09-01', ''),
      ],
      Events: [[]],
      Projects: [[]],
      Consultations: [[]],
      Local_Info: [[]],
    });

    expect(snapshot.updates.map((item) => item.documentId)).toEqual([
      'older-with-priority',
      'newer',
      'older',
    ]);
  });

  it('validates editorial taxonomy fields even when the domain does not display them', () => {
    expect(() =>
      parseGoogleSheetsContent({
        Updates: [[]],
        Events: [
          eventHeaders,
          [
            'event-1',
            'event-1',
            true,
            false,
            'Community',
            'Hidden',
            'Event',
            'Summary',
            46242.5,
            '',
            'Europe/Dublin',
            false,
            'Woodbrook',
            '',
            '',
            'Organiser',
            '',
            '',
            'Source',
            'https://example.com/event',
            46242,
            1,
          ],
        ],
        Projects: [[]],
        Consultations: [[]],
        Local_Info: [[]],
      }),
    ).toThrow('Events row 2 field "status": unsupported value "Hidden".');
  });

  it('enforces required spreadsheet fields before canonical validation', () => {
    expect(() =>
      parseGoogleSheetsContent({
        Updates: [[]],
        Events: [[]],
        Projects: [
          projectHeaders,
          [
            'project-1',
            'project-1',
            true,
            false,
            'Community',
            'Active',
            'Project',
            'Summary',
            'Details',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'Source',
            'https://example.com/project',
            46242,
            '',
            1,
          ],
        ],
        Consultations: [[]],
        Local_Info: [[]],
      }),
    ).toThrow('Projects row 2 field "next_step": is required.');
  });
});

describe('parseGoogleSheetsContent field handling', () => {
  const updateHeaders = [
    'record_id',
    'slug',
    'publish',
    'featured',
    'category',
    'published_on',
    'title',
    'summary',
    'body_markdown',
    'image_url',
    'image_alt',
    'image_credit',
    'source_name',
    'source_url',
    'source_checked_on',
    'sort_order',
    'admin_notes',
  ];
  const updateRow = (overrides: Record<number, unknown> = {}) => {
    const row: unknown[] = [
      'u1',
      'u1',
      true,
      false,
      'Community',
      '2026-09-09',
      'Title',
      'Summary',
      '',
      '',
      '',
      '',
      'Source',
      'https://example.com/u',
      '2026-09-09',
      1,
    ];
    for (const [index, value] of Object.entries(overrides)) {
      row[Number(index)] = value;
    }
    return row;
  };
  const parseUpdates = (rows: unknown[][]) =>
    parseGoogleSheetsContent({
      Updates: [updateHeaders, ...rows],
      Events: [[]],
      Projects: [[]],
      Consultations: [[]],
      Local_Info: [[]],
    });

  it('rejects non-text values in text fields', () => {
    expect(() => parseUpdates([updateRow({ 6: true })])).toThrow(
      'Updates row 2 field "title": must be text.',
    );
  });

  it('rejects blank values in required text fields', () => {
    expect(() => parseUpdates([updateRow({ 6: '   ' })])).toThrow(
      'Updates row 2 field "title": is required.',
    );
  });

  it('treats blank optional text as missing', () => {
    const snapshot = parseUpdates([updateRow({ 8: '   ' })]);

    expect(snapshot.updates[0]?.body).toBe('');
  });

  it('rejects a row without a publish decision', () => {
    expect(() => parseUpdates([['u1', 'u1']])).toThrow(
      'Updates row 2 field "publish": is required.',
    );
  });

  it('accepts string booleans for publish', () => {
    const snapshot = parseUpdates([updateRow({ 2: 'TRUE' })]);

    expect(snapshot.updates).toHaveLength(1);
  });

  it('rejects invalid booleans', () => {
    expect(() => parseUpdates([updateRow({ 2: 'yes' })])).toThrow(
      'Updates row 2 field "publish": must be TRUE or FALSE.',
    );
  });

  it('rejects invalid dates', () => {
    expect(() => parseUpdates([updateRow({ 5: 'next Friday' })])).toThrow(
      'Updates row 2 field "published_on": must be a real spreadsheet date or an ISO date (YYYY-MM-DD).',
    );
  });

  it('rejects missing required dates', () => {
    expect(() => parseUpdates([updateRow({ 5: '' })])).toThrow(
      'Updates row 2 field "published_on": is required.',
    );
  });

  it('ignores non-string header cells', () => {
    const snapshot = parseGoogleSheetsContent({
      Updates: [
        [...updateHeaders, ''],
        [...updateRow(), 'extra value'],
      ],
      Events: [[]],
      Projects: [[]],
      Consultations: [[]],
      Local_Info: [[]],
    });

    expect(snapshot.updates).toHaveLength(1);
  });
});

describe('parseGoogleSheetsContent project handling', () => {
  const projectRow = (overrides: Record<number, unknown> = {}) => {
    const row: unknown[] = [
      'p1',
      'p1',
      true,
      false,
      'Housing',
      'Active',
      'Project',
      'Summary',
      'Details',
      'Next',
      '',
      53.21,
      -6.11,
      '',
      '',
      '',
      'Source',
      'https://example.com/p',
      '2026-09-09',
      '',
      1,
      '',
    ];
    for (const [index, value] of Object.entries(overrides)) {
      row[Number(index)] = value;
    }
    return row;
  };
  const parseProjects = (rows: unknown[][]) =>
    parseGoogleSheetsContent({
      Updates: [[]],
      Events: [[]],
      Projects: [projectHeaders, ...rows],
      Consultations: [[]],
      Local_Info: [[]],
    });

  it('rejects non-numeric coordinates', () => {
    expect(() => parseProjects([projectRow({ 11: 'north' })])).toThrow(
      'Projects row 2 field "latitude": must be a number.',
    );
  });

  it('accepts numeric text for coordinates', () => {
    const snapshot = parseProjects([projectRow({ 11: '53.21' })]);

    expect(snapshot.projects).toHaveLength(1);
  });

  it('rejects slugs outside lowercase kebab-case', () => {
    expect(() => parseProjects([projectRow({ 1: 'Bad Slug!' })])).toThrow(
      'Projects row 2 field "slug": must be lowercase kebab-case.',
    );
  });

  it('requires the source URL', () => {
    expect(() => parseProjects([projectRow({ 17: '' })])).toThrow(
      'Projects row 2 field "source_url": is required.',
    );
  });

  it('rejects invalid source URLs', () => {
    expect(() => parseProjects([projectRow({ 17: 'not a url' })])).toThrow(
      'Projects row 2 field "source_url": must be a valid public URL.',
    );
  });

  it('rejects source URLs without a public protocol', () => {
    expect(() =>
      parseProjects([projectRow({ 17: 'ftp://example.com/p' })]),
    ).toThrow('Projects row 2 field "source_url": must be a valid public URL.');
  });

  it('sorts equal orders by review date and defaults missing bodies', () => {
    const snapshot = parseProjects([
      projectRow({ 0: 'older', 1: 'older', 18: '2026-01-01' }),
      projectRow({ 0: 'newer', 1: 'newer', 8: '', 18: '2026-09-01' }),
    ]);

    expect(snapshot.projects.map((project) => project.documentId)).toEqual([
      'newer',
      'older',
    ]);
    expect(snapshot.projects[0]).toMatchObject({ details: '' });
  });
});

describe('parseGoogleSheetsContent event handling', () => {
  const eventRow = (overrides: Record<number, unknown> = {}) => {
    const row: unknown[] = [
      'e1',
      'e1',
      true,
      false,
      'Community',
      'Scheduled',
      'Event',
      'Summary',
      46242.5,
      '',
      'Europe/Dublin',
      false,
      'Hall',
      '',
      '',
      'Organiser',
      '',
      '',
      'Source',
      'https://example.com/e',
      46242,
      1,
      '',
    ];
    for (const [index, value] of Object.entries(overrides)) {
      row[Number(index)] = value;
    }
    return row;
  };
  const parseEvents = (rows: unknown[][]) =>
    parseGoogleSheetsContent({
      Updates: [[]],
      Events: [eventHeaders, ...rows],
      Projects: [[]],
      Consultations: [[]],
      Local_Info: [[]],
    });

  it('rejects invalid start times', () => {
    expect(() => parseEvents([eventRow({ 8: 'sometime' })])).toThrow(
      'Events row 2 field "start_at": must be a real spreadsheet date-time.',
    );
  });

  it('rejects missing required start times', () => {
    expect(() => parseEvents([eventRow({ 8: '' })])).toThrow(
      'Events row 2 field "start_at": is required.',
    );
  });

  it('accepts ISO string date-times', () => {
    const snapshot = parseEvents([eventRow({ 8: '2026-09-09T10:00:00.000Z' })]);

    expect(snapshot.events[0]).toMatchObject({
      startsAt: '2026-09-09T10:00:00.000Z',
      endsAt: undefined,
    });
  });

  it('books through the organiser when registration is missing', () => {
    const snapshot = parseEvents([
      eventRow({ 16: 'https://example.com/organiser' }),
    ]);

    expect(snapshot.events[0]?.bookingUrl).toBe(
      'https://example.com/organiser',
    );
  });

  it('sorts equal orders by start time', () => {
    const snapshot = parseEvents([
      eventRow({ 0: 'later', 1: 'later', 8: 46243.5 }),
      eventRow({ 0: 'earlier', 1: 'earlier', 8: 46242.5 }),
    ]);

    expect(snapshot.events.map((event) => event.documentId)).toEqual([
      'earlier',
      'later',
    ]);
  });

  it('requires a location name or address', () => {
    expect(() => parseEvents([eventRow({ 12: '', 13: '' })])).toThrow(
      'Events row 2 field "location_name": is required.',
    );
  });
});

describe('parseGoogleSheetsContent consultation handling', () => {
  const consultationHeaders = [
    'record_id',
    'slug',
    'publish',
    'featured',
    'category',
    'status',
    'title',
    'summary',
    'body_markdown',
    'opens_on',
    'closes_on',
    'response_url',
    'source_name',
    'source_url',
    'source_checked_on',
    'related_project_id',
    'sort_order',
    'admin_notes',
  ];
  const consultationRow = (overrides: Record<number, unknown> = {}) => {
    const row: unknown[] = [
      'c1',
      'c1',
      true,
      false,
      'Planning',
      'Open',
      'Consultation',
      'Summary',
      '',
      '2026-09-01',
      '2026-09-30',
      '',
      'Source',
      'https://example.com/c',
      '2026-09-01',
      '',
      1,
      '',
    ];
    for (const [index, value] of Object.entries(overrides)) {
      row[Number(index)] = value;
    }
    return row;
  };

  it('sorts equal orders by closing date, then opening date', () => {
    const snapshot = parseGoogleSheetsContent({
      Updates: [[]],
      Events: [[]],
      Projects: [[]],
      Consultations: [
        consultationHeaders,
        consultationRow({ 0: 'later', 1: 'later', 10: '2026-10-31' }),
        consultationRow({ 0: 'earlier', 1: 'earlier', 10: '2026-09-15' }),
      ],
      Local_Info: [[]],
    });

    expect(snapshot.surveys.map((survey) => survey.documentId)).toEqual([
      'later',
      'earlier',
    ]);
  });
});

describe('parseGoogleSheetsContent resource handling', () => {
  const localHeaders = [
    'record_id',
    'slug',
    'publish',
    'featured',
    'category',
    'type_label',
    'entity_type',
    'name',
    'description',
    'phone',
    'email',
    'website_url',
    'address',
    'map_url',
    'detail_label',
    'detail_value',
    'opening_hours',
    'accessibility',
    'out_of_hours',
    'out_of_hours_contact',
    'emergency_only',
    'source_name',
    'source_url',
    'source_checked_on',
    'disclaimer',
    'sort_order',
    'admin_notes',
    'recycling_dates',
    'waste_compost_dates',
    'document_url',
    'document_label',
  ];
  const resourceRow = (overrides: Record<number, unknown> = {}) => {
    const row: unknown[] = [
      'r1',
      'r1',
      true,
      false,
      'Health',
      'GP practice',
      'Business',
      'Resource',
      'Description',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      false,
      '',
      false,
      'Source',
      'https://example.com/r',
      '2026-09-09',
      '',
      1,
      '',
      '',
      '',
      '',
      '',
    ];
    for (const [index, value] of Object.entries(overrides)) {
      row[Number(index)] = value;
    }
    return row;
  };
  const parseResources = (rows: unknown[][]) =>
    parseGoogleSheetsContent({
      Updates: [[]],
      Events: [[]],
      Projects: [[]],
      Consultations: [[]],
      Local_Info: [localHeaders, ...rows],
    });

  it('falls back to the address when no card detail is set', () => {
    const snapshot = parseResources([resourceRow({ 12: 'Main Street' })]);

    expect(snapshot.resources[0]?.details).toEqual([
      { id: 1, label: 'Address', value: 'Main Street', showOnCard: true },
    ]);
  });

  it('skips duplicate resource details', () => {
    const snapshot = parseResources([
      resourceRow({
        14: 'Opening hours',
        15: 'Monday–Friday',
        16: 'Monday–Friday',
      }),
    ]);

    expect(
      snapshot.resources[0]?.details.filter(
        (detail) => detail.label === 'Opening hours',
      ),
    ).toHaveLength(1);
  });

  it('keeps same-label details with different values', () => {
    const snapshot = parseResources([
      resourceRow({
        14: 'Opening hours',
        15: 'See website',
        16: 'Monday–Friday',
      }),
    ]);

    expect(
      snapshot.resources[0]?.details.filter(
        (detail) => detail.label === 'Opening hours',
      ),
    ).toHaveLength(2);
  });

  it('orders shared collection days by stream', () => {
    const snapshot = parseResources([
      resourceRow({ 27: '2026-09-15', 28: '2026-09-15' }),
    ]);

    expect(snapshot.resources[0]?.collectionDates).toEqual([
      { id: 1, date: '2026-09-15', stream: 'recycling' },
      { id: 2, date: '2026-09-15', stream: 'waste-compost' },
    ]);
  });

  it('defaults display order to zero', () => {
    const snapshot = parseResources([resourceRow({ 25: '' })]);

    expect(snapshot.resources[0]?.displayOrder).toBe(0);
  });

  it('sorts equal orders by title', () => {
    const snapshot = parseResources([
      resourceRow({ 0: 'b-place', 1: 'b-place', 7: 'B place' }),
      resourceRow({ 0: 'a-place', 1: 'a-place', 7: 'A place' }),
    ]);

    expect(snapshot.resources.map((resource) => resource.documentId)).toEqual([
      'a-place',
      'b-place',
    ]);
  });

  it('rejects invalid collection dates', () => {
    expect(() => parseResources([resourceRow({ 27: 'tomorrow' })])).toThrow(
      'Local_Info row 2 field "recycling_dates": contains invalid date "tomorrow"',
    );
  });

  it('rejects protocol-relative document URLs', () => {
    expect(() =>
      parseResources([resourceRow({ 29: '//example.com/doc.pdf' })]),
    ).toThrow(
      'Local_Info row 2 field "document_url": must be a valid public URL.',
    );
  });
});

describe('GoogleSheetsContentSource credential handling', () => {
  beforeEach(() => {
    googleAuthMock.constructor.mockReset();
    googleAuthMock.request.mockReset();
  });

  it('requires the private key when the email is configured', async () => {
    const source = new GoogleSheetsContentSource({
      spreadsheetId: 'sheet-id',
      serviceAccountEmail: 'reader@example.test',
      serviceAccountPrivateKey: '',
    });

    await expect(source.loadSnapshot()).rejects.toThrow(
      'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required.',
    );
  });

  it('rejects a batch response with missing ranges', async () => {
    googleAuthMock.request.mockResolvedValue({ data: {} });
    const source = new GoogleSheetsContentSource({
      spreadsheetId: 'sheet-id',
      serviceAccountEmail: 'reader@example.test',
      serviceAccountPrivateKey: 'private-key',
    });

    await expect(source.loadSnapshot()).rejects.toThrow(
      'Google Sheets returned 0 ranges; expected 5.',
    );
  });

  it('treats ranges without values as empty', async () => {
    googleAuthMock.request.mockResolvedValue({
      data: { valueRanges: [{}, {}, {}, {}, {}] },
    });
    const source = new GoogleSheetsContentSource({
      spreadsheetId: 'sheet-id',
      serviceAccountEmail: 'reader@example.test',
      serviceAccountPrivateKey: 'private-key',
    });

    await expect(source.loadSnapshot()).resolves.toMatchObject({
      updates: [],
      projects: [],
      events: [],
      surveys: [],
      resources: [],
    });
  });
});
