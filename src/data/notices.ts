import {
  NoticeCategory,
  NoticeItem,
  NoticePriority,
  NoticeStatus,
} from '../types/notice';

/**
 * Default Capitol Hill College institutional notices displayed when live Firestore notices have not yet been seeded.
 * Authorized college administrators can publish, edit, pin, or archive live notices from the Portal Dashboard.
 */
export const SAMPLE_NOTICES: NoticeItem[] = [
  {
    id: 'notice-admission-2024',
    title: 'Admission Open — +2 Science, +2 Management & BBS',
    slug: 'admission-open-science-management-bbs',
    excerpt:
      'Applications and academic counseling are open across +2 Science, +2 Management (NEB), and Bachelor of Business Studies (BBS, TU) at Capitol Hill College, Teku.',
    content: [
      'Capitol Hill College invites admission enquiries and applications from eligible students across +2 Science, +2 Management (National Examinations Board), and the four-year Bachelor of Business Studies (BBS, Tribhuvan University) program.',
      'Prospective students and guardians are welcome to visit the Admissions Desk at our Teku, Kathmandu campus between Sunday and Friday during regular college hours for stream counseling, laboratory and library orientation, and form submission.',
      'Applicants should bring copies of academic transcripts, character certificates, and recent passport-sized photographs. For current session intake dates and fee schedules, contact the college office at 01-5312399 or email info.capitolhillcollege@gmail.com.',
    ],
    category: NoticeCategory.ADMISSIONS,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.HIGH,
    isPinned: true,
    showInAnnouncementBar: true,
    publishedAt: '2026-10-20T09:00:00+05:45',
    expiresAt: '2027-06-30T17:00:00+05:45',
    authorName: 'Admissions Office',
    attachment: {
      id: 'att-admission-checklist',
      fileName: 'Capitol-Hill-Admission-Checklist.pdf',
      fileType: 'Admission Checklist Summary',
      fileSizeLabel: '12 KB',
    },
  },
  {
    id: 'notice-pre-board-schedule',
    title: 'Internal Assessment & Pre-Board Examination Guidelines (+2 Stream)',
    slug: 'internal-assessment-examination-routine',
    excerpt:
      'Departmental examination preparation guidelines and hall allocation instructions for Grade XI and Grade XII Science and Management students.',
    content: [
      'All +2 Science and +2 Management students are reminded that internal assessment and pre-board examinations are conducted in accordance with the Capitol Hill College academic calendar.',
      'Students must clear library obligations, collect their examination admit cards from the administration counter, and report to their designated examination halls 15 minutes prior to the scheduled start time. Detailed subject-wise timetables are posted on the campus notice board and updated via the Administration Portal.',
    ],
    category: NoticeCategory.EXAMINATIONS,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.HIGH,
    isPinned: true,
    showInAnnouncementBar: true,
    publishedAt: '2026-10-18T11:30:00+05:45',
    authorName: 'Examination Committee',
  },
  {
    id: 'notice-bbs-orientation',
    title: 'Academic Orientation for Incoming BBS First-Year Students',
    slug: 'bbs-first-year-orientation',
    excerpt:
      'Orientation briefing introducing Tribhuvan University BBS curriculum structure, faculty mentorship, and academic library resources.',
    content: [
      'Capitol Hill College conducts a structured academic orientation session for incoming Bachelor of Business Studies (BBS) students at the Teku campus.',
      'The briefing covers Tribhuvan University curriculum expectations, internal evaluation standards, library and computer laboratory access, and campus conduct guidelines.',
    ],
    category: NoticeCategory.EVENTS,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.NORMAL,
    isPinned: false,
    showInAnnouncementBar: true,
    publishedAt: '2026-10-14T10:00:00+05:45',
    authorName: 'Academic Coordinator',
  },
  {
    id: 'notice-term-results',
    title: 'Terminal Assessment Progress Reports & Guardian Consultation',
    slug: 'terminal-examination-results-consultation',
    excerpt:
      'Information regarding terminal assessment progress report distribution and faculty-guardian academic consultation at Teku campus.',
    content: [
      'Following each terminal examination cycle, Capitol Hill College invites parents and guardians to collect student progress reports and meet directly with subject faculty to review academic performance and attendance.',
      'Specific consultation dates for each cohort are communicated through official administrative circulars and the campus notice board.',
    ],
    category: NoticeCategory.RESULTS,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.NORMAL,
    isPinned: false,
    showInAnnouncementBar: false,
    publishedAt: '2026-10-08T14:00:00+05:45',
    authorName: 'Principal’s Office',
  },
  {
    id: 'notice-library-hours',
    title: 'Library Reading Room & Reference Study Hours',
    slug: 'extended-library-study-hours',
    excerpt:
      'Weekday library reference and quiet reading room access supporting examination preparation for +2 and BBS students.',
    content: [
      'To support students preparing for internal assessments and board examinations, the Capitol Hill College library reading room provides quiet study access and reference circulation Sunday through Friday during campus hours.',
    ],
    category: NoticeCategory.GENERAL,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.NORMAL,
    isPinned: false,
    showInAnnouncementBar: false,
    publishedAt: '2026-10-02T09:15:00+05:45',
    authorName: 'Library Administration',
  },
  {
    id: 'notice-urgent-scholarship-deadline',
    title: 'Merit Scholarship Application & Document Verification Notice',
    slug: 'merit-scholarship-submission-deadline',
    excerpt:
      'Eligible +2 and BBS applicants seeking merit-based scholarship consideration should submit verified academic transcripts during admission counseling.',
    content: [
      'Prospective students applying for merit scholarship consideration at Capitol Hill College should submit verified academic transcripts, character certificates, and completed application forms at the Teku campus Admissions Desk.',
      'Scholarship criteria and intake deadlines are set per academic session by the Scholarship & Admissions Committee. Please contact 01-5312399 for verification enquiries.',
    ],
    category: NoticeCategory.URGENT,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.HIGH,
    isPinned: false,
    showInAnnouncementBar: true,
    publishedAt: '2026-10-19T08:30:00+05:45',
    authorName: 'Scholarship & Admissions Committee',
  },
  {
    id: 'notice-expired-sample',
    title: 'Archived Holiday Closure Notice',
    slug: 'past-holiday-closure-expired',
    excerpt: 'Archived administrative notice demonstrating automatic expiry filtering.',
    content: ['Archived administrative closure entry.'],
    category: NoticeCategory.GENERAL,
    status: NoticeStatus.PUBLISHED,
    priority: NoticePriority.NORMAL,
    isPinned: false,
    showInAnnouncementBar: true,
    publishedAt: '2025-09-01T09:00:00+05:45',
    expiresAt: '2025-10-01T17:00:00+05:45',
    authorName: 'Administration',
  },
];

export function isNoticeActive(notice: NoticeItem, now: Date = new Date()): boolean {
  if (notice.status !== NoticeStatus.PUBLISHED) {
    return false;
  }
  if (notice.expiresAt) {
    const expiryDate = new Date(notice.expiresAt);
    if (expiryDate.getTime() < now.getTime()) {
      return false;
    }
  }
  return true;
}

export function getActiveNotices(notices: NoticeItem[] = SAMPLE_NOTICES): NoticeItem[] {
  const now = new Date();
  return notices
    .filter((notice) => isNoticeActive(notice, now))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

export function getActiveAnnouncementBarNotices(
  notices: NoticeItem[] = SAMPLE_NOTICES
): NoticeItem[] {
  return getActiveNotices(notices).filter((notice) => notice.showInAnnouncementBar);
}

export function getActiveAnnouncementBarNotice(
  notices: NoticeItem[] = SAMPLE_NOTICES
): NoticeItem | undefined {
  return getActiveAnnouncementBarNotices(notices)[0];
}

export function formatNoticeDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
