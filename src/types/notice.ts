export enum NoticeCategory {
  URGENT = 'Urgent',
  ADMISSIONS = 'Admissions',
  EXAMINATIONS = 'Examinations',
  RESULTS = 'Results',
  EVENTS = 'Events',
  GENERAL = 'General',
}

export enum NoticeStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum NoticePriority {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
}

export enum EnquiryStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  CONTACTED = 'CONTACTED',
  CLOSED = 'CLOSED',
}

export interface NoticeAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeLabel: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: NoticeCategory;
  status: NoticeStatus;
  priority: NoticePriority;
  isPinned: boolean;
  showInAnnouncementBar: boolean;
  showAsPopup?: boolean;
  publishedAt: string;
  expiresAt?: string;
  authorUid?: string;
  updatedByUid?: string;
  authorName: string;
  attachment?: NoticeAttachment;
  isFromFirestore?: boolean;
}

export interface EnquiryItem {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  status: EnquiryStatus;
  adminNotes: string;
  createdAtIso: string;
}

export enum FaqCategory {
  ADMISSIONS = 'Admissions',
  ACADEMICS = 'Academics',
  EXAMINATIONS = 'Examinations',
  CAMPUS = 'Campus & Facilities',
  GENERAL = 'General',
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  status: NoticeStatus;
  sortOrder: number;
  authorUid?: string;
  updatedByUid?: string;
  isFromFirestore?: boolean;
}
