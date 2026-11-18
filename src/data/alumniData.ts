import { AlumniCtaContent, CollegeValuePillar } from '../types/alumni';

/**
 * Grounded strictly in verified Capitol Hill College campus facts
 * (Teku campus infrastructure, faculty across 15 departments, 5 specialized
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
