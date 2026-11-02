import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Database,
  Edit3,
  LogOut,
  Plus,
  Trash2,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import {
  db,
  handleFirestoreError,
  OperationType,
  SCHEMA_LIMITS,
  toSafeDocId,
  toSafeSlug,
} from '../lib/firebase';
import {
  EnquiryItem,
  EnquiryStatus,
  FaqCategory,
  FaqEntry,
  NoticeCategory,
  NoticeItem,
  NoticePriority,
  NoticeStatus,
} from '../types/notice';
import { formatNoticeDate, SAMPLE_NOTICES } from '../data/notices';
import { SAMPLE_FAQS } from '../data/faqs';

interface PortalDashboardProps {
  publicNotices: NoticeItem[];
  hasFirestoreNotices: boolean;
  hasFirestoreFaqs: boolean;
  initialTab?: 'notices' | 'faqs' | 'enquiries' | 'saved';
  onBackToHome: () => void;
  onOpenNotice: (slug: string) => void;
  onOpenEnquiryModal: () => void;
}

interface NoticeFormData {
  id: string | null;
  title: string;
  excerpt: string;
  content: string;
  category: NoticeCategory;
  status: NoticeStatus;
  priority: NoticePriority;
  isPinned: boolean;
  showInAnnouncementBar: boolean;
  showAsPopup: boolean;
  expiresAtDate: string;
  authorName: string;
  attachmentName: string;
}

interface FaqFormData {
  id: string | null;
  question: string;
  answer: string;
  category: FaqCategory;
  status: NoticeStatus;
  sortOrder: number;
}

const EMPTY_NOTICE_FORM: NoticeFormData = {
  id: null,
  title: '',
  excerpt: '',
  content: '',
  category: NoticeCategory.ADMISSIONS,
  status: NoticeStatus.PUBLISHED,
  priority: NoticePriority.NORMAL,
  isPinned: false,
  showInAnnouncementBar: false,
  showAsPopup: false,
  expiresAtDate: '',
  authorName: 'Administration Office',
  attachmentName: '',
};

const EMPTY_FAQ_FORM: FaqFormData = {
  id: null,
  question: '',
  answer: '',
  category: FaqCategory.ADMISSIONS,
  status: NoticeStatus.PUBLISHED,
  sortOrder: 10,
};

export const PortalDashboard: React.FC<PortalDashboardProps> = ({
  publicNotices,
  hasFirestoreNotices,
  hasFirestoreFaqs,
  initialTab,
  onBackToHome,
  onOpenNotice,
  onOpenEnquiryModal,
}) => {
  const {
    user,
    authReady,
    profileReady,
    isAdmin,
    savedNoticeIds,
    signInWithGoogle,
    signOutUser,
    toggleSavedNotice,
  } = useFirebase();

  const [activeTab, setActiveTab] = useState<'notices' | 'faqs' | 'enquiries' | 'saved'>(
    initialTab ?? 'notices'
  );
  const [adminNotices, setAdminNotices] = useState<NoticeItem[]>([]);
  const [adminFaqs, setAdminFaqs] = useState<FaqEntry[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);

  /* Notice Editor State */
  const [editorOpen, setEditorOpen] = useState(false);
  const [formData, setFormData] = useState<NoticeFormData>(EMPTY_NOTICE_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  /* FAQ Editor State */
  const [faqEditorOpen, setFaqEditorOpen] = useState(false);
  const [faqFormData, setFaqFormData] = useState<FaqFormData>(EMPTY_FAQ_FORM);
  const [faqFormError, setFaqFormError] = useState<string | null>(null);
  const [savingFaq, setSavingFaq] = useState(false);
  const [seedingFaqs, setSeedingFaqs] = useState(false);

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTab && (isAdmin || (initialTab !== 'notices' && initialTab !== 'faqs'))) {
      setActiveTab(initialTab);
      return;
    }
    if (!isAdmin) {
      setActiveTab('enquiries');
    } else if (activeTab !== 'faqs' && activeTab !== 'enquiries' && activeTab !== 'saved') {
      setActiveTab('notices');
    }
  }, [isAdmin, initialTab]);

  useEffect(() => {
    if (!editorOpen && !faqEditorOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorOpen(false);
        setFaqEditorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [editorOpen, faqEditorOpen]);

  /* Subscribe to notices, FAQs & enquiries once authenticated and profile exists */
  useEffect(() => {
    if (!authReady || !profileReady || !user) {
      setAdminNotices([]);
      setAdminFaqs([]);
      setEnquiries([]);
      return;
    }

    let unsubNotices: (() => void) | null = null;
    let unsubFaqs: (() => void) | null = null;

    if (isAdmin) {
      unsubNotices = onSnapshot(
        query(collection(db, 'notices')),
        (snapshot) => {
          const items: NoticeItem[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              title: String(d.title ?? ''),
              slug: String(d.slug ?? docSnap.id),
              excerpt: String(d.excerpt ?? ''),
              content: String(d.content ?? '')
                .split('\n\n')
                .filter(Boolean),
              category: (d.category as NoticeCategory) ?? NoticeCategory.GENERAL,
              status: (d.status as NoticeStatus) ?? NoticeStatus.DRAFT,
              priority: (d.priority as NoticePriority) ?? NoticePriority.NORMAL,
              isPinned: Boolean(d.isPinned),
              showInAnnouncementBar: Boolean(d.showInAnnouncementBar),
              showAsPopup: Boolean(d.showAsPopup),
              publishedAt: String(d.publishedAtIso ?? new Date().toISOString()),
              expiresAt: d.expiresAtIso ? String(d.expiresAtIso) : undefined,
              authorUid: String(d.authorUid ?? ''),
              updatedByUid: String(d.updatedByUid ?? ''),
              authorName: String(d.authorName ?? 'Administration'),
              attachment: d.attachmentName
                ? {
                    id: `att-${docSnap.id}`,
                    fileName: String(d.attachmentName),
                    fileType: 'Official Document',
                    fileSizeLabel: 'Summary',
                  }
                : undefined,
              isFromFirestore: true,
            };
          });
          items.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
          setAdminNotices(items);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'notices');
        }
      );

      unsubFaqs = onSnapshot(
        query(collection(db, 'faqs')),
        (snapshot) => {
          const items: FaqEntry[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              question: String(d.question ?? ''),
              answer: String(d.answer ?? ''),
              category: (d.category as FaqCategory) ?? FaqCategory.GENERAL,
              status: (d.status as NoticeStatus) ?? NoticeStatus.DRAFT,
              sortOrder: typeof d.sortOrder === 'number' ? d.sortOrder : 0,
              authorUid: String(d.authorUid ?? ''),
              updatedByUid: String(d.updatedByUid ?? ''),
              isFromFirestore: true,
            };
          });
          items.sort((a, b) => a.sortOrder - b.sortOrder);
          setAdminFaqs(items);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'faqs');
        }
      );
    }

    const enquiriesQuery = isAdmin
      ? query(collection(db, 'enquiries'))
      : query(collection(db, 'enquiries'), where('userId', '==', user.uid));

    const unsubEnquiries = onSnapshot(
      enquiriesQuery,
      (snapshot) => {
        const items: EnquiryItem[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          const createdTimestamp = d.createdAt?.toDate
            ? d.createdAt.toDate().toISOString()
            : new Date().toISOString();
          return {
            id: docSnap.id,
            userId: String(d.userId ?? ''),
            fullName: String(d.fullName ?? ''),
            phone: String(d.phone ?? ''),
            email: String(d.email ?? ''),
            program: String(d.program ?? ''),
            message: String(d.message ?? ''),
            status: (d.status as EnquiryStatus) ?? EnquiryStatus.NEW,
            adminNotes: String(d.adminNotes ?? ''),
            createdAtIso: createdTimestamp,
          };
        });
        items.sort(
          (a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime()
        );
        setEnquiries(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'enquiries');
      }
    );

    return () => {
      if (unsubNotices) unsubNotices();
      if (unsubFaqs) unsubFaqs();
      unsubEnquiries();
    };
  }, [authReady, profileReady, user, isAdmin]);

  if (!authReady) {
    return (
      <div className="bg-[var(--color-canvas)] py-20">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-[var(--color-muted)]">Verifying authentication session...</p>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[var(--color-canvas)] py-20">
        <section className="max-w-xl mx-auto px-6">
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
              Protected Portal
            </p>
            <h1 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
              Sign in to Capitol Hill College Portal
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Sign in with your Google account to track submitted admission enquiries, manage saved
              notices across devices, or access the authorized staff dashboard.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
              >
                Return Home
              </button>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer"
              >
                Sign in with Google
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* Notice Management Handlers */
  const handleSeedStarterNotices = async () => {
    if (!user || !isAdmin || seeding) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      const activeStarters = SAMPLE_NOTICES.filter(
        (n) => n.id !== 'notice-expired-sample'
      );

      for (const sample of activeStarters) {
        const ref = doc(db, 'notices', sample.id);
        batch.set(ref, {
          title: sample.title.slice(0, SCHEMA_LIMITS.NOTICE_TITLE_MAX),
          slug: toSafeSlug(sample.slug),
          excerpt: sample.excerpt.slice(0, SCHEMA_LIMITS.NOTICE_EXCERPT_MAX),
          content: sample.content.join('\n\n').slice(0, SCHEMA_LIMITS.NOTICE_CONTENT_MAX),
          category: sample.category,
          status: sample.status,
          priority: sample.priority,
          isPinned: sample.isPinned,
          showInAnnouncementBar: sample.showInAnnouncementBar,
          showAsPopup: sample.id === 'notice-admission-2024',
          publishedAtIso: sample.publishedAt,
          expiresAtIso: sample.expiresAt ?? '',
          authorUid: user.uid,
          updatedByUid: user.uid,
          authorName: sample.authorName.slice(0, SCHEMA_LIMITS.AUTHOR_NAME_MAX),
          attachmentName: (sample.attachment?.fileName ?? '').slice(0, SCHEMA_LIMITS.ATTACHMENT_MAX),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'notices');
    } finally {
      setSeeding(false);
    }
  };

  const openCreateNotice = () => {
    setFormData(EMPTY_NOTICE_FORM);
    setFormError(null);
    setEditorOpen(true);
  };

  const openEditNotice = (notice: NoticeItem) => {
    setFormData({
      id: notice.id,
      title: notice.title,
      excerpt: notice.excerpt,
      content: notice.content.join('\n\n'),
      category: notice.category,
      status: notice.status,
      priority: notice.priority,
      isPinned: notice.isPinned,
      showInAnnouncementBar: notice.showInAnnouncementBar,
      showAsPopup: Boolean(notice.showAsPopup),
      expiresAtDate: notice.expiresAt ? notice.expiresAt.slice(0, 10) : '',
      authorName: notice.authorName,
      attachmentName: notice.attachment?.fileName ?? '',
    });
    setFormError(null);
    setEditorOpen(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    const cleanTitle = formData.title.trim();
    const cleanExcerpt = formData.excerpt.trim();
    const cleanContent = formData.content.trim();
    const cleanAuthor = formData.authorName.trim();

    if (
      cleanTitle.length < SCHEMA_LIMITS.NOTICE_TITLE_MIN ||
      cleanTitle.length > SCHEMA_LIMITS.NOTICE_TITLE_MAX
    ) {
      setFormError(
        `Title must be between ${SCHEMA_LIMITS.NOTICE_TITLE_MIN} and ${SCHEMA_LIMITS.NOTICE_TITLE_MAX} characters.`
      );
      return;
    }
    if (
      cleanExcerpt.length < SCHEMA_LIMITS.NOTICE_EXCERPT_MIN ||
      cleanExcerpt.length > SCHEMA_LIMITS.NOTICE_EXCERPT_MAX
    ) {
      setFormError(
        `Summary excerpt must be between ${SCHEMA_LIMITS.NOTICE_EXCERPT_MIN} and ${SCHEMA_LIMITS.NOTICE_EXCERPT_MAX} characters.`
      );
      return;
    }
    if (
      cleanContent.length < SCHEMA_LIMITS.NOTICE_CONTENT_MIN ||
      cleanContent.length > SCHEMA_LIMITS.NOTICE_CONTENT_MAX
    ) {
      setFormError(
        `Full notice content must be between ${SCHEMA_LIMITS.NOTICE_CONTENT_MIN} and ${SCHEMA_LIMITS.NOTICE_CONTENT_MAX} characters.`
      );
      return;
    }
    if (cleanAuthor.length < SCHEMA_LIMITS.AUTHOR_NAME_MIN) {
      setFormError('Please specify the issuing department or author name.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const slug = toSafeSlug(cleanTitle);
    const expiresAtIso = formData.expiresAtDate
      ? `${formData.expiresAtDate}T23:59:59+05:45`
      : '';

    try {
      if (formData.id) {
        await updateDoc(doc(db, 'notices', formData.id), {
          title: cleanTitle.slice(0, SCHEMA_LIMITS.NOTICE_TITLE_MAX),
          slug,
          excerpt: cleanExcerpt.slice(0, SCHEMA_LIMITS.NOTICE_EXCERPT_MAX),
          content: cleanContent.slice(0, SCHEMA_LIMITS.NOTICE_CONTENT_MAX),
          category: formData.category,
          status: formData.status,
          priority: formData.priority,
          isPinned: formData.isPinned,
          showInAnnouncementBar: formData.showInAnnouncementBar,
          showAsPopup: formData.showAsPopup,
          publishedAtIso: new Date().toISOString(),
          expiresAtIso: expiresAtIso.slice(0, 40),
          updatedByUid: user.uid,
          authorName: cleanAuthor.slice(0, SCHEMA_LIMITS.AUTHOR_NAME_MAX),
          attachmentName: formData.attachmentName.trim().slice(0, SCHEMA_LIMITS.ATTACHMENT_MAX),
          updatedAt: serverTimestamp(),
        });
      } else {
        const newId = toSafeDocId('notice');
        await setDoc(doc(db, 'notices', newId), {
          title: cleanTitle.slice(0, SCHEMA_LIMITS.NOTICE_TITLE_MAX),
          slug,
          excerpt: cleanExcerpt.slice(0, SCHEMA_LIMITS.NOTICE_EXCERPT_MAX),
          content: cleanContent.slice(0, SCHEMA_LIMITS.NOTICE_CONTENT_MAX),
          category: formData.category,
          status: formData.status,
          priority: formData.priority,
          isPinned: formData.isPinned,
          showInAnnouncementBar: formData.showInAnnouncementBar,
          showAsPopup: formData.showAsPopup,
          publishedAtIso: new Date().toISOString(),
          expiresAtIso: expiresAtIso.slice(0, 40),
          authorUid: user.uid,
          updatedByUid: user.uid,
          authorName: cleanAuthor.slice(0, SCHEMA_LIMITS.AUTHOR_NAME_MAX),
          attachmentName: formData.attachmentName.trim().slice(0, SCHEMA_LIMITS.ATTACHMENT_MAX),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setEditorOpen(false);
    } catch (error) {
      handleFirestoreError(
        error,
        formData.id ? OperationType.UPDATE : OperationType.CREATE,
        `notices/${formData.id ?? 'new'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notices/${noticeId}`);
    }
  };

  /* FAQ Management Handlers */
  const handleSeedStarterFaqs = async () => {
    if (!user || !isAdmin || seedingFaqs) return;
    setSeedingFaqs(true);
    try {
      const batch = writeBatch(db);
      for (const sample of SAMPLE_FAQS) {
        const ref = doc(db, 'faqs', sample.id);
        batch.set(ref, {
          question: sample.question.slice(0, SCHEMA_LIMITS.FAQ_QUESTION_MAX),
          answer: sample.answer.slice(0, SCHEMA_LIMITS.FAQ_ANSWER_MAX),
          category: sample.category,
          status: sample.status,
          sortOrder: Math.max(
            SCHEMA_LIMITS.FAQ_SORT_MIN,
            Math.min(SCHEMA_LIMITS.FAQ_SORT_MAX, Math.floor(sample.sortOrder))
          ),
          authorUid: user.uid,
          updatedByUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'faqs');
    } finally {
      setSeedingFaqs(false);
    }
  };

  const openCreateFaq = () => {
    const nextOrder =
      adminFaqs.length > 0
        ? Math.min(
            SCHEMA_LIMITS.FAQ_SORT_MAX,
            Math.max(...adminFaqs.map((f) => f.sortOrder)) + 10
          )
        : 10;
    setFaqFormData({ ...EMPTY_FAQ_FORM, sortOrder: nextOrder });
    setFaqFormError(null);
    setFaqEditorOpen(true);
  };

  const openEditFaq = (faq: FaqEntry) => {
    setFaqFormData({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      status: faq.status,
      sortOrder: faq.sortOrder,
    });
    setFaqFormError(null);
    setFaqEditorOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    const cleanQuestion = faqFormData.question.trim();
    const cleanAnswer = faqFormData.answer.trim();
    const cleanSortOrder = Math.max(
      SCHEMA_LIMITS.FAQ_SORT_MIN,
      Math.min(SCHEMA_LIMITS.FAQ_SORT_MAX, Math.floor(Number(faqFormData.sortOrder) || 0))
    );

    if (
      cleanQuestion.length < SCHEMA_LIMITS.FAQ_QUESTION_MIN ||
      cleanQuestion.length > SCHEMA_LIMITS.FAQ_QUESTION_MAX
    ) {
      setFaqFormError(
        `Question must be between ${SCHEMA_LIMITS.FAQ_QUESTION_MIN} and ${SCHEMA_LIMITS.FAQ_QUESTION_MAX} characters.`
      );
      return;
    }

    if (
      cleanAnswer.length < SCHEMA_LIMITS.FAQ_ANSWER_MIN ||
      cleanAnswer.length > SCHEMA_LIMITS.FAQ_ANSWER_MAX
    ) {
      setFaqFormError(
        `Answer must be between ${SCHEMA_LIMITS.FAQ_ANSWER_MIN} and ${SCHEMA_LIMITS.FAQ_ANSWER_MAX} characters.`
      );
      return;
    }

    setSavingFaq(true);
    setFaqFormError(null);

    try {
      if (faqFormData.id) {
        await updateDoc(doc(db, 'faqs', faqFormData.id), {
          question: cleanQuestion,
          answer: cleanAnswer,
          category: faqFormData.category,
          status: faqFormData.status,
          sortOrder: cleanSortOrder,
          updatedByUid: user.uid,
          updatedAt: serverTimestamp(),
        });
      } else {
        const newFaqId = toSafeDocId('faq');
        await setDoc(doc(db, 'faqs', newFaqId), {
          question: cleanQuestion,
          answer: cleanAnswer,
          category: faqFormData.category,
          status: faqFormData.status,
          sortOrder: cleanSortOrder,
          authorUid: user.uid,
          updatedByUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setFaqEditorOpen(false);
    } catch (error) {
      handleFirestoreError(
        error,
        faqFormData.id ? OperationType.UPDATE : OperationType.CREATE,
        `faqs/${faqFormData.id ?? 'new'}`
      );
    } finally {
      setSavingFaq(false);
    }
  };

  const handleToggleFaqStatus = async (faq: FaqEntry) => {
    if (!user || !isAdmin) return;
    const nextStatus =
      faq.status === NoticeStatus.PUBLISHED ? NoticeStatus.DRAFT : NoticeStatus.PUBLISHED;
    try {
      await updateDoc(doc(db, 'faqs', faq.id), {
        status: nextStatus,
        updatedByUid: user.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `faqs/${faq.id}`);
    }
  };

  const handleMoveFaqOrder = async (index: number, direction: -1 | 1) => {
    if (!user || !isAdmin) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= adminFaqs.length) return;

    const currentFaq = adminFaqs[index];
    const neighborFaq = adminFaqs[targetIndex];
    const currentOrder = currentFaq.sortOrder;
    const neighborOrder =
      neighborFaq.sortOrder === currentOrder
        ? Math.max(0, Math.min(SCHEMA_LIMITS.FAQ_SORT_MAX, currentOrder + direction))
        : neighborFaq.sortOrder;

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'faqs', currentFaq.id), {
        sortOrder: neighborOrder,
        updatedByUid: user.uid,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'faqs', neighborFaq.id), {
        sortOrder: currentOrder,
        updatedByUid: user.uid,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `faqs/${currentFaq.id}`);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', faqId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `faqs/${faqId}`);
    }
  };

  /* Enquiry Status Handler */
  const handleUpdateEnquiryStatus = async (enquiry: EnquiryItem, nextStatus: EnquiryStatus) => {
    const notes = (noteDrafts[enquiry.id] ?? enquiry.adminNotes).slice(
      0,
      SCHEMA_LIMITS.ENQUIRY_NOTES_MAX
    );
    try {
      await updateDoc(doc(db, 'enquiries', enquiry.id), {
        status: nextStatus,
        adminNotes: notes,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `enquiries/${enquiry.id}`);
    }
  };

  const savedNoticeItems = publicNotices.filter((n) => savedNoticeIds.includes(n.id));
  const publishedCount = adminNotices.filter((n) => n.status === NoticeStatus.PUBLISHED).length;
  const publishedFaqCount = adminFaqs.filter((f) => f.status === NoticeStatus.PUBLISHED).length;
  const draftOrArchivedCount =
    adminNotices.filter((n) => n.status !== NoticeStatus.PUBLISHED).length +
    adminFaqs.filter((f) => f.status !== NoticeStatus.PUBLISHED).length;
  const newEnquiryCount = enquiries.filter((e) => e.status === EnquiryStatus.NEW).length;

  return (
    <div className="bg-[var(--color-canvas)]">
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
        <div>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-brand)] mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Website
          </button>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
            {isAdmin ? 'Administrator Dashboard' : 'Student & Applicant Portal'}
          </h1>
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">
            Signed in as <strong className="text-[var(--color-ink)]">{user.email}</strong>
            {' · '}
            <span>{isAdmin ? 'Administrator Role' : 'Verified Portal Account'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={openCreateNotice}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Notice
              </button>
              <button
                type="button"
                onClick={openCreateFaq}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New FAQ
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => signOutUser()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] bg-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Admin Summary Strip */}
      {isAdmin && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-5">
            <p className="text-xs text-[var(--color-muted)]">Published Notices</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-primary-ink)] tabular-nums">
              {publishedCount}
            </p>
          </div>
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-5">
            <p className="text-xs text-[var(--color-muted)]">Published FAQs</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-primary-ink)] tabular-nums">
              {publishedFaqCount}
            </p>
          </div>
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-5">
            <p className="text-xs text-[var(--color-muted)]">Draft &amp; Archived Items</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-primary-ink)] tabular-nums">
              {draftOrArchivedCount}
            </p>
          </div>
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-5">
            <p className="text-xs text-[var(--color-muted)]">New Admission Enquiries</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-primary-ink)] tabular-nums">
              {newEnquiryCount}
            </p>
          </div>
        </div>
      )}

      {/* Portal Section Tabs */}
      <div className="mt-8 flex items-center gap-2 border-b border-[var(--color-hairline)] pb-4 overflow-x-auto">
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                activeTab === 'notices'
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'bg-white text-[var(--color-muted)] border border-[var(--color-hairline)] hover:text-[var(--color-ink)]'
              }`}
            >
              Manage Notices ({adminNotices.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                activeTab === 'faqs'
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'bg-white text-[var(--color-muted)] border border-[var(--color-hairline)] hover:text-[var(--color-ink)]'
              }`}
            >
              Manage FAQs ({adminFaqs.length})
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
            activeTab === 'enquiries'
              ? 'bg-[var(--color-brand)] text-white'
              : 'bg-white text-[var(--color-muted)] border border-[var(--color-hairline)] hover:text-[var(--color-ink)]'
          }`}
        >
          {isAdmin ? `Student Enquiries (${enquiries.length})` : `My Enquiries (${enquiries.length})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
            activeTab === 'saved'
              ? 'bg-[var(--color-brand)] text-white'
              : 'bg-white text-[var(--color-muted)] border border-[var(--color-hairline)] hover:text-[var(--color-ink)]'
          }`}
        >
          Saved Notices ({savedNoticeItems.length})
        </button>
      </div>

      {/* Tab 1: Admin Notice Management */}
      {isAdmin && activeTab === 'notices' && (
        <div className="mt-8">
          {!hasFirestoreNotices && adminNotices.length === 0 ? (
            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-10 text-center">
              <Database className="w-8 h-8 text-[var(--color-brand)] mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-[var(--color-primary-ink)]">
                Initialize Firestore Notice Repository
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] max-w-lg mx-auto">
                Your Firestore database is connected and ready. Seed the initial Capitol Hill
                College starter notices into Firestore or publish a new notice from scratch.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={seeding}
                  onClick={handleSeedStarterNotices}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {seeding ? 'Seeding Firestore...' : 'Seed Starter Notices to Firestore'}
                </button>
                <button
                  type="button"
                  onClick={openCreateNotice}
                  className="px-4 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-lg transition-colors cursor-pointer"
                >
                  Create Blank Notice
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {adminNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span className="font-semibold text-[var(--color-primary-ink)]">
                        {notice.status}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{notice.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{formatNoticeDate(notice.publishedAt)}</span>
                      {notice.showInAnnouncementBar && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[var(--color-brand)] font-semibold">Top Bar Active</span>
                        </>
                      )}
                      {notice.showAsPopup && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[var(--color-brand)] font-semibold">Popup Enabled</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--color-primary-ink)]">
                      {notice.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">
                      {notice.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditNotice(notice)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-lg cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Admin FAQ Management */}
      {isAdmin && activeTab === 'faqs' && (
        <div className="mt-8">
          {!hasFirestoreFaqs && adminFaqs.length === 0 ? (
            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-10 text-center">
              <Database className="w-8 h-8 text-[var(--color-brand)] mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-[var(--color-primary-ink)]">
                Initialize Frequently Asked Questions in Firestore
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] max-w-lg mx-auto">
                Seed the starter Capitol Hill College FAQs into Firestore so you can customize,
                reorder, draft, or add new student questions anytime.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={seedingFaqs}
                  onClick={handleSeedStarterFaqs}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {seedingFaqs ? 'Seeding FAQs...' : 'Seed Starter FAQs to Firestore'}
                </button>
                <button
                  type="button"
                  onClick={openCreateFaq}
                  className="px-4 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-lg transition-colors cursor-pointer"
                >
                  Create New FAQ
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {adminFaqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span className="font-semibold text-[var(--color-primary-ink)]">
                        {faq.status}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{faq.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Order #{faq.sortOrder}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--color-primary-ink)]">
                      {faq.question}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveFaqOrder(idx, -1)}
                      aria-label="Move FAQ up"
                      className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-brand)] border border-[var(--color-hairline)] rounded-lg disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === adminFaqs.length - 1}
                      onClick={() => handleMoveFaqOrder(idx, 1)}
                      aria-label="Move FAQ down"
                      className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-brand)] border border-[var(--color-hairline)] rounded-lg disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFaqStatus(faq)}
                      className="px-3 py-1.5 text-xs font-medium text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {faq.status === NoticeStatus.PUBLISHED ? 'Set Draft' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditFaq(faq)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-50 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Admission Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="mt-8">
          {enquiries.length === 0 ? (
            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-10 text-center">
              <h2 className="text-xl font-semibold text-[var(--color-primary-ink)]">
                {isAdmin
                  ? 'No admission enquiries received yet'
                  : 'You have not submitted any enquiries yet'}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
                {isAdmin
                  ? 'Prospective student enquiries submitted through the website will appear here in real time.'
                  : 'Submit an admission enquiry for +2 Science, +2 Management, or BBS to receive counseling follow-up.'}
              </p>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={onOpenEnquiryModal}
                  className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg cursor-pointer"
                >
                  New Admission Enquiry
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry) => (
                <article
                  key={enquiry.id}
                  className="bg-white border border-[var(--color-hairline)] rounded-xl p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span className="font-semibold text-[var(--color-primary-ink)]">
                        {enquiry.status}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{enquiry.program}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {formatNoticeDate(enquiry.createdAtIso)}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {Object.values(EnquiryStatus).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateEnquiryStatus(enquiry, st)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded border cursor-pointer ${
                              enquiry.status === st
                                ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                                : 'bg-white text-[var(--color-muted)] border-[var(--color-hairline)] hover:border-[var(--color-brand)]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-[var(--color-primary-ink)]">
                    {enquiry.fullName}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)] tabular-nums">
                    {enquiry.phone} · {enquiry.email}
                  </p>
                  {enquiry.message && (
                    <p className="mt-3 text-sm text-[var(--color-ink)] leading-relaxed">
                      {enquiry.message}
                    </p>
                  )}

                  {isAdmin ? (
                    <div className="mt-4 pt-4 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={noteDrafts[enquiry.id] ?? enquiry.adminNotes}
                        onChange={(e) =>
                          setNoteDrafts((prev) => ({ ...prev, [enquiry.id]: e.target.value }))
                        }
                        placeholder="Add counselor follow-up note..."
                        className="flex-1 px-3 py-1.5 text-xs border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateEnquiryStatus(enquiry, enquiry.status)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  ) : (
                    enquiry.adminNotes && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-hairline)] text-xs text-[var(--color-muted)]">
                        <strong className="text-[var(--color-ink)]">Admissions Response: </strong>
                        {enquiry.adminNotes}
                      </div>
                    )
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Saved Notices */}
      {activeTab === 'saved' && (
        <div className="mt-8">
          {savedNoticeItems.length === 0 ? (
            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-10 text-center">
              <h2 className="text-xl font-semibold text-[var(--color-primary-ink)]">
                No saved notices yet
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
                Bookmark notices on the Notices &amp; Announcements page to keep important
                schedules and deadlines synced to your account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedNoticeItems.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span className="font-semibold text-[var(--color-primary-ink)]">
                        {notice.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{formatNoticeDate(notice.publishedAt)}</span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold text-[var(--color-primary-ink)]">
                      <button
                        type="button"
                        onClick={() => onOpenNotice(notice.slug)}
                        className="text-left hover:underline underline-offset-4 cursor-pointer"
                      >
                        {notice.title}
                      </button>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSavedNotice(notice.id)}
                    className="px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notice Create / Edit Modal */}
      {editorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-editor-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 border border-[var(--color-hairline)] shadow-xl my-8">
            <h2
              id="notice-editor-title"
              className="text-2xl font-semibold text-[var(--color-primary-ink)]"
            >
              {formData.id ? 'Edit College Notice' : 'Publish New College Notice'}
            </h2>

            <form onSubmit={handleSaveNotice} className="mt-6 space-y-4">
              {formError && (
                <p
                  role="alert"
                  className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  {formError}
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.NOTICE_TITLE_MAX}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Admission Open — +2 Science, +2 Management & BBS"
                  className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as NoticeCategory })
                    }
                    className="w-full px-3 py-2 text-sm border border-[var(--color-hairline)] rounded-lg bg-white"
                  >
                    {Object.values(NoticeCategory).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as NoticeStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-[var(--color-hairline)] rounded-lg bg-white"
                  >
                    {Object.values(NoticeStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as NoticePriority })
                    }
                    className="w-full px-3 py-2 text-sm border border-[var(--color-hairline)] rounded-lg bg-white"
                  >
                    {Object.values(NoticePriority).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                  Summary Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  maxLength={SCHEMA_LIMITS.NOTICE_EXCERPT_MAX}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Concise summary displayed on notice cards and announcement popups..."
                  className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                  Full Notice Body * (separate paragraphs with a blank line)
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={SCHEMA_LIMITS.NOTICE_CONTENT_MAX}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full official notice details..."
                  className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Issuing Office / Author *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={SCHEMA_LIMITS.AUTHOR_NAME_MAX}
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Optional Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAtDate}
                    onChange={(e) => setFormData({ ...formData, expiresAtDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-6 text-xs text-[var(--color-ink)]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  />
                  Pin to top of Notices
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showInAnnouncementBar}
                    onChange={(e) =>
                      setFormData({ ...formData, showInAnnouncementBar: e.target.checked })
                    }
                  />
                  Highlight in Top Announcement Bar
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAsPopup}
                    onChange={(e) => setFormData({ ...formData, showAsPopup: e.target.checked })}
                  />
                  Enable Announcement Popup
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : formData.id ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Create / Edit Modal */}
      {faqEditorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="faq-editor-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 border border-[var(--color-hairline)] shadow-xl my-8">
            <h2
              id="faq-editor-title"
              className="text-2xl font-semibold text-[var(--color-primary-ink)]"
            >
              {faqFormData.id ? 'Edit Frequently Asked Question' : 'Add Frequently Asked Question'}
            </h2>

            <form onSubmit={handleSaveFaq} className="mt-6 space-y-4">
              {faqFormError && (
                <p
                  role="alert"
                  className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  {faqFormError}
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                  Student Question *
                </label>
                <input
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.FAQ_QUESTION_MAX}
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  placeholder="e.g., What documents are required for +2 Science admission?"
                  className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Topic Category
                  </label>
                  <select
                    value={faqFormData.category}
                    onChange={(e) =>
                      setFaqFormData({
                        ...faqFormData,
                        category: e.target.value as FaqCategory,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[var(--color-hairline)] rounded-lg bg-white"
                  >
                    {Object.values(FaqCategory).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Status
                  </label>
                  <select
                    value={faqFormData.status}
                    onChange={(e) =>
                      setFaqFormData({
                        ...faqFormData,
                        status: e.target.value as NoticeStatus,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[var(--color-hairline)] rounded-lg bg-white"
                  >
                    {Object.values(NoticeStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={SCHEMA_LIMITS.FAQ_SORT_MIN}
                    max={SCHEMA_LIMITS.FAQ_SORT_MAX}
                    value={faqFormData.sortOrder}
                    onChange={(e) =>
                      setFaqFormData({
                        ...faqFormData,
                        sortOrder: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[var(--color-hairline)] rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-ink)] mb-1">
                  Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  maxLength={SCHEMA_LIMITS.FAQ_ANSWER_MAX}
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  placeholder="Provide a clear, verified answer for prospective and current students..."
                  className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFaqEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFaq}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingFaq ? 'Saving...' : faqFormData.id ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </section>
    </div>
  );
};
