export type ValuePillarIconKey =
  | 'compass'
  | 'users'
  | 'flask'
  | 'book-open'
  | 'trophy'
  | 'briefcase';

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
