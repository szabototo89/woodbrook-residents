export const siteSetting = {
  name: 'Woodbrook Community Hub',
  location: 'Woodbrook, Shankill, Dublin 18',
  tagline:
    'A shared place for local updates, practical information, and resident action.',
  introduction:
    'Follow what is changing, find the right local service, join a community event, or raise an issue that needs attention.',
};

export const updates = [
  {
    title: 'Woodbrook DART station is now open',
    slug: 'woodbrook-dart-station-now-open',
    kind: 'transport',
    summary:
      'The new station between Shankill and Bray opened in August 2025, bringing frequent DART services within walking distance of Woodbrook.',
    body: 'Woodbrook became the 147th station on the Irish rail network on 10 August 2025. Iarnród Éireann says the fully accessible station can serve up to 191 weekday DART services, with city-centre journeys of about 40 minutes. Access is from Woodbrook Avenue and the station includes bicycle parking, ticketing, passenger information, shelters, and step-free ramps.',
    publishedOn: '2025-08-10',
    sourceName: 'Iarnród Éireann',
    sourceUrl:
      'https://www.irishrail.ie/en-ie/news/minister-opens-woodbrook-station',
    sourceReviewedOn: '2026-09-05',
    imagePath: '/images/woodbrook-station.jpg',
    imageAlt: 'A DART train at the platforms of Woodbrook station in Shankill',
    imageCredit: 'William Murphy (infomatique), CC BY-SA 4.0',
    imageCreditUrl:
      'https://commons.wikimedia.org/wiki/File:Woodbrook_Train_Station,_Oct_2025_44.jpg',
    featured: true,
  },
  {
    title: 'LDA Woodbrook homes move through construction',
    slug: 'lda-woodbrook-homes-construction-update',
    kind: 'planning',
    summary:
      'The Land Development Agency lists 328 A-rated apartments at Woodbrook as under construction, with completion expected in early 2027.',
    body: 'The current LDA project page describes 102 one-bedroom and 226 two-bedroom apartments being delivered with Castlethorn. It places the homes about 500 metres from Woodbrook DART station and near the 24-hour E1 bus route. The wider development is planned to include a crèche, primary-school site, and neighbourhood centre. This hub will keep the official project page linked as details change.',
    publishedOn: '2026-09-05',
    sourceName: 'Land Development Agency',
    sourceUrl: 'https://lda.ie/projects/woodbrook-shankill',
    sourceReviewedOn: '2026-09-05',
    imagePath: '/images/shankill-coast.jpg',
    imageAlt: 'View from Killiney Hill over Shankill Beach towards Bray',
    imageCredit: 'Barrowbob, Wikimedia Commons',
    imageCreditUrl:
      'https://commons.wikimedia.org/wiki/File:Killiney_Hill_-_view_towards_Bray.jpg',
    featured: false,
  },
  {
    title: 'Shanganagh Castle Estate reaches occupation stage',
    slug: 'shanganagh-castle-estate-occupation',
    kind: 'community',
    summary:
      'The neighbouring 597-home public development is moving from completion into occupation, adding new residents and shared amenities beside Shanganagh Park.',
    body: 'The LDA describes Shanganagh Castle Estate as 597 homes delivered with Dún Laoghaire–Rathdown County Council. The mix includes affordable-purchase, cost-rental, and social homes, along with a crèche, café, community facilities, green space, and play areas. Its proximity to Woodbrook makes transport, parks, schools, and local services shared neighbourhood priorities.',
    publishedOn: '2026-09-05',
    sourceName: 'Land Development Agency',
    sourceUrl: 'https://lda.ie/projects/shanganagh-castle-estate',
    sourceReviewedOn: '2026-09-05',
    imagePath: '/images/shankill-village.jpg',
    imageAlt: 'Shankill village main street',
    imageCredit: 'sarah777, CC BY-SA 2.0',
    imageCreditUrl:
      'https://commons.wikimedia.org/wiki/File:Shankill,_County_Dublin_-_geograph.org.uk_-_1812269.jpg',
    featured: false,
  },
];

export const projects = [
  {
    title: 'Woodbrook DART station',
    slug: 'woodbrook-dart-station',
    category: 'transport',
    stage: 'completed',
    summary:
      'A fully accessible DART station serving Woodbrook and Shanganagh, opened in August 2025.',
    details:
      'The station is open and operating between Shankill and Bray. The community focus now shifts to safe walking and cycling connections, passenger information, and how surrounding streets work as the neighbourhood grows.',
    updatedOn: '2026-09-05',
    nextStep:
      'Monitor pedestrian and cycling access as nearby homes are occupied.',
    sourceName: 'Iarnród Éireann',
    sourceUrl:
      'https://www.irishrail.ie/en-ie/news/minister-opens-woodbrook-station',
    sourceReviewedOn: '2026-09-05',
    imagePath: '/images/woodbrook-station.jpg',
    imageAlt: 'Woodbrook DART station and platforms',
    imageCredit: 'William Murphy (infomatique), CC BY-SA 4.0',
    imageCreditUrl:
      'https://commons.wikimedia.org/wiki/File:Woodbrook_Train_Station,_Oct_2025_44.jpg',
    featured: true,
  },
  {
    title: 'Woodbrook housing delivery',
    slug: 'woodbrook-housing-delivery',
    category: 'housing',
    stage: 'active',
    summary:
      'Track the LDA and Castlethorn delivery of 328 A-rated apartments and promised neighbourhood amenities.',
    details:
      'The official project page lists 328 apartments under construction, comprising 102 one-bedroom and 226 two-bedroom homes. It also references a crèche, primary-school site, and neighbourhood centre in the wider Woodbrook development.',
    updatedOn: '2026-09-05',
    nextStep: 'Expected completion of the LDA homes in early 2027.',
    sourceName: 'Land Development Agency',
    sourceUrl: 'https://lda.ie/projects/woodbrook-shankill',
    sourceReviewedOn: '2026-09-05',
    imagePath: '/images/shankill-coast.jpg',
    imageAlt: 'The Shankill coastline viewed towards Bray',
    imageCredit: 'Barrowbob, Wikimedia Commons',
    imageCreditUrl:
      'https://commons.wikimedia.org/wiki/File:Killiney_Hill_-_view_towards_Bray.jpg',
    featured: true,
  },
  {
    title: 'Shanganagh Park improvements',
    slug: 'shanganagh-park-improvements',
    category: 'parks',
    stage: 'monitoring',
    summary:
      'Follow council plans for more accessible paths, expanded woodland, recreation, play, and park access.',
    details:
      'Dún Laoghaire–Rathdown County Council’s published masterplan material proposes 4.8 km of surfaced paths, increased woodland, new recreation facilities, natural play areas, and accessibility improvements. Timelines and delivered scope should always be checked against the latest council material.',
    updatedOn: '2026-09-05',
    nextStep: 'Watch for updated council delivery notices and consultations.',
    sourceName: 'Dún Laoghaire–Rathdown County Council',
    sourceUrl:
      'https://www.dlrcoco.ie/sites/default/files/atoms/files/4._shanganagh_information_sessions_-_information_boards.pdf',
    sourceReviewedOn: '2026-09-05',
    imagePath: '/images/shankill-coast.jpg',
    imageAlt: 'Shankill Beach and the coast towards Bray',
    imageCredit: 'Barrowbob, Wikimedia Commons',
    imageCreditUrl:
      'https://commons.wikimedia.org/wiki/File:Killiney_Hill_-_view_towards_Bray.jpg',
    featured: false,
  },
];

export const events = [
  {
    title: 'DLR household hazardous waste collection day',
    slug: 'dlr-household-hazardous-waste-day-2026',
    summary:
      'MyWaste lists a Dún Laoghaire–Rathdown collection day for household hazardous waste. Venue details are still to be confirmed by the organiser.',
    startsAt: '2026-10-17T08:00:00.000Z',
    endsAt: '2026-10-17T16:00:00.000Z',
    location: 'Dún Laoghaire–Rathdown — venue to be confirmed',
    bookingUrl:
      'https://mywaste.ie/sustainability/hazardous-household-waste/collection-days/',
    sourceUrl:
      'https://mywaste.ie/sustainability/hazardous-household-waste/collection-days/',
    sourceReviewedOn: '2026-09-05',
  },
];

export const surveys = [
  {
    title: 'Woodbrook DART Gateway consultation archive',
    slug: 'woodbrook-dart-gateway-consultation-2026',
    stage: 'closed',
    summary:
      'The council’s 2026 public consultation concerned a proposed 359-apartment development at Woodbrook DART Gateway. The stated response period closed on 24 July 2026.',
    opensOn: '2026-06-26',
    closesOn: '2026-07-24',
    responseUrl: 'https://dlrcoco.citizenspace.com/',
    sourceName: 'Dún Laoghaire–Rathdown County Council',
    sourceUrl:
      'https://www.linkedin.com/posts/d%C3%BAn-laoghaire-rathdown-county-council_public-consultation-proposed-development-activity-7472977633782366210-zJsD',
    sourceReviewedOn: '2026-09-05',
  },
];

export const resources = [
  {
    title: 'TFI journey planner',
    category: 'transport',
    serviceType: 'Journey planning',
    providerType: 'public-service',
    description:
      'Plan DART, bus, Luas, walking, and cycling journeys using current timetable information.',
    url: 'https://www.transportforireland.ie/plan-a-journey/',
    outOfHours: false,
    details: [{ label: 'Coverage', value: 'Public transport across Ireland' }],
    displayOrder: 10,
    sourceName: 'Transport for Ireland',
    sourceUrl: 'https://www.transportforireland.ie/plan-a-journey/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'BusConnects E-Spine',
    category: 'transport',
    serviceType: 'Bus information',
    providerType: 'public-service',
    description:
      'Official route information for the 24-hour E1 service between Northwood, the city centre, and Bray/Ballywaltrim.',
    url: 'https://www.transportforireland.ie/getting-around/by-bus/phase-6a-e-spine/',
    outOfHours: false,
    details: [{ label: 'Local service', value: 'E1 via Shankill' }],
    displayOrder: 20,
    sourceName: 'Transport for Ireland',
    sourceUrl:
      'https://www.transportforireland.ie/getting-around/by-bus/phase-6a-e-spine/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Dún Laoghaire–Rathdown County Council',
    category: 'council',
    serviceType: 'Council services',
    providerType: 'public-service',
    description:
      'Council services, consultations, planning information, parks, roads, and customer care.',
    url: 'https://www.dlrcoco.ie/',
    phone: '01 205 4700',
    email: 'info@dlrcoco.ie',
    outOfHours: false,
    details: [{ label: 'Coverage', value: 'Dún Laoghaire–Rathdown' }],
    displayOrder: 30,
    sourceName: 'Dún Laoghaire–Rathdown County Council',
    sourceUrl: 'https://www.dlrcoco.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Shankill Library',
    category: 'community',
    serviceType: 'Public library',
    providerType: 'public-service',
    description:
      'The local public library on Library Road. Check the library service for current opening hours and events.',
    url: 'https://libraries.dlrcoco.ie/',
    phone: '01 282 3081',
    email: 'shankilllib@dlrcoco.ie',
    outOfHours: false,
    details: [{ label: 'Address', value: 'Library Road, Shankill' }],
    displayOrder: 40,
    sourceName: 'Dún Laoghaire–Rathdown Libraries',
    sourceUrl: 'https://libraries.dlrcoco.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'MyWaste Ireland',
    category: 'waste',
    serviceType: 'Waste guidance',
    providerType: 'public-service',
    description:
      'Official guidance for household waste, recycling, bring centres, and special collection days.',
    url: 'https://mywaste.ie/',
    outOfHours: false,
    details: [{ label: 'Coverage', value: 'Ireland' }],
    displayOrder: 50,
    sourceName: 'MyWaste Ireland',
    sourceUrl: 'https://mywaste.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Shankill Family Practice',
    category: 'health',
    serviceType: 'GP practice',
    providerType: 'business',
    description:
      'A full-service GP surgery offering appointments with GPs and practice nurses.',
    url: 'https://www.shankillfamilypractice.ie/',
    phone: '01 272 0475',
    email: 'reception@shankillfamilypractice.ie',
    outOfHours: false,
    details: [
      {
        label: 'Address',
        value: 'Corbawn Medical Centre, Corbawn Lane, Shankill, D18 C2DH',
      },
      {
        label: 'Opening hours',
        value: 'Monday–Thursday 9am–1pm and 2pm–6pm; Friday until 5pm',
      },
      { label: 'Accessibility', value: 'Wheelchair accessible' },
    ],
    displayOrder: 60,
    sourceName: 'Shankill Family Practice',
    sourceUrl: 'https://www.shankillfamilypractice.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Shankill Pharmacy',
    category: 'health',
    serviceType: 'Pharmacy',
    providerType: 'business',
    description:
      'Local pharmacy providing prescriptions, vaccinations, medication advice, and common pharmacy services.',
    url: 'https://www.shankillpharmacy.ie/',
    phone: '01 282 3263',
    email: 'shankillpharmacyshop@gmail.com',
    outOfHours: false,
    details: [
      {
        label: 'Address',
        value: 'Violet House, Main Street, Shankill, D18 P2Y3',
      },
      {
        label: 'Opening hours',
        value: 'Monday–Friday 8:30am–6:30pm; Saturday 9:30am–6pm',
      },
    ],
    displayOrder: 70,
    sourceName: 'Shankill Pharmacy',
    sourceUrl: 'https://www.shankillpharmacy.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Shankill Village Dental',
    category: 'health',
    serviceType: 'Dentist',
    providerType: 'business',
    description:
      'General, cosmetic, and restorative dental care in Shankill Village.',
    url: 'https://www.shankillvillagedental.ie/',
    phone: '01 272 1864',
    email: 'shankillvillagedental@gmail.com',
    outOfHours: false,
    details: [
      {
        label: 'Address',
        value: 'Violet House, Main Street, Shankill, D18 V9W4',
      },
      {
        label: 'Opening hours',
        value: 'Monday–Thursday 9am–5pm; Friday 9am–1pm',
      },
    ],
    displayOrder: 80,
    sourceName: 'Shankill Village Dental',
    sourceUrl: 'https://www.shankillvillagedental.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Plumbers Dublin — Shankill',
    category: 'trades',
    serviceType: 'Plumber',
    providerType: 'business',
    description:
      'Plumbing repairs, drain unblocking, appliance plumbing, pumps, and bathroom fixtures in Shankill.',
    url: 'https://plumbers-dublin.ie/plumber-shankill/',
    phone: '01 284 4921',
    outOfHours: false,
    details: [{ label: 'Service area', value: 'Shankill and Dublin' }],
    displayOrder: 90,
    sourceName: 'Plumbers Dublin',
    sourceUrl: 'https://plumbers-dublin.ie/plumber-shankill/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Dublin Electrical Services',
    category: 'trades',
    serviceType: 'Electrician',
    providerType: 'business',
    description:
      'Residential and commercial electrical work, including rewiring, sockets, lighting, and installations.',
    url: 'https://www.dublinelectricalservices.ie/',
    phone: '086 369 7855',
    email: 'dublinelectricalservices@gmail.com',
    outOfHours: false,
    details: [
      { label: 'Service area', value: 'Greater Dublin' },
      { label: 'Base', value: 'Ballybrack' },
    ],
    displayOrder: 100,
    sourceName: 'Dublin Electrical Services',
    sourceUrl: 'https://www.dublinelectricalservices.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Conway Locksmiths',
    category: 'trades',
    serviceType: 'Locksmith',
    providerType: 'business',
    description:
      'Residential and commercial lock opening, repairs, upgrades, key cutting, and security services.',
    url: 'https://www.conwaylocksmiths.ie/',
    phone: '086 898 5489',
    email: 'info@conwaylocksmiths.ie',
    outOfHours: true,
    details: [
      {
        label: 'Address',
        value: '51 Rathsallagh Park, Shankill, D18 C535',
      },
      { label: 'Service area', value: 'South Dublin and Wicklow' },
      { label: 'Licence', value: 'PSA licence 10489' },
    ],
    displayOrder: 110,
    sourceName: 'Conway Locksmiths',
    sourceUrl: 'https://www.conwaylocksmiths.ie/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Drain Fix Services',
    category: 'trades',
    serviceType: 'Drainage',
    providerType: 'business',
    description:
      'Drain cleaning and unblocking services, with a separate emergency contact available around the clock.',
    url: 'https://www.drainfix.ie/contact',
    phone: '01 239 3479',
    email: 'drainfix247@gmail.com',
    outOfHours: true,
    details: [
      { label: 'Base', value: 'Shankill, Dublin 18' },
      { label: '24/7 contact', value: '086 077 8578' },
    ],
    displayOrder: 120,
    sourceName: 'Drain Fix Services',
    sourceUrl: 'https://www.drainfix.ie/contact',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'The Bottom Line',
    category: 'professional',
    serviceType: 'Accountancy',
    providerType: 'business',
    description:
      'A Shankill-based forensic accountancy and banking consultancy practice.',
    url: 'https://thebottomline.ie/about-us/',
    phone: '01 272 2206',
    email: 'info@thebottomline.ie',
    outOfHours: false,
    details: [
      {
        label: 'Address',
        value: '1st Floor, 7 Corbawn Court, Shankill, D18 K280',
      },
    ],
    displayOrder: 130,
    sourceName: 'The Bottom Line',
    sourceUrl: 'https://thebottomline.ie/about-us/',
    sourceReviewedOn: '2026-09-07',
  },
  {
    title: 'Emergency services',
    category: 'safety',
    serviceType: 'Emergency response',
    providerType: 'public-service',
    description:
      'For an immediate threat to life, health, property, or the environment, contact Ireland’s emergency services.',
    url: 'https://www.gov.ie/en/department-of-the-taoiseach/publications/how-to-contact-emergency-services-in-ireland/',
    phone: '112',
    outOfHours: true,
    details: [{ label: 'Alternative number', value: '999' }],
    displayOrder: 900,
    sourceName: 'Government of Ireland',
    sourceUrl:
      'https://www.gov.ie/en/department-of-the-taoiseach/publications/how-to-contact-emergency-services-in-ireland/',
    sourceReviewedOn: '2026-09-07',
  },
];
