/**
 * Firestore Security Rules — Dirty Dozen Verification Suite
 * Validates that all 12 adversarial payloads in security_spec.md return PERMISSION_DENIED.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: {
    uid: string;
    email?: string;
    email_verified?: boolean;
  } | null;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Shadow field privilege escalation on /users/{userId}',
    operation: 'create',
    path: 'users/user_abc',
    auth: { uid: 'user_abc', email: 'student@example.com', email_verified: true },
    payload: {
      uid: 'user_abc',
      displayName: 'Student',
      photoURL: '',
      isAdmin: true,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Self-assigned ADMIN role creation in /admins/{adminUid}',
    operation: 'create',
    path: 'admins/user_abc',
    auth: { uid: 'user_abc', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'user_abc',
      email: 'attacker@example.com',
      role: 'ADMIN',
      grantedBy: 'user_abc',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified bootstrapped admin email spoofing on /notices',
    operation: 'create',
    path: 'notices/notice_1',
    auth: { uid: 'spoof_uid', email: 'thapaujjwal20@gmail.com', email_verified: false },
    payload: {
      title: 'Spoofed Notice Headline',
      slug: 'spoofed-notice',
      excerpt: 'Spoofed notice excerpt content.',
      content: 'Spoofed full notice body content.',
      category: 'Urgent',
      status: 'PUBLISHED',
      priority: 'HIGH',
      isPinned: true,
      showInAnnouncementBar: true,
      showAsPopup: true,
      publishedAtIso: '2026-10-26T00:00:00Z',
      expiresAtIso: '',
      authorUid: 'spoof_uid',
      authorName: 'Spoofer',
      attachmentName: '',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-user PII read on /users/victim_uid/private/info',
    operation: 'get',
    path: 'users/victim_uid/private/info',
    auth: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Orphaned private subcollection write without parent /users/{uid}',
    operation: 'create',
    path: 'users/orphan_uid/private/info',
    auth: { uid: 'orphan_uid', email: 'orphan@example.com', email_verified: true },
    payload: {
      uid: 'orphan_uid',
      email: 'orphan@example.com',
      savedNoticeIds: [],
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Unbounded savedNoticeIds array (> 50 elements)',
    operation: 'update',
    path: 'users/user_abc/private/info',
    auth: { uid: 'user_abc', email: 'student@example.com', email_verified: true },
    payload: {
      savedNoticeIds: Array.from({ length: 55 }, (_, i) => `notice_${i}`),
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Public unauthenticated read of DRAFT notice',
    operation: 'get',
    path: 'notices/draft_notice_1',
    auth: null,
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Identity spoofing userId on /enquiries creation',
    operation: 'create',
    path: 'enquiries/enq_1',
    auth: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      userId: 'victim_uid',
      fullName: 'Victim Student',
      phone: '9800000000',
      email: 'victim@example.com',
      program: '+2 Science',
      message: 'Spoofed enquiry',
      status: 'NEW',
      adminNotes: '',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Student attempting to modify status and adminNotes on own enquiry',
    operation: 'update',
    path: 'enquiries/enq_1',
    auth: { uid: 'student_uid', email: 'student@example.com', email_verified: true },
    payload: {
      status: 'CONTACTED',
      adminNotes: 'Self-approved notes',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Student attempting to update CLOSED terminal enquiry',
    operation: 'update',
    path: 'enquiries/enq_closed',
    auth: { uid: 'student_uid', email: 'student@example.com', email_verified: true },
    payload: {
      message: 'Mutating closed record',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Forged past createdAt timestamp on enquiry creation',
    operation: 'create',
    path: 'enquiries/enq_forged_time',
    auth: { uid: 'student_uid', email: 'student@example.com', email_verified: true },
    payload: {
      userId: 'student_uid',
      fullName: 'Student Name',
      phone: '9841000000',
      email: 'student@example.com',
      program: 'BBS',
      message: 'Backdated timestamp test',
      status: 'NEW',
      adminNotes: '',
      createdAt: '2020-01-01T00:00:00.000Z',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unfiltered collection list scrape on /enquiries by non-admin user',
    operation: 'list',
    path: 'enquiries',
    auth: { uid: 'student_uid', email: 'student@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
