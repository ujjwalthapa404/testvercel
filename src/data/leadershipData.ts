/**
 * Canonical Institutional Leadership, Governance & Official Messages Data
 * Capitol Hill College — Teku, Kathmandu, Nepal
 *
 * SINGLE SOURCE OF TRUTH:
 * Every senior leader's biographical dossier, portrait path, credentials, and official
 * institutional message (where applicable) is maintained strictly in this module.
 * Homepage message sections, the Leadership & Governance page, and the Team Member
 * directory all derive directly from `BOARD_OF_DIRECTORS` and `EXECUTIVE_LEADERSHIP`.
 */

export type LeadershipCategory = 'board' | 'executive';

export interface AcademicDistinction {
  /** Formal distinction label (e.g., 'Honorary Doctorate') */
  degreeTitle: string;
  /** Conferring institution and location (e.g., 'Lincoln University, California, USA') */
  conferringInstitution: string;
  /** Year conferred (e.g., '2024') */
  year: string;
  /** Canonical formatted distinction string */
  formattedLine: string;
}

export interface LeadershipMessageSubsection {
  subheading: string;
  paragraphs: string[];
}

export interface OfficialLeadershipMessage {
  id: string;
  sectionKicker: string;
  sectionHeading: string;
  campusLocationLine: string;
  /** Optional concise verified institutional highlights shown beneath the portrait nameplate */
  institutionalHighlights?: string[];
  salutation: string;
  openingParagraphs: string[];
  subsections?: LeadershipMessageSubsection[];
  closingPhrase: string;
}

export interface LeadershipMemberProfile {
  /** Unique URL-safe slug identifier (e.g., 'pawan-bista') */
  id: string;
  /** Full formal name displayed on cards, modals, and message sign-offs */
  fullName: string;
  /** Concise role title (e.g., 'Chairman', 'CEO & Director', 'Principal') */
  shortDesignation: string;
  /** Formal institutional title shown on leadership cards */
  designation: string;
  /** Pipe-separated formal role line displayed in the profile modal header */
  modalRoleLine: string;
  /** Optional executive specialization line shown under the modal role line */
  professionalTagline?: string;
  /** Concise institutional scope line shown in compact directory overviews */
  homepageSummaryRole: string;
  /** Formal institutional office kicker displayed on horizontal leadership cards */
  officeKicker?: string;
  /** Section assignment: 'board' or 'executive' */
  category: LeadershipCategory;
  /** Marks the Chairman or presiding officer for prominent editorial framing */
  isFeaturedChair?: boolean;
  /** Path to portrait image under `public/` */
  portraitSrc?: string;
  /** Accessible alt description for the portrait */
  portraitAlt: string;
  /** Optional CSS object-position override (defaults to 'center top') */
  portraitObjectPosition?: string;
  /** True ONLY for transparent-background portrait cutouts (renders on subtle neutral studio ground) */
  isCutoutPortrait?: boolean;
  /** Optional featured academic distinction highlighted with refined institutional typography */
  academicDistinction?: AcademicDistinction;
  /** Concise 1-2 sentence institutional introduction shown on the Leadership page */
  cardOverview?: string;
  /** Primary biographical paragraphs ('Leadership Profile' in modal) */
  leadershipProfile: string[];
  /** Formal institutional & governance appointments ('Professional Leadership' in modal) */
  professionalLeadership?: string[];
  /** Key areas of strategic focus ('Core Strengths' in modal) */
  coreStrengths?: string[];
  /** Academic degrees, honorary doctorates & recognition ('Qualifications & Academic Recognition') */
  qualificationsAndRecognition?: string[];
  /** Optional institutional milestones or academic achievements */
  achievements?: string[];
  /** Canonical verbatim official message from this leader, if published */
  officialMessage?: OfficialLeadershipMessage;
  /** Display order within its section (ascending) */
  sortOrder: number;
}

export interface GovernancePillar {
  indexLabel: string;
  title: string;
  description: string;
}

export interface ExecutiveOfficeSlot {
  officeTitle: string;
  scopeSummary: string;
  statusNote: string;
}

export const LEADERSHIP_PAGE_COPY = {
  pageName: 'Leadership & Governance',
  kicker: 'CAPITOL HILL COLLEGE · Institutional Governance',
  mainHeading: 'Leadership & Governance',
  supportingHeading: 'Meet the Leaders Behind CAPITOL HILL COLLEGE',
  introduction:
    'Capitol Hill College is guided by an institutional governance framework dedicated to academic rigor, ethical stewardship, and long-term student success. Working in alignment with National Examinations Board (NEB) and Tribhuvan University (TU) academic standards, our leadership shapes strategic direction, international perspective, and campus development in Teku, Kathmandu.',
  boardSection: {
    kicker: 'Governing Body',
    title: 'Board of Directors',
    description:
      'The Board of Directors provides overarching institutional governance, strategic vision, fiduciary oversight, and long-term policy direction for Capitol Hill College.',
    publicationNote:
      'Verified biographical profiles of additional Board Directors are published upon formal institutional release by the Office of the Board.',
  },
  executiveSection: {
    kicker: 'Academic & Administrative Stewardship',
    title: 'Executive Leadership',
    description:
      'Executive Leadership oversees day-to-day academic administration, curriculum delivery, faculty development, student welfare, and institutional quality assurance across all +2 and undergraduate programs.',
  },
};

export const GOVERNANCE_PILLARS: GovernancePillar[] = [
  {
    indexLabel: '01',
    title: 'Strategic & Institutional Direction',
    description:
      'Establishing multi-year academic priorities, infrastructure investment, and international educational outlook while upholding national accreditation standards.',
  },
  {
    indexLabel: '02',
    title: 'Academic Quality & Integrity',
    description:
      'Supporting disciplined teaching, laboratory and library advancement, and transparent evaluation across NEB (+2 Science & Management) and TU (BBS) programs.',
  },
  {
    indexLabel: '03',
    title: 'Student Pathways & Global Readiness',
    description:
      'Connecting classroom rigor in Kathmandu with ethical higher-education guidance, career readiness, and broader academic opportunities.',
  },
];

/**
 * Verified Board of Directors Profiles
 * Strictly populated with verified institutional data only.
 */
export const BOARD_OF_DIRECTORS: LeadershipMemberProfile[] = [
  {
    id: 'pawan-bista',
    fullName: 'Mr. Pawan Bista',
    shortDesignation: 'Chairman',
    designation: 'Chairman, CAPITOL HILL COLLEGE',
    modalRoleLine: 'Chairman | CAPITOL HILL COLLEGE',
    professionalTagline: 'Institutional Governance • International Higher Education Leadership',
    homepageSummaryRole: 'Board Chairmanship & Strategic Direction',
    officeKicker: 'Office of the Chairman · Board of Directors',
    category: 'board',
    isFeaturedChair: true,
    portraitSrc: '/images/leadership/pawan-bista.jpg',
    portraitAlt: 'Mr. Pawan Bista, Chairman of Capitol Hill College',
    portraitObjectPosition: 'center 15%',
    academicDistinction: {
      degreeTitle: 'Honorary Doctorate',
      conferringInstitution: 'Lincoln University, California, USA',
      year: '2024',
      formattedLine: 'Honorary Doctorate – Lincoln University, California, USA (2024)',
    },
    cardOverview:
      'Institutional leader and recipient of an Honorary Doctorate from Lincoln University, California, USA (2024), bringing more than two decades of higher education leadership, international university partnerships, and strategic governance to Capitol Hill College.',
    leadershipProfile: [
      'Mr. Pawan Bista brings more than two decades of experience in higher education leadership, international institutional partnerships, and student academic development. In 2024, he was awarded an Honorary Doctorate by Lincoln University, California, USA, in recognition of his significant contributions to higher education governance, international student pathways, and institutional development. As Chairman of Capitol Hill College, he guides the institution’s long-term strategic direction with a global perspective focused on academic quality, ethical governance, and meaningful scholarly opportunities for students in Nepal.',
    ],
    professionalLeadership: [
      'Chairman — Capitol Hill College, Kathmandu, Nepal.',
      'Vice President, South & Southeast Asia — Enrollment Advisory Group (EAG), USA.',
      'Vice President & Trustee — Nepalese Association of Northern California (NANC).',
    ],
    coreStrengths: [
      'Educational leadership and institutional development.',
      'International university collaboration and partnerships.',
      'Student success and higher-education academic pathways.',
      'Cross-border academic collaboration and governance.',
    ],
    qualificationsAndRecognition: [
      'Honorary Doctorate — Lincoln University, California, USA (2024).',
    ],
    sortOrder: 1,
  },
  {
    id: 'nischal-gautam',
    fullName: 'Mr. Nischal Gautam',
    shortDesignation: 'CEO & Director',
    designation: 'CEO & Director, CAPITOL HILL COLLEGE',
    modalRoleLine: 'CEO & Director | CAPITOL HILL COLLEGE',
    professionalTagline: 'Executive Governance • Financial Scholarship • Academic Leadership',
    homepageSummaryRole: 'Executive Governance & Institutional Strategy',
    officeKicker: 'Office of the CEO & Director · Board of Directors',
    category: 'board',
    portraitSrc: '/assets/aistudio/Ceo_and_director_e2a88a5e.jpeg',
    portraitAlt: 'Mr. Nischal Gautam, CEO & Director of Capitol Hill College',
    portraitObjectPosition: 'center top',
    academicDistinction: {
      degreeTitle: 'MBA Finance',
      conferringInstitution: 'Pokhara University',
      year: '2022',
      formattedLine: 'MBA Finance – Pokhara University Topper',
    },
    cardOverview:
      'As Chief Executive Officer and Director of CAPITOL HILL COLLEGE, Mr. Nischal Gautam leads executive governance, institutional strategy, and academic-industry alignment. He works closely with the Board and faculty to advance the college’s institutional vision through strong academic standards, purposeful student mentorship, and a supportive campus environment.',
    leadershipProfile: [
      'Mr. Nischal Gautam serves as Chief Executive Officer and Director of Capitol Hill College, leading executive governance, institutional strategy, and academic-industry alignment at the Teku, Kathmandu campus.',
      'An alumnus of Capitol Hill College (+2 Management, 2012–2014 batch, stream highest scorer) and MBA Finance – Pokhara University Topper (2022 AD, University Dean’s List), he brings four years of higher-education finance teaching and program coordination alongside senior corporate leadership experience.',
    ],
    professionalLeadership: [
      'Chief Executive Officer (CEO) & Director — Capitol Hill College, Teku, Kathmandu.',
      'Former Faculty Member of Finance (Bachelor’s & Master’s levels) and Program Coordinator (four years in the academic sector).',
      'Former Group General Manager and Head of Employee — Techno Biomed and its group companies.',
    ],
    qualificationsAndRecognition: [
      'MBA Finance – Pokhara University Topper (2022 AD; University Dean’s List).',
      '+2 Management — Capitol Hill College (2012–2014 Batch; Stream Highest Scorer).',
    ],
    coreStrengths: [
      'Institutional governance and modern industry alignment.',
      'Financial scholarship and academic administration.',
      'Student mentorship, pastoral care, and career readiness.',
    ],
    officialMessage: {
      id: 'ceo-director-message',
      sectionKicker: 'Message from the CEO & Directors · Executive Governance',
      sectionHeading: 'A Message from the CEO & Director',
      campusLocationLine: 'CAPITOL HILL COLLEGE, Teku, Kathmandu',
      institutionalHighlights: [
        'MBA Finance – Pokhara University Topper (2022 AD; University Dean’s List)',
        'Capitol Hill College Alumnus & Stream Highest Scorer (+2 Management, 2012–2014)',
      ],
      salutation: 'Welcome to Capitol Hill College.',
      openingParagraphs: [
        "Looking back at my own journey—from walking these very corridors as a +2 Management student in the 2012–2014 batch and graduating as the stream's highest scorer, to now returning to lead the institution as its Chief Executive Officer—fills me with a profound sense of pride and gratitude. Capitol Hill has always been far more than an academic institution to me; it is where my foundational understanding of leadership, discipline, and ambition was shaped.",
        'My educational pursuits further deepened my commitment to academic rigor. I went on to complete my MBA in Finance from Pokhara University, graduating as the MBA Finance – Pokhara University Topper for the year 2022 AD and earning a place on the prestigious University Dean’s List. Bridging theory with practice, I spent four years immersed in the academic sector as a faculty member of Finance for Bachelor’s and Master’s level students, as well as serving as a Program Coordinator. Additionally, I bring extensive corporate exposure from my tenure as Group General Manager and Head of Employee at Techno Biomed and its group companies. This unique blend of advanced financial scholarship, administrative experience, and corporate leadership allows me to steer Capitol Hill College with a dynamic perspective that directly aligns education with modern industry demands.',
      ],
      subsections: [
        {
          subheading: 'Our Legacy and Vision',
          paragraphs: [
            'Established in 2005 AD by a dedicated collective of academic experts and seasoned professionals, Capitol Hill College has spent over two decades building a formidable legacy of excellence. Today, our alumni stand tall as market leaders, innovators, and changemakers—not only within the nation but far beyond national boundaries.',
            "Managed under a private educational trust by a deeply professional, forward-thinking, and visionary team, we ensure that our institutional standards remain second to none. We understand that choosing a college is one of the most critical decisions in a student's life. That is why Capitol Hill is designed to be much more than a place of lectures and examinations.",
          ],
        },
        {
          subheading: 'A Home Away from Home',
          paragraphs: [
            'We pride ourselves on cultivating a comprehensive, nurturing ecosystem where students find trusted mentors, dedicated coaches, supportive guidance, and a warm, homely environment. We are present for our students in every aspect of their personal and professional development—ensuring that academic rigor is always matched with pastoral care and unwavering support.',
            'We invite you to place your trust in a leadership team and an institution that has proven its dedication for over twenty years. Welcome to Capitol Hill College, where your future is shaped with expertise, integrity, and genuine care.',
          ],
        },
      ],
      closingPhrase: 'Warm regards,',
    },
    sortOrder: 2,
  },
];

/**
 * Verified Executive Leadership Profiles
 */
export const EXECUTIVE_LEADERSHIP: LeadershipMemberProfile[] = [
  {
    id: 'sagar-raj-khanal',
    fullName: 'Mr. Sagar Raj Khanal',
    shortDesignation: 'Principal',
    designation: 'Principal, CAPITOL HILL COLLEGE',
    modalRoleLine: 'Principal | CAPITOL HILL COLLEGE',
    professionalTagline: 'Academic Leadership • Teaching Standards • Student Development',
    homepageSummaryRole: 'Academic Standards & Campus Administration',
    officeKicker: 'Office of the Principal · Academic Stewardship',
    category: 'executive',
    portraitSrc: '/images/leadership/sagar-raj-khanal.png',
    portraitAlt: 'Mr. Sagar Raj Khanal, Principal of Capitol Hill College',
    isCutoutPortrait: true,
    cardOverview:
      'As Principal of CAPITOL HILL COLLEGE, Mr. Sagar Raj Khanal oversees academic leadership, teaching standards, and holistic student development across campus. Working closely with faculty and academic departments, his office fosters a disciplined, supportive, and intellectually engaging learning environment across +2 Science, +2 Management, and undergraduate programs.',
    leadershipProfile: [
      'Mr. Sagar Raj Khanal serves as Principal of Capitol Hill College in Teku, Kathmandu, providing academic leadership across curriculum delivery, faculty coordination, teaching standards, and holistic student development in +2 Science, +2 Management, and undergraduate programs.',
      'Together with department faculty and administrative staff, his office upholds structured academic guidance, laboratory and classroom rigor, and a disciplined, supportive learning environment built in close partnership with students, parents, and guardians.',
    ],
    professionalLeadership: [
      'Principal — Capitol Hill College, Teku, Kathmandu, Nepal.',
      'Senior Faculty Member, Department of Physics — Capitol Hill College.',
    ],
    coreStrengths: [
      'Academic leadership and NEB / Tribhuvan University curriculum standards.',
      'Teaching quality, faculty coordination, and structured evaluation systems.',
      'Student development, supportive campus culture, and parent-guardian partnership.',
    ],
    officialMessage: {
      id: 'principal-message',
      sectionKicker: 'Office of the Principal · Academic Stewardship',
      sectionHeading: 'Message from the Principal',
      campusLocationLine: 'CAPITOL HILL COLLEGE, Teku, Kathmandu',
      salutation: 'Dear Prospective Students, Parents and Guardians,',
      openingParagraphs: [
        'It is a privilege to welcome you to Capitol Hill College in Teku, Kathmandu. Since our establishment in 2005, Capitol Hill College has remained steadfast in its commitment to delivering disciplined, practical, and forward-looking education grounded in strong academic values.',
        'At Capitol Hill College, we view education as a transformative journey that shapes character, critical inquiry, and lifelong responsibility alongside classroom achievement. Across our +2 Science, +2 Management, and undergraduate academic programs, our dedicated faculty members mentor students closely—combining structured academic guidance, laboratory and library learning, and co-curricular engagement.',
        'Meaningful student success is built through a trusted partnership among educators, learners, parents, and guardians. We invite you to visit our campus, engage with our academic community, and build a purposeful foundation for higher learning and future leadership with us.',
      ],
      closingPhrase: 'With best wishes,',
    },
    sortOrder: 1,
  },
];

/**
 * Combined canonical list of all senior leadership profiles in institutional order.
 */
export const ALL_LEADERSHIP_PROFILES: LeadershipMemberProfile[] = [
  ...BOARD_OF_DIRECTORS,
  ...EXECUTIVE_LEADERSHIP,
];

/**
 * Institutional Executive Structure reference slots.
 */
export const EXECUTIVE_OFFICES_FRAMEWORK: ExecutiveOfficeSlot[] = [
  {
    officeTitle: 'Office of the Principal — Mr. Sagar Raj Khanal',
    scopeSummary:
      'Chief academic and administrative officer responsible for institutional standards, faculty leadership, academic calendar execution, and regulatory coordination with NEB and Tribhuvan University.',
    statusNote: 'Active Institutional Office',
  },
  {
    officeTitle: 'Academic Administration & Student Welfare',
    scopeSummary:
      'Oversees daily academic operations, student discipline and pastoral support, internal examinations, and co-curricular programming across campus.',
    statusNote: 'Campus Administration Office',
  },
  {
    officeTitle: 'Academic & Program Coordination',
    scopeSummary:
      'Leads curriculum delivery, laboratory standards, and student academic mentorship across 15 academic departments serving +2 Science, +2 Management, and Bachelor of Business Studies (BBS) streams.',
    statusNote: 'Directory Available Under Team Member',
  },
];
