/**
 * ============================================================================
 * CAPITOL HILL COLLEGE — STUDENT VOICES & ACHIEVEMENTS DATA
 * ============================================================================
 * Official verified student achievements and testimonials for Capitol Hill College,
 * Teku, Kathmandu. Preserves exact names, achievements, and testimonials
 * provided by the college administration without modification or embellishment.
 * ============================================================================
 */

export type StudentStreamCategory = 'all' | 'science' | 'management' | 'board-scholar';

export interface StudentStory {
  id: string;
  studentName: string;
  initials: string;
  achievement: string;
  streamCategory: Exclude<StudentStreamCategory, 'all'>;
  streamBadge: string;
  testimonial: string;
  photoUrl?: string;
  photoAlt?: string;
}

export interface StudentFilterOption {
  id: StudentStreamCategory;
  label: string;
  shortLabel: string;
}

export const STUDENT_FILTER_OPTIONS: StudentFilterOption[] = [
  { id: 'all', label: 'All Student Voices', shortLabel: 'All Voices (7)' },
  { id: 'board-scholar', label: 'Board Toppers & Scholars', shortLabel: 'Board & Scholar (2)' },
  { id: 'science', label: 'Science Stream', shortLabel: 'Science (2)' },
  { id: 'management', label: 'Management Stream', shortLabel: 'Management (3)' },
];

/**
 * Verified student profiles and authentic testimonials.
 * Names, achievements, and quotations are recorded verbatim as provided.
 */
export const STUDENT_STORIES: StudentStory[] = [
  {
    id: 'anjali-sharma',
    studentName: 'Anjali Sharma',
    initials: 'AS',
    achievement: 'Science XII Topper',
    streamCategory: 'science',
    streamBadge: '+2 Science',
    testimonial:
      'Education differs from learning. CHC prioritizes effective learning experiences and offers diverse programs tailored to student needs, helping them explore career paths and make informed decisions.',
  },
  {
    id: 'pritam-gautam',
    studentName: 'Pritam Gautam',
    initials: 'PG',
    achievement: 'Management XI Topper',
    streamCategory: 'management',
    streamBadge: '+2 Management',
    testimonial:
      'Joining CHC was the right choice. It helped me showcase my talents and gain recognition. CHC blends academic excellence with real-world skills.',
  },
  {
    id: 'nisha-dhungana',
    studentName: 'Nisha Dhungana',
    initials: 'ND',
    achievement: 'Management XII Topper',
    streamCategory: 'management',
    streamBadge: '+2 Management',
    testimonial:
      'CHC fosters a collaborative environment with strong community support, helping students grow through shared learning and expert guidance.',
  },
  {
    id: 'jasmine-shakya',
    studentName: 'Jasmine Shakya',
    initials: 'JS',
    achievement: 'Board Topper 3.90 GPA',
    streamCategory: 'board-scholar',
    streamBadge: 'National Board Honors',
    testimonial:
      'CHC helps students focus on goals, build independence, and develop cognitive skills necessary for real-world success and higher education.',
  },
  {
    id: 'tirtha-raj-chaulagain',
    studentName: 'Tirtha Raj Chaulagain',
    initials: 'TC',
    achievement: 'MECEE Scholar 2081',
    streamCategory: 'board-scholar',
    streamBadge: 'Medical Entrance Scholar',
    testimonial:
      'CHC delivers a transformative experience combining knowledge, skills, and emotional support to ensure student success and well-being.',
  },
  {
    id: 'prativa-poudel',
    studentName: 'Prativa Poudel',
    initials: 'PP',
    achievement: 'Science XI Topper',
    streamCategory: 'science',
    streamBadge: '+2 Science',
    testimonial:
      'CHC College, known for its strong academic programs and commitment to excellence, nurtures my intellectual curiosity and knowledge. The environment encourages questioning, exploring, and innovating, aligning perfectly with my learning desire. Choosing CHC has been one of my best decisions.',
  },
  {
    id: 'sandeep-rijal',
    studentName: 'Sandeep Rijal',
    initials: 'SR',
    achievement: 'Management XI Topper',
    streamCategory: 'management',
    streamBadge: '+2 Management',
    testimonial:
      'CHC doesn’t just seem like a place for people to collect credits. It helps develop worldview and helps students figure out what they want to do in life while encouraging independent thinking.',
  },
];

export const STUDENT_VOICES_HERO_CONTENT = {
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
  },
  highlights: [
    { label: 'Total Featured Voices', value: '7 Students' },
    { label: 'Academic Streams', value: '+2 Science & Management' },
    { label: 'Competitive Excellence', value: 'Board Topper & MECEE Scholar' },
  ],
} as const;

export const STUDENT_STORIES_SECTION_HEADER = {
  eyebrow: 'Student Testimonials & Recognitions',
  heading: 'Authentic Experiences from Our Academic Community',
  description:
    'Read first-hand reflections from Capitol Hill College students who achieved academic distinction across Science and Management streams, national board examinations, and competitive medical entrance exams.',
} as const;
