import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  getActiveAnnouncementBarNotices,
  getActiveNotices,
  SAMPLE_NOTICES,
} from '../data/notices';
import { SAMPLE_FAQS } from '../data/faqs';
import {
  db,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
} from '../lib/firebase';
import {
  FaqCategory,
  FaqEntry,
  NoticeCategory,
  NoticeItem,
  NoticePriority,
  NoticeStatus,
} from '../types/notice';

interface PublishedContentState {
  activeNotices: NoticeItem[];
  announcementNotices: NoticeItem[];
  popupNotice: NoticeItem | undefined;
  activeFaqs: FaqEntry[];
}

/**
 * Subscribes to live PUBLISHED notices and FAQs in Cloud Firestore when Firebase is
 * configured, transparently falling back to bundled institutional data otherwise.
 */
export function usePublishedContent(): PublishedContentState {
  const [firestoreNotices, setFirestoreNotices] = useState<NoticeItem[]>([]);
  const [hasLoadedFirestoreNotices, setHasLoadedFirestoreNotices] = useState(false);

  const [firestoreFaqs, setFirestoreFaqs] = useState<FaqEntry[]>([]);
  const [hasLoadedFirestoreFaqs, setHasLoadedFirestoreFaqs] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined;
    }

    const publishedNoticesQuery = query(
      collection(db, 'notices'),
      where('status', '==', NoticeStatus.PUBLISHED)
    );

    const unsubNotices = onSnapshot(
      publishedNoticesQuery,
      (snapshot) => {
        const docs: NoticeItem[] = snapshot.docs.map((docSnap) => {
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
            status: (d.status as NoticeStatus) ?? NoticeStatus.PUBLISHED,
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
        setFirestoreNotices(docs);
        setHasLoadedFirestoreNotices(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'notices');
      }
    );

    const publishedFaqsQuery = query(
      collection(db, 'faqs'),
      where('status', '==', NoticeStatus.PUBLISHED)
    );

    const unsubFaqs = onSnapshot(
      publishedFaqsQuery,
      (snapshot) => {
        const docs: FaqEntry[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            question: String(d.question ?? ''),
            answer: String(d.answer ?? ''),
            category: (d.category as FaqCategory) ?? FaqCategory.GENERAL,
            status: (d.status as NoticeStatus) ?? NoticeStatus.PUBLISHED,
            sortOrder: typeof d.sortOrder === 'number' ? d.sortOrder : 0,
            authorUid: String(d.authorUid ?? ''),
            updatedByUid: String(d.updatedByUid ?? ''),
            isFromFirestore: true,
          };
        });
        docs.sort((a, b) => a.sortOrder - b.sortOrder);
        setFirestoreFaqs(docs);
        setHasLoadedFirestoreFaqs(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'faqs');
      }
    );

    return () => {
      unsubNotices();
      unsubFaqs();
    };
  }, []);

  const rawNoticesSource = useMemo(() => {
    if (hasLoadedFirestoreNotices && firestoreNotices.length > 0) {
      return firestoreNotices;
    }
    return SAMPLE_NOTICES;
  }, [hasLoadedFirestoreNotices, firestoreNotices]);

  const activeFaqs = useMemo(() => {
    if (hasLoadedFirestoreFaqs && firestoreFaqs.length > 0) {
      return firestoreFaqs;
    }
    return SAMPLE_FAQS;
  }, [hasLoadedFirestoreFaqs, firestoreFaqs]);

  const activeNotices = useMemo(() => getActiveNotices(rawNoticesSource), [rawNoticesSource]);
  const announcementNotices = useMemo(
    () => getActiveAnnouncementBarNotices(rawNoticesSource),
    [rawNoticesSource]
  );
  const popupNotice = useMemo(
    () => activeNotices.find((notice) => notice.showAsPopup),
    [activeNotices]
  );

  return {
    activeNotices,
    announcementNotices,
    popupNotice,
    activeFaqs,
  };
}
