import { StudentTestimonial } from '../types/alumni';

/**
 * ============================================================================
 * CAPITOL HILL COLLEGE — STUDENT & GRADUATE TESTIMONIALS DATA
 * ============================================================================
 * HOW TO REPLACE SAMPLE TESTIMONIALS WITH GENUINE APPROVED QUOTES:
 * 1. Place verified student/graduate portrait photos in `public/images/testimonials/`
 *    (recommended aspect ratio: 1:1 square, minimum 400x400px, JPG/WebP).
 * 2. Replace each entry's `studentName`, `initials`, `photoUrl`, `photoAlt`,
 *    `programId`, `academicProgram`, `academicStatus`, and `quotation` with
 *    authentic statements approved by the student and college administration.
 * 3. Change `isSamplePlaceholder: true` to `isSamplePlaceholder: false`.
 *    Once all entries are marked `false`, sample placeholder notices will
 *    automatically disappear from the UI.
 * ============================================================================
 */

export const TESTIMONIALS_SECTION_HEADER = {
  eyebrow: 'Student & Graduate Perspectives',
  heading: 'Reflections From Our Academic Community',
  description:
    'Capitol Hill College publishes authentic reflections from students and alumni across +2 Science, +2 Management, and Bachelor of Business Studies (BBS) following direct administrative verification.',
  placeholderNotice: '',
} as const;

/**
 * Verified Student & Graduate Testimonials.
 * Add signed, student-approved testimonials here once verified by Capitol Hill College Administration.
 * When populated, the interactive testimonial spotlight and overview grid render automatically.
 */
export const STUDENT_TESTIMONIALS: StudentTestimonial[] = [];
