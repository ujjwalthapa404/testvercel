export interface AdvisoryCommitteeMember {
  id: string;
  fullName: string;
  advisoryRole: string;
  institutionalAffiliation?: string;
  qualifications?: string;
  focusArea?: string;
  shortBio?: string;
  portraitSrc?: string;
  portraitAlt?: string;
  portraitObjectPosition?: string;
  sortOrder: number;
}

export interface AdvisoryMandatePillar {
  indexLabel: string;
  title: string;
  description: string;
}

export interface AdvisoryDomainItem {
  indexLabel: string;
  domain: string;
  scope: string;
}

export const ADVISORY_PAGE_COPY = {
  kicker: 'CAPITOL HILL COLLEGE · Institutional Consultation',
  pageName: 'Advisory Committee',
  mainHeading: 'Advisory Committee',
  supportingHeading: 'Academic Guidance, Strategic Perspective & Institutional Excellence',
  introduction:
    'The Advisory Committee of CAPITOL HILL COLLEGE provides independent academic perspective, curriculum relevance guidance, and strategic counsel to the Board of Directors and Executive Leadership across our NEB Higher Secondary (+2) and Tribhuvan University degree programs.',
  rosterSectionKicker: 'Institutional Advisory Roster',
  rosterSectionHeading: 'Advisory Committee Members',
  rosterSectionIntro:
    'Distinguished educators, subject specialists, and institutional advisors appointed in consultation with the Board of Directors to support long-term academic quality and student outcomes.',
} as const;

export const ADVISORY_MANDATE_PILLARS: AdvisoryMandatePillar[] = [
  {
    indexLabel: '01',
    title: 'Academic Quality & Curriculum Relevance',
    description:
      'Advising academic leadership on pedagogy, laboratory modernization, research culture, and instructional alignment across +2 Science, +2 Management, +2 Humanities, +2 Law (NEB), BBS, and MBS (Tribhuvan University).',
  },
  {
    indexLabel: '02',
    title: 'Higher Education & Career Pathways',
    description:
      'Strengthening bridges between classroom learning, university progression, professional readiness, and global academic opportunities for Capitol Hill College graduates.',
  },
  {
    indexLabel: '03',
    title: 'Institutional Strategy & Community Engagement',
    description:
      'Supporting ethical governance, quality benchmarks, scholarship outreach, and constructive engagement with parents, alumni, and academic institutions in Nepal and abroad.',
  },
];

export const ADVISORY_DOMAINS: AdvisoryDomainItem[] = [
  {
    indexLabel: '01',
    domain: 'Sciences & Laboratory Standards',
    scope: 'Physics, Chemistry, Biology, Mathematics, and Computer Science instructional quality.',
  },
  {
    indexLabel: '02',
    domain: 'Business, Management & Research',
    scope: 'NEB +2 Management, TU Bachelor of Business Studies (BBS), and Master of Business Studies (MBS).',
  },
  {
    indexLabel: '03',
    domain: 'Humanities, Law & Civic Education',
    scope: 'Social sciences, legal studies, communication, and holistic student development.',
  },
];

/**
 * Official Advisory Committee Roster.
 *
 * IMPORTANT FOR ADMINISTRATORS / DEVELOPERS:
 * Do NOT add unverified or placeholder names. Append verified committee members here
 * once officially confirmed by the Board of Directors and College Administration.
 * `AdvisoryCommitteePage` automatically switches from the institutional roster notice
 * to full profile cards as soon as verified entries are added to this array.
 */
export const ADVISORY_COMMITTEE_MEMBERS: AdvisoryCommitteeMember[] = [];
