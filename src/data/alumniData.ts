import {
  AlumniCtaContent,
  AlumniHeroContent,
  AlumniProfile,
  AlumniProgramFilterOption,
  CollegeValuePillar,
} from '../types/alumni';

/**
 * ============================================================================
 * CAPITOL HILL COLLEGE — ALUMNI PAGE DATA CONFIGURATION
 * ============================================================================
 * HOW TO REPLACE SAMPLE PLACEHOLDERS WITH OFFICIAL ALUMNI RECORDS:
 * 1. Place verified alumni portrait images inside `public/images/alumni/`
 *    (recommended aspect ratio: 4:3 or 1:1, minimum 800px wide, JPG/WebP).
 * 2. Update `ALUMNI_HERO_CONTENT.heroImage.src` with your official alumni group
 *    photograph (e.g., `'/images/alumni/alumni-cohort.jpg'`) and set
 *    `isPlaceholderAsset: false`.
 * 3. In `ALUMNI_PROFILES` below, replace each sample object's `fullName`,
 *    `initials`, `photoUrl` (e.g., `'/images/alumni/name.jpg'`), `photoAlt`,
 *    `graduationYear`, `programId`, `programCompleted`, `currentRole`,
 *    `currentOrganization` (omit if not confirmed), and `achievementSummary`.
 * 4. Change `isSamplePlaceholder: true` to `isSamplePlaceholder: false` on each
 *    verified profile. Once all profiles have `isSamplePlaceholder: false`, the
 *    sample placeholder notice banner automatically hides itself.
 * ============================================================================
 */

export const ALUMNI_PROGRAM_FILTERS: AlumniProgramFilterOption[] = [
  { id: 'all', label: 'All Programs', shortLabel: 'All' },
  { id: 'plus-two-science', label: '+2 Science', shortLabel: '+2 Science' },
  { id: 'plus-two-management', label: '+2 Management', shortLabel: '+2 Management' },
  { id: 'bbs', label: 'Bachelor of Business Studies (BBS)', shortLabel: 'BBS' },
];

export const ALUMNI_HERO_CONTENT: AlumniHeroContent = {
  breadcrumbParent: 'Home',
  breadcrumbCurrent: 'Student Voices & Achievements',
  eyebrow: 'Teku, Kathmandu · Student Voices & Academic Recognition',
  heading: 'Our Students, Our Pride',
  supportingHeading: 'Voices of Achievement. Stories of Inspiration.',
  introduction:
    'At Capitol Hill College, academic excellence goes hand in hand with independent thinking, practical learning, and the overall development of students. Across Grade XI, Grade XII, and competitive national examinations, our students discover their potential, test their knowledge in modern laboratories, and build the intellectual confidence required for higher education and real-world leadership.',
  primaryCtaLabel: 'Explore Student Stories',
  secondaryCtaLabel: 'Admission Enquiry',
  heroImage: {
    src: '/images/official/ca1.jpg',
    alt: 'Students and academic cohort gathered at CAPITOL HILL COLLEGE in Teku, Kathmandu',
    caption:
      'Student cohort and faculty gathered during an official CAPITOL HILL COLLEGE program at Teku, Kathmandu.',
    isPlaceholderAsset: false,
  },
};

export const ALUMNI_SECTION_HEADER = {
  eyebrow: 'Graduate Pathways & Directory',
  heading: 'Academic & Career Progression Across Our Streams',
  description:
    'Graduates from our +2 Science, +2 Management, and Bachelor of Business Studies (BBS) programs carry forward the habits of inquiry, discipline, and collaboration cultivated at our Teku campus.',
  placeholderBannerText: '',
} as const;

export interface GraduateStreamPathway {
  id: string;
  streamBadge: string;
  affiliation: string;
  title: string;
  summary: string;
  progressionAreas: string[];
}

export const GRADUATE_STREAM_PATHWAYS: GraduateStreamPathway[] = [
  {
    id: 'pathway-science',
    streamBadge: '+2 Science',
    affiliation: 'NEB Affiliation',
    title: 'Medicine, Engineering, Computing & Pure Sciences',
    summary:
      'Grounded in Physics, Chemistry, Biology, Mathematics, and Computer Science laboratory practicals, +2 Science graduates advance into competitive undergraduate degrees in Nepal and abroad.',
    progressionAreas: [
      'Medical, Dental, Nursing, Pharmacy & Allied Health Sciences',
      'Civil, Computer, Electrical & Mechanical Engineering, Architecture',
      'BSc CSIT, BIT, BCA, Pure Sciences & Technical Research',
    ],
  },
  {
    id: 'pathway-management',
    streamBadge: '+2 Management',
    affiliation: 'NEB Affiliation',
    title: 'Business Administration, Finance, IT & Hospitality',
    summary:
      'Through foundational coursework in Accounting, Economics, Business Studies, and Computer or Hotel Management practicals, +2 Management alumni step confidently into commerce and service degrees.',
    progressionAreas: [
      'Bachelor of Business Studies (BBS at Capitol Hill College), BBA & BBM',
      'Chartered Accountancy (CA / ACCA), Banking & Financial Studies',
      'BIM, BCA, Hotel Management (BHM) & Law (BALLB)',
    ],
  },
  {
    id: 'pathway-bbs',
    streamBadge: 'Bachelor of Business Studies (BBS)',
    affiliation: 'Tribhuvan University',
    title: 'Corporate Management, Banking, Public Service & Postgraduate Study',
    summary:
      'Completing four years of Tribhuvan University undergraduate business education equips BBS graduates for organizational roles, financial analysis, entrepreneurship, and master’s programs.',
    progressionAreas: [
      'Commercial Banking, Accounting, Auditing & Taxation Practice',
      'Corporate Operations, Entrepreneurship, NGOs/INGOs & Civil Service',
      'Master of Business Studies (MBS), MBA, MPA & Professional Credentials',
    ],
  },
];

/**
 * Verified Individual Alumni Directory.
 * Add verified graduate entries here once written publication consent, graduation cohort,
 * and role details are confirmed by Capitol Hill College Administration.
 * When populated, the filterable Alumni Profile Grid renders automatically.
 */
export const ALUMNI_PROFILES: AlumniProfile[] = [];

/**
 * Section D — Grounded strictly in verified Capitol Hill College campus facts
 * (Teku campus infrastructure, 45 faculty/staff across 15 departments, 5 specialized
 * subject laboratories, library & multimedia classrooms, and verified ECA/CCA events).
 */
export const ALUMNI_VALUES_HEADER = {
  eyebrow: 'Institutional Foundation',
  heading: 'Why Our Students Value Capitol Hill College',
  description:
    'Every academic program at our Teku, Kathmandu campus is structured around attentive instruction, practical inquiry, and balanced personal development.',
} as const;

export const COLLEGE_VALUE_PILLARS: CollegeValuePillar[] = [
  {
    id: 'supportive-environment',
    number: '01',
    iconKey: 'compass',
    title: 'Supportive Learning Environment',
    description:
      'A calm, disciplined academic setting in Teku, Kathmandu where naturally ventilated classrooms, multimedia teaching aids, and respectful campus culture help students stay focused each day.',
    campusEvidence: 'Teku Academic Block · Audio-Visual Classrooms',
  },
  {
    id: 'experienced-guidance',
    number: '02',
    iconKey: 'users',
    title: 'Experienced Academic Guidance',
    description:
      'Students learn directly from dedicated educators and academic coordinators who provide approachable mentoring, regular academic feedback, and structured exam preparation.',
    campusEvidence: '15 Academic Departments · Dedicated Faculty & Staff',
  },
  {
    id: 'practical-learning',
    number: '03',
    iconKey: 'flask',
    title: 'Practical Learning Opportunities',
    description:
      'Classroom theory is reinforced through supervised practical sessions across dedicated Physics, Chemistry, Biology, Computer Science, and Hotel Management laboratories.',
    campusEvidence: '5 Subject Laboratories · Hands-On Practicals',
  },
  {
    id: 'academic-development',
    number: '04',
    iconKey: 'book-open',
    title: 'Academic Development',
    description:
      'Affiliated with NEB for +2 Science and +2 Management and Tribhuvan University for BBS, our curriculum emphasizes conceptual clarity, independent library study, and analytical rigor.',
    campusEvidence: 'NEB & TU Curricula · Campus Reference Library',
  },
  {
    id: 'student-participation',
    number: '05',
    iconKey: 'trophy',
    title: 'Student Participation & Extracurricular Activities',
    description:
      'Co-curricular and extracurricular programs — including inter-class quiz competitions, sports events, educational tours, and orientation and farewell gatherings — build teamwork and confidence.',
    campusEvidence: 'ECA & CCA · Quizzes, Sports & Educational Tours',
  },
  {
    id: 'personal-professional-growth',
    number: '06',
    iconKey: 'briefcase',
    title: 'Personal & Professional Growth',
    description:
      'By combining daily academic discipline, communication skills, and collaborative projects, Capitol Hill College prepares graduates to step responsibly into university studies and careers.',
    campusEvidence: 'Holistic Readiness · Higher Study & Career Preparation',
  },
];

export const ALUMNI_CTA_CONTENT: AlumniCtaContent = {
  eyebrow: 'Capitol Hill Alumni Network',
  heading: 'Once a Part of Capitol Hill, Always a Part of Our Community.',
  description:
    'Did you complete your +2 or undergraduate studies at Capitol Hill College? We warmly invite our graduates to reconnect with the campus, share higher-education or career milestones, and inspire current students preparing for their next chapter.',
  primaryActionLabel: 'Send Enquiry or Message',
  secondaryEmailLabel: 'Email Alumni Office',
  officialEmail: 'info.capitolhillcollege@gmail.com',
  officialPhone: '01-5312399',
  officialPhoneHref: 'tel:015312399',
  campusLocation: 'Teku, Kathmandu, Nepal',
  administrationNote:
    'Alumni updates shared via email or campus enquiry are reviewed by college administration prior to publication.',
};
