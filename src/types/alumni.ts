export type AlumniProgramFilterId =
  | 'all'
  | 'plus-two-science'
  | 'plus-two-management'
  | 'bbs';

export type ValuePillarIconKey =
  | 'compass'
  | 'users'
  | 'flask'
  | 'book-open'
  | 'trophy'
  | 'briefcase';

export interface AlumniProgramFilterOption {
  id: AlumniProgramFilterId;
  label: string;
  shortLabel: string;
}

export interface AlumniHeroImageConfig {
  /** Local path (e.g. '/images/alumni/hero-cohort.jpg') or verified campus media URL */
  src: string;
  alt: string;
  caption: string;
  /** Set to false once replaced with a dedicated official alumni group photograph */
  isPlaceholderAsset: boolean;
}

export interface AlumniHeroContent {
  breadcrumbParent: string;
  breadcrumbCurrent: string;
  eyebrow: string;
  heading: string;
  supportingHeading: string;
  introduction: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  heroImage: AlumniHeroImageConfig;
}

export interface AlumniProfile {
  id: string;
  /** Replace with verified graduate's full name */
  fullName: string;
  /** Monogram fallback when photoUrl is omitted or fails to load */
  initials: string;
  /** Optional path to verified alumni portrait (e.g. '/images/alumni/grad-01.jpg') */
  photoUrl?: string;
  photoAlt: string;
  /** Graduation or completion year (e.g. '2023' or 'Graduating Cohort — Pending Verification') */
  graduationYear: string;
  /** Filter identifier matching AlumniProgramFilterId */
  programId: Exclude<AlumniProgramFilterId, 'all'>;
  /** Display name of completed Capitol Hill College program */
  programCompleted: string;
  /** Current occupation, degree track, or professional role */
  currentRole: string;
  /** Optional confirmed organization or university; leave undefined if unconfirmed */
  currentOrganization?: string;
  /** Concise verified summary of academic or professional progression */
  achievementSummary: string;
  /** Keep true for sample records; set to false once verified by college administration */
  isSamplePlaceholder: boolean;
}

export interface StudentTestimonial {
  id: string;
  /** Replace with verified student or graduate name */
  studentName: string;
  initials: string;
  /** Optional path to verified student portrait (e.g. '/images/testimonials/student-01.jpg') */
  photoUrl?: string;
  photoAlt: string;
  /** Filter identifier matching AlumniProgramFilterId */
  programId: Exclude<AlumniProgramFilterId, 'all'>;
  /** Academic program studied at Capitol Hill College */
  academicProgram: string;
  /** Graduation year (e.g. 'Class of 2023') or current status (e.g. 'Current BBS Student') */
  academicStatus: string;
  /** Direct quotation from the student or graduate */
  quotation: string;
  /** Keep true for sample entries; set to false once signed/approved student quotes are added */
  isSamplePlaceholder: boolean;
}

export interface CollegeValuePillar {
  id: string;
  number: string;
  iconKey: ValuePillarIconKey;
  title: string;
  description: string;
  campusEvidence: string;
}

export interface AlumniCtaContent {
  eyebrow: string;
  heading: string;
  description: string;
  primaryActionLabel: string;
  secondaryEmailLabel: string;
  officialEmail: string;
  officialPhone: string;
  officialPhoneHref: string;
  campusLocation: string;
  administrationNote: string;
}
