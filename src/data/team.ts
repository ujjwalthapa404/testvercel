import { ALL_LEADERSHIP_PROFILES } from './leadershipData';

export type AcademicStreamId =
  | 'all'
  | 'sciences'
  | 'business'
  | 'humanities-law'
  | 'computing-resources';

export type DepartmentIconKey =
  | 'book-open'
  | 'calculator'
  | 'trending-up'
  | 'sigma'
  | 'briefcase'
  | 'monitor'
  | 'feather'
  | 'atom'
  | 'flask'
  | 'microscope'
  | 'scale'
  | 'radio'
  | 'globe'
  | 'landmark'
  | 'library';

export interface LeadershipMember {
  id: string;
  name: string;
  designation: string;
  tier: 'senior' | 'board';
  portraitUrl?: string;
  portraitObjectPosition?: string;
  portraitVerificationNote?: string;
  qualificationLine?: string;
  summaryOverview?: string;
  sortOrder: number;
}

export interface FacultyMemberEntry {
  id: string;
  name: string;
  roleNote?: string;
  portraitUrl?: string;
}

export interface AcademicDepartment {
  id: string;
  name: string;
  stream: Exclude<AcademicStreamId, 'all'>;
  iconKey: DepartmentIconKey;
  members: FacultyMemberEntry[];
  sortOrder: number;
}

export interface GeneralStaffMember {
  id: string;
  name: string;
  portraitUrl?: string;
  sortOrder: number;
}

export const ACADEMIC_STREAMS: { id: AcademicStreamId; label: string }[] = [
  { id: 'all', label: 'All Departments' },
  { id: 'sciences', label: 'Sciences' },
  { id: 'business', label: 'Business & Finance' },
  { id: 'humanities-law', label: 'Languages, Law & Media' },
  { id: 'computing-resources', label: 'Math, Tech & Library' },
];

export const TEAM_HERO_CONTENT = {
  breadcrumbParent: 'Home',
  breadcrumbCurrent: 'Team Member',
  heading: 'Academic & Professional Team',
  supportingText: 'Meet our dedicated faculty and staff committed to excellence.',
  introStatement:
    'Our dedicated and highly qualified team serve as exemplary role models.',
  campusBackdropUrl: '/images/official/building.png',
  campusBackdropAlt:
    'CAPITOL HILL COLLEGE academic building in Teku, Kathmandu',
} as const;

export const LEADERSHIP_SECTION_COPY = {
  heading: 'Executive & Academic Leadership',
  subheading: 'Senior Leadership',
  supportingText:
    'Chairman, CEO & Director, and Principal guiding institutional governance, strategic vision, and daily academic standards at Capitol Hill College.',
} as const;

export const FACULTY_SECTION_COPY = {
  heading: 'Our Faculty',
  subheading: 'Professional Members',
  supportingText: 'Dedicated educators committed to student success.',
} as const;

export const GENERAL_STAFF_SECTION_COPY = {
  heading: 'General Staff',
  supportingText:
    'Administrative and operational staff supporting daily campus life at Capitol Hill College.',
} as const;

export const TEAM_CTA_COPY = {
  heading: 'Want to Know More About Us?',
  supportingText:
    'Discover Capitol Hill College, our academic programs, facilities, and commitment to student success.',
  primaryLabel: 'Explore Academic Programs',
  secondaryLabel: 'Contact Us',
} as const;

/**
 * Verified Executive & Senior Academic Leadership.
 * Derived directly from canonical `ALL_LEADERSHIP_PROFILES` in `./leadershipData.ts`
 * so senior leader names, titles, and portraits share a single source of truth.
 */
export const LEADERSHIP_MEMBERS: LeadershipMember[] = ALL_LEADERSHIP_PROFILES.map(
  (member, index) => ({
    id: `lead-${member.id}`,
    name: member.fullName,
    designation: member.shortDesignation,
    tier: 'senior',
    portraitUrl: member.portraitSrc,
    portraitObjectPosition: member.portraitObjectPosition,
    qualificationLine: member.academicDistinction?.formattedLine,
    summaryOverview: member.cardOverview,
    sortOrder: index + 1,
  })
);

/**
 * Complete Academic & Resource Departments (15 departments, 45 faculty listings).
 * Names, titles, and department assignments are preserved verbatim from the official source list.
 * Individuals holding both leadership and teaching roles remain listed in both places without merging.
 */
export const FACULTY_DEPARTMENTS: AcademicDepartment[] = [
  {
    id: 'dept-english',
    name: 'English',
    stream: 'humanities-law',
    iconKey: 'book-open',
    sortOrder: 1,
    members: [
      { id: 'fac-english-1', name: 'Ms. Anita Sharma' },
      { id: 'fac-english-2', name: 'Mr. Krishna Raj Sharma' },
      { id: 'fac-english-3', name: 'Ms. Nabina Maharjan' },
    ],
  },
  {
    id: 'dept-accounting',
    name: 'Accounting / Tax & Auditing',
    stream: 'business',
    iconKey: 'calculator',
    sortOrder: 2,
    members: [
      { id: 'fac-acc-1', name: 'Ms. Rashma Thapa Magar' },
      { id: 'fac-acc-2', name: 'Mr. Janar Maharjan' },
      { id: 'fac-acc-3', name: 'Mr. Roshan Bhatta' },
      { id: 'fac-acc-4', name: 'Mr. Aakash Shrestha' },
      { id: 'fac-acc-5', name: 'Mr. Bibek Adhikari' },
    ],
  },
  {
    id: 'dept-economics',
    name: 'Economics',
    stream: 'business',
    iconKey: 'trending-up',
    sortOrder: 3,
    members: [
      { id: 'fac-econ-1', name: 'Mr. Toya Natha Adhikari' },
      { id: 'fac-econ-2', name: 'Mr. Sajeev Shrestha' },
    ],
  },
  {
    id: 'dept-mathematics',
    name: 'Mathematics',
    stream: 'computing-resources',
    iconKey: 'sigma',
    sortOrder: 4,
    members: [
      { id: 'fac-math-1', name: 'Mr. Ramesh Gautam' },
      { id: 'fac-math-2', name: 'Mr. Tara Pd. Bhattarai' },
      { id: 'fac-math-3', name: 'Mr. Krishna Raj Joshi' },
    ],
  },
  {
    id: 'dept-hrm-marketing-business',
    name: 'HRM / Marketing / Business Studies',
    stream: 'business',
    iconKey: 'briefcase',
    sortOrder: 5,
    members: [
      { id: 'fac-hrm-1', name: 'Mr. Dadhiram Neupane' },
      { id: 'fac-hrm-2', name: 'Ms. Prabina Pokharel' },
      { id: 'fac-hrm-3', name: 'Mr. Basanta Karki' },
    ],
  },
  {
    id: 'dept-hm-tt-computer',
    name: 'HM / TT / Computer',
    stream: 'computing-resources',
    iconKey: 'monitor',
    sortOrder: 6,
    members: [
      { id: 'fac-hm-1', name: 'Mr. Prabin Bista' },
      { id: 'fac-hm-2', name: 'Mr. Raju Tamang' },
      { id: 'fac-hm-3', name: 'Mr. Mahesh Sapkota' },
      { id: 'fac-hm-4', name: 'Mr. Sanjan Giri' },
    ],
  },
  {
    id: 'dept-nepali',
    name: 'Nepali',
    stream: 'humanities-law',
    iconKey: 'feather',
    sortOrder: 7,
    members: [
      {
        id: 'fac-nep-1',
        name: 'Mr. Bhola Nath Regmi',
        portraitUrl: '/images/official/bholo.jpg',
      },
      { id: 'fac-nep-2', name: 'Ms. Rekha Pawan' },
    ],
  },
  {
    id: 'dept-physics',
    name: 'Physics',
    stream: 'sciences',
    iconKey: 'atom',
    sortOrder: 8,
    members: [
      {
        id: 'fac-phy-1',
        name: 'Mr. Sagar Raj Khanal',
        portraitUrl: '/images/leadership/sagar-raj-khanal.png',
      },
      { id: 'fac-phy-2', name: 'Sushant Pokhrel' },
      { id: 'fac-phy-3', name: 'Mr. Indra Pd. Chapagain' },
    ],
  },
  {
    id: 'dept-chemistry',
    name: 'Chemistry',
    stream: 'sciences',
    iconKey: 'flask',
    sortOrder: 9,
    members: [
      {
        id: 'fac-chem-1',
        name: 'Dr. Tej Narayan Poudel',
        portraitUrl: '/images/official/tej.jpg',
      },
      { id: 'fac-chem-2', name: 'Dr. D.R. Paudel' },
      { id: 'fac-chem-3', name: 'Mr. Basanta Aidi' },
    ],
  },
  {
    id: 'dept-biology',
    name: 'Biology',
    stream: 'sciences',
    iconKey: 'microscope',
    sortOrder: 10,
    members: [
      { id: 'fac-bio-1', name: 'Ms. Anita Khatri' },
      { id: 'fac-bio-2', name: 'Ms. Sanju Gyawali' },
    ],
  },
  {
    id: 'dept-law',
    name: 'Law',
    stream: 'humanities-law',
    iconKey: 'scale',
    sortOrder: 11,
    members: [
      { id: 'fac-law-1', name: 'Mr. Dipak Khanal' },
      { id: 'fac-law-2', name: 'Ms. Priya Lamichhane' },
    ],
  },
  {
    id: 'dept-mass-comm',
    name: 'Mass Communication',
    stream: 'humanities-law',
    iconKey: 'radio',
    sortOrder: 12,
    members: [
      { id: 'fac-mc-1', name: 'Mr. Shree Ram Poudel' },
      { id: 'fac-mc-2', name: 'Mr. Sujan Regmi' },
    ],
  },
  {
    id: 'dept-social-studies',
    name: 'Social Studies',
    stream: 'humanities-law',
    iconKey: 'globe',
    sortOrder: 13,
    members: [
      {
        id: 'fac-soc-1',
        name: 'Mr. Kedar Raj Khanal',
        roleNote: 'Co-ordinator',
      },
    ],
  },
  {
    id: 'dept-finance',
    name: 'Finance',
    stream: 'business',
    iconKey: 'landmark',
    sortOrder: 14,
    members: [{ id: 'fac-fin-1', name: 'Mrs. Resma Thapa Magar' }],
  },
  {
    id: 'dept-acc-lab-library',
    name: 'ACC / Lab Library',
    stream: 'computing-resources',
    iconKey: 'library',
    sortOrder: 15,
    members: [
      { id: 'fac-lib-1', name: 'Mr. Mahesh Bhattarai' },
      { id: 'fac-lib-2', name: 'Ms. Ashmita Bajgain' },
      { id: 'fac-lib-3', name: 'Ms. Tara Rijal' },
      { id: 'fac-lib-4', name: 'Mr. Sarju Manandhar' },
      { id: 'fac-lib-5', name: 'Ms. Karuna Magar' },
      { id: 'fac-lib-6', name: 'Mr. Arjun Mahato' },
      { id: 'fac-lib-7', name: 'Mr. Arjun Sharma' },
      { id: 'fac-lib-8', name: 'Ms. Prabesika Bhandari' },
      { id: 'fac-lib-9', name: 'Ms. Asmita Karki' },
    ],
  },
];

/**
 * Complete General Staff list (5 members).
 * No titles, departments, or responsibilities have been invented beyond supplied names.
 */
export const GENERAL_STAFF_MEMBERS: GeneralStaffMember[] = [
  { id: 'staff-1', name: 'Mr. Rajan Shrestha', sortOrder: 1 },
  { id: 'staff-2', name: 'Mr. Shree Krishna Shrestha', sortOrder: 2 },
  { id: 'staff-3', name: 'Ms. Somati Jimba', sortOrder: 3 },
  { id: 'staff-4', name: 'Ms. Sabina Shrestha', sortOrder: 4 },
  { id: 'staff-5', name: 'Ms. Sunita Paudeni', sortOrder: 5 },
];

/**
 * Extracts up to two clean initials from a person's name after stripping honorifics
 * (e.g., "Mr. Pawan Bista" -> "PB", "Dr. Tej Narayan Poudel" -> "TP", "Sushant Pokhrel" -> "SP").
 */
export function getPersonInitials(fullName: string): string {
  const withoutHonorific = fullName
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, '')
    .trim();
  const parts = withoutHonorific
    .split(/\s+/)
    .map((p) => p.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);

  if (parts.length === 0) return 'CH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
