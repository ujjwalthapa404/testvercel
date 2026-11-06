import { StudentTestimonial } from '../types/alumni';

/**
 * ============================================================================
 * CAPITOL HILL COLLEGE — VERIFIED STUDENT TESTIMONIALS & RECOGNITIONS
 * ============================================================================
 * Official verified student achievements and testimonials for Capitol Hill College,
 * Teku, Kathmandu. Preserves exact names, achievements, and quotations.
 * ============================================================================
 */

export const TESTIMONIALS_SECTION_HEADER = {
  eyebrow: 'Student Voices & Achievements',
  heading: 'Reflections From Our Academic Community',
  description:
    'Capitol Hill College celebrates academic excellence and character development across +2 Science and +2 Management programs. Read authentic reflections from our high-achieving students.',
  placeholderNotice: '',
} as const;

/**
 * Verified Student Testimonials from Grade XI, Grade XII, Board Toppers, and Entrance Scholars.
 */
export const STUDENT_TESTIMONIALS: StudentTestimonial[] = [
  {
    id: 'anjali-sharma',
    studentName: 'Anjali Sharma',
    initials: 'AS',
    photoAlt: 'Anjali Sharma, Science XII Topper at Capitol Hill College',
    programId: 'plus-two-science',
    academicProgram: '+2 Science',
    academicStatus: 'Science XII Topper',
    quotation:
      'Education differs from learning. CHC prioritizes effective learning experiences and offers diverse programs tailored to student needs, helping them explore career paths and make informed decisions.',
    isSamplePlaceholder: false,
  },
  {
    id: 'pritam-gautam',
    studentName: 'Pritam Gautam',
    initials: 'PG',
    photoAlt: 'Pritam Gautam, Management XI Topper at Capitol Hill College',
    programId: 'plus-two-management',
    academicProgram: '+2 Management',
    academicStatus: 'Management XI Topper',
    quotation:
      'Joining CHC was the right choice. It helped me showcase my talents and gain recognition. CHC blends academic excellence with real-world skills.',
    isSamplePlaceholder: false,
  },
  {
    id: 'nisha-dhungana',
    studentName: 'Nisha Dhungana',
    initials: 'ND',
    photoAlt: 'Nisha Dhungana, Management XII Topper at Capitol Hill College',
    programId: 'plus-two-management',
    academicProgram: '+2 Management',
    academicStatus: 'Management XII Topper',
    quotation:
      'CHC fosters a collaborative environment with strong community support, helping students grow through shared learning and expert guidance.',
    isSamplePlaceholder: false,
  },
  {
    id: 'jasmine-shakya',
    studentName: 'Jasmine Shakya',
    initials: 'JS',
    photoAlt: 'Jasmine Shakya, Board Topper 3.90 GPA at Capitol Hill College',
    programId: 'plus-two-management',
    academicProgram: 'Board Honors',
    academicStatus: 'Board Topper 3.90 GPA',
    quotation:
      'CHC helps students focus on goals, build independence, and develop cognitive skills necessary for real-world success and higher education.',
    isSamplePlaceholder: false,
  },
  {
    id: 'tirtha-raj-chaulagain',
    studentName: 'Tirtha Raj Chaulagain',
    initials: 'TC',
    photoAlt: 'Tirtha Raj Chaulagain, MECEE Scholar 2081 at Capitol Hill College',
    programId: 'plus-two-science',
    academicProgram: 'Medical Entrance Honors',
    academicStatus: 'MECEE Scholar 2081',
    quotation:
      'CHC delivers a transformative experience combining knowledge, skills, and emotional support to ensure student success and well-being.',
    isSamplePlaceholder: false,
  },
  {
    id: 'prativa-poudel',
    studentName: 'Prativa Poudel',
    initials: 'PP',
    photoAlt: 'Prativa Poudel, Science XI Topper at Capitol Hill College',
    programId: 'plus-two-science',
    academicProgram: '+2 Science',
    academicStatus: 'Science XI Topper',
    quotation:
      'CHC College, known for its strong academic programs and commitment to excellence, nurtures my intellectual curiosity and knowledge. The environment encourages questioning, exploring, and innovating, aligning perfectly with my learning desire. Choosing CHC has been one of my best decisions.',
    isSamplePlaceholder: false,
  },
  {
    id: 'sandeep-rijal',
    studentName: 'Sandeep Rijal',
    initials: 'SR',
    photoAlt: 'Sandeep Rijal, Management XI Topper at Capitol Hill College',
    programId: 'plus-two-management',
    academicProgram: '+2 Management',
    academicStatus: 'Management XI Topper',
    quotation:
      'CHC doesn’t just seem like a place for people to collect credits. It helps develop worldview and helps students figure out what they want to do in life while encouraging independent thinking.',
    isSamplePlaceholder: false,
  },
];
