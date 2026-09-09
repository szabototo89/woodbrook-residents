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
      displayOrder: 20,
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
    expect(googleAuthMock.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/private-sheet/values:batchGet'),
        params: expect.objectContaining({
          ranges: [
            'Updates!A:Q',
            'Events!A:W',
            'Projects!A:V',
            'Consultations!A:R',
            'Local_Info!A:AA',
          ],
          valueRenderOption: 'UNFORMATTED_VALUE',
          dateTimeRenderOption: 'SERIAL_NUMBER',
        }),
      }),
    );
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
