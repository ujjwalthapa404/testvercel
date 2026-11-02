/**
 * Centralized Institutional Leadership & Governance Data
 * Capitol Hill College — Teku, Kathmandu, Nepal
 *
 * HOW TO ADD ANOTHER BOARD MEMBER:
 * Append a new `LeadershipMemberProfile` object to `BOARD_OF_DIRECTORS` below
 * with `category: 'board'`, place their portrait image inside `public/images/leadership/`,
 * and set `portraitSrc: '/images/leadership/<filename>.jpg'`.
 *
 * HOW TO ADD AN EXECUTIVE LEADER (e.g., Principal, Vice-Principal, Academic Dean):
 * Append a new `LeadershipMemberProfile` object to `EXECUTIVE_LEADERSHIP` below
 * with `category: 'executive'`. Once `EXECUTIVE_LEADERSHIP` has one or more entries,
 * the Executive Leadership section automatically renders clickable profile cards
 * connected to the shared `LeadershipProfileModal`.
 */

export type LeadershipCategory = 'board' | 'executive';

export interface LeadershipMemberProfile {
  /** Unique URL-safe slug identifier (e.g., 'pawan-bista') */
  id: string;
  /** Full formal name displayed on the card and modal header */
  fullName: string;
  /** Concise institutional title shown on the profile card */
  designation: string;
  /** Pipe-separated or formal role line displayed in the profile modal header */
  modalRoleLine: string;
  /** Optional executive specialization line shown under the modal role line */
  professionalTagline?: string;
  /** Section assignment: 'board' or 'executive' */
  category: LeadershipCategory;
  /** Marks the Chairman or presiding officer for prominent editorial framing */
  isFeaturedChair?: boolean;
  /** Path to portrait image under `public/` (e.g., '/images/leadership/pawan-bista.jpg') */
  portraitSrc?: string;
  /** Accessible alt description for the portrait */
  portraitAlt: string;
  /** Optional CSS object-position override (defaults to 'center top') */
  portraitObjectPosition?: string;
  /** Concise 1-2 sentence institutional overview shown in featured Chairman layout */
  cardOverview?: string;
  /** Primary biographical paragraphs ('Leadership Profile' in modal) */
  leadershipProfile: string[];
  /** Formal institutional & corporate appointments ('Professional Leadership' in modal) */
  professionalLeadership?: string[];
  /** Key areas of strategic focus ('Core Strengths' in modal) */
  coreStrengths?: string[];
  /** Academic degrees, honorary doctorates & certifications ('Qualifications & Professional Recognition') */
  qualificationsAndRecognition?: string[];
  /** Civic, cultural & entrepreneurial contributions ('Community & Entrepreneurial Engagement') */
  communityAndEngagement?: string[];
  /** Optional institutional milestones or academic achievements for future profiles */
  achievements?: string[];
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
  kicker: 'Institutional Governance · Teku, Kathmandu',
  mainHeading: 'Leadership & Governance',
  supportingHeading: 'Meet the Leaders Behind Capitol Hill College',
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
    upcomingNoticeTitle: 'Verified Executive Profiles Scheduled for Publication',
    upcomingNoticeBody:
      'Official biographical dossiers and portraits for the Principal, Vice-Principal, and senior academic officers are currently undergoing formal verification with the College Administration Office and will be published in this section.',
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
    designation: 'Chairman, Capitol Hill College',
    modalRoleLine: 'Chairman | Capitol Hill College',
    professionalTagline: 'Education Entrepreneur • International Education Strategist',
    category: 'board',
    isFeaturedChair: true,
    portraitSrc: '/images/leadership/pawan-bista.jpg',
    portraitAlt: 'Mr. Pawan Bista, Chairman of Capitol Hill College',
    portraitObjectPosition: 'center 15%',
    cardOverview:
      'Education entrepreneur and international education consultant with more than two decades of experience in higher education counseling, institutional partnerships, and student mobility.',
    leadershipProfile: [
      'Pawan Bista is an education entrepreneur and international education consultant with more than two decades of experience in higher education counseling, institutional partnerships and student mobility. As Chairman of Capitol Hill College, he brings a global perspective to academic leadership, student opportunity and institutional development.',
    ],
    professionalLeadership: [
      'Chairman — Capitol Hill College, Kathmandu, Nepal.',
      'Founder & Managing Director — Bradford Global Education Consultancy, Nepal (est. 2006).',
      'Vice President, South & Southeast Asia — Enrollment Advisory Group (EAG), USA.',
      'Vice President & Trustee — Nepalese Association of Northern California (NANC).',
      'President — ApplyGlobal USA.',
    ],
    coreStrengths: [
      'Educational leadership and institutional development.',
      'International university partnerships.',
      'Ethical student recruitment and admissions.',
      'Student success and academic pathways.',
      'Cross-border collaboration.',
    ],
    qualificationsAndRecognition: [
      'Honorary Doctorate in Business Administration — Lincoln University, Oakland, California (2024).',
      'ICEF Trained Agent Counselor (ITAC).',
      'Qualified International Education Agent Counselor — University of Central Oklahoma.',
      'Canada Course Graduate (CCG).',
    ],
    communityAndEngagement: [
      'His work extends to diaspora community initiatives, cultural engagement, entrepreneurship and investment. He is also a producer of the Nepali feature film BALIDAN and an independent recording artist.',
    ],
    sortOrder: 1,
  },
];

/**
 * Verified Executive Leadership Profiles
 * Add Principal, Vice-Principal, and senior institutional leaders here as verified profiles are finalized.
 */
export const EXECUTIVE_LEADERSHIP: LeadershipMemberProfile[] = [
  /*
   * Example structure when adding an Executive Leader:
   * {
   *   id: 'principal-name',
   *   fullName: 'Prof. Full Name',
   *   designation: 'Principal, Capitol Hill College',
   *   modalRoleLine: 'Principal | Capitol Hill College',
   *   professionalTagline: 'Academic Administration • Curriculum Leadership',
   *   category: 'executive',
   *   portraitSrc: '/images/leadership/principal-name.jpg',
   *   portraitAlt: 'Prof. Full Name, Principal of Capitol Hill College',
   *   leadershipProfile: ['Verified biography paragraph...'],
   *   professionalLeadership: ['Principal — Capitol Hill College, Kathmandu, Nepal.'],
   *   qualificationsAndRecognition: ['Verified degree and institution...'],
   *   sortOrder: 1,
   * }
   */
];

/**
 * Institutional Executive Structure displayed while individual executive biographies are pending publication.
 * Contains zero fabricated personal names or photographs.
 */
export const EXECUTIVE_OFFICES_FRAMEWORK: ExecutiveOfficeSlot[] = [
  {
    officeTitle: 'Office of the Principal — Mr. Toya Nath Adhikari',
    scopeSummary:
      'Chief academic and administrative officer responsible for institutional standards, faculty leadership, academic calendar execution, and regulatory coordination with NEB and Tribhuvan University.',
    statusNote: 'Full Biographical Dossier Pending Release',
  },
  {
    officeTitle: 'Office of the Vice-Principal — Mr. Sagar Raj Khanal',
    scopeSummary:
      'Oversees daily academic operations, student discipline and welfare, internal examinations, co-curricular programming, and departmental coordination across campus.',
    statusNote: 'Full Biographical Dossier Pending Release',
  },
  {
    officeTitle: 'Academic & Program Coordination',
    scopeSummary:
      'Leads curriculum delivery, laboratory standards, and student academic mentorship across 15 academic departments serving +2 Science, +2 Management, and Bachelor of Business Studies (BBS) streams.',
    statusNote: 'Directory Available Under Team Member',
  },
];
