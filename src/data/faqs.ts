import { FaqCategory, FaqEntry, NoticeStatus } from '../types/notice';

/**
 * Starter FAQs based on verified Capitol Hill College information.
 * Administrators can seed and customize these directly via the Admin Dashboard.
 */
export const SAMPLE_FAQS: FaqEntry[] = [
  {
    id: 'faq-programs-offered',
    question: 'Which academic programs are offered at Capitol Hill College?',
    answer:
      'Capitol Hill College offers National Examinations Board (NEB) Higher Secondary (+2) programs in +2 Management, +2 Humanities, +2 Science, and +2 Law, along with Tribhuvan University (TU) affiliated degree programs: Bachelor of Business Studies (BBS) and Master of Business Studies (MBS).',
    category: FaqCategory.ACADEMICS,
    status: NoticeStatus.PUBLISHED,
    sortOrder: 10,
  },
  {
    id: 'faq-campus-location',
    question: 'Where is Capitol Hill College located and how can I visit for counseling?',
    answer:
      'Capitol Hill College is located in Teku, Kathmandu, Nepal. Prospective students and guardians can visit the Admissions Desk during regular college hours (Sunday through Friday), view our exact campus pin via the Google Maps link in the footer, or call 01-5312399 prior to visiting.',
    category: FaqCategory.CAMPUS,
    status: NoticeStatus.PUBLISHED,
    sortOrder: 20,
  },
  {
    id: 'faq-admission-documents',
    question: 'What documents are required when applying for +2, BBS, or MBS admission?',
    answer:
      'Applicants should bring copies of their academic transcripts and character certificates from their previous institution, recent passport-sized photographs, and a completed application form. Specific stream or university entrance eligibility requirements are confirmed during academic counseling.',
    category: FaqCategory.ADMISSIONS,
    status: NoticeStatus.PUBLISHED,
    sortOrder: 30,
  },
  {
    id: 'faq-online-enquiry',
    question: 'How can I submit an admission enquiry online?',
    answer:
      'Click "Apply for Admission" or "Request Admission Information" anywhere on the website to open our Contact & Admission Enquiry page, where you can send a structured enquiry directly to our Admissions Desk, email info.capitolhillcollege@gmail.com, or call 01-5312399.',
    category: FaqCategory.ADMISSIONS,
    status: NoticeStatus.PUBLISHED,
    sortOrder: 40,
  },
  {
    id: 'faq-exam-notices',
    question: 'Where are examination schedules, admit card instructions, and results published?',
    answer:
      'All official examination routines, terminal assessment updates, and result notifications are published on the Notices & Announcements page, where you can filter notices by "Examinations" or "Results" and download notice summaries.',
    category: FaqCategory.EXAMINATIONS,
    status: NoticeStatus.PUBLISHED,
    sortOrder: 50,
  },
  {
    id: 'faq-official-contact',
    question: 'How do I contact the college administration for general enquiries?',
    answer:
      'You can reach the Capitol Hill College administration office by telephone at 01-5312399 or by email at info.capitolhillcollege@gmail.com.',
    category: FaqCategory.GENERAL,
    status: NoticeStatus.PUBLISHED,
    sortOrder: 60,
  },
];
