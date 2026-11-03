/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { NoticesPage } from './pages/NoticesPage';
import { NoticePopupModal } from './components/NoticePopupModal';
import { PortalDashboard } from './pages/PortalDashboard';
import { FaqSection } from './components/FaqSection';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { CampusGalleryPage } from './pages/CampusGalleryPage';
import { TeamMembersPage } from './pages/TeamMembersPage';
import { AlumniTestimonialsPage } from './pages/AlumniTestimonials';
import { LeadershipPage } from './pages/LeadershipPage';
import { AcademicProgramsPage } from './pages/AcademicProgramsPage';
import { AcademicProgramDetailPage } from './pages/AcademicProgramDetailPage';
import { CollegeImage } from './components/CollegeImage';
import { HeroOverviewVideo } from './components/HeroOverviewVideo';
import { FaqChatbot } from './components/FaqChatbot';
import { ChatbotQuickAction } from './types/chatbot';
import {
  ACADEMIC_PROGRAMS,
  AcademicDivisionId,
  AcademicProgramSlug,
  getAcademicProgramBySlug,
  OFFICIAL_CAMPUS_LOCATION,
} from './data/academicPrograms';
import {
  navigateBrowserUrl,
  ParsedRoute,
  parseLocationRoute,
  PortalTabId,
} from './utils/routing';
import { LeadershipMessagesSection } from './components/LeadershipMessagesSection';
import { ALL_LEADERSHIP_PROFILES } from './data/leadershipData';
import {
  formatNoticeDate,
  getActiveAnnouncementBarNotices,
  getActiveNotices,
  SAMPLE_NOTICES,
} from './data/notices';
import { SAMPLE_FAQS } from './data/faqs';
import { FACILITIES_LIST } from './data/facilities';
import {
  EnquiryStatus,
  FaqCategory,
  FaqEntry,
  NoticeCategory,
  NoticeItem,
  NoticePriority,
  NoticeStatus,
} from './types/notice';
import { useFirebase } from './context/FirebaseContext';
import {
  db,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
  SCHEMA_LIMITS,
  toSafeDocId,
} from './lib/firebase';

type PortalTab = PortalTabId;

type RouteState =
  | { view: 'home'; sectionId?: 'about' | 'programs' | 'faq' | 'contact' }
  | { view: 'programs' }
  | { view: 'program-detail'; programSlug: AcademicProgramSlug }
  | { view: 'leadership' }
  | { view: 'facilities' }
  | { view: 'team' }
  | { view: 'gallery' }
  | { view: 'alumni' }
  | { view: 'notices'; slug: string | null }
  | { view: 'portal'; tab?: PortalTab };

function toRouteState(parsed: ParsedRoute): RouteState {
  switch (parsed.view) {
    case 'programs':
      return { view: 'programs' };
    case 'program-detail':
      return parsed.programSlug
        ? { view: 'program-detail', programSlug: parsed.programSlug }
        : { view: 'programs' };
    case 'leadership':
      return { view: 'leadership' };
    case 'facilities':
      return { view: 'facilities' };
    case 'team':
      return { view: 'team' };
    case 'gallery':
      return { view: 'gallery' };
    case 'alumni':
      return { view: 'alumni' };
    case 'notices':
      return { view: 'notices', slug: parsed.noticeSlug ?? null };
    case 'portal':
      return { view: 'portal', tab: parsed.portalTab };
    case 'home':
    default:
      return { view: 'home', sectionId: parsed.sectionId };
  }
}

function readBrowserRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }
  return toRouteState(parseLocationRoute(window.location.pathname, window.location.hash));
}

export default function App() {
  const { user, profileReady, isAdmin, signInWithGoogle } = useFirebase();
  const [route, setRoute] = useState<RouteState>(() => readBrowserRoute());
  const [firestoreNotices, setFirestoreNotices] = useState<NoticeItem[]>([]);
  const [hasLoadedFirestoreNotices, setHasLoadedFirestoreNotices] = useState(false);

  const [firestoreFaqs, setFirestoreFaqs] = useState<FaqEntry[]>([]);
  const [hasLoadedFirestoreFaqs, setHasLoadedFirestoreFaqs] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programDivisionFilter, setProgramDivisionFilter] = useState<'all' | AcademicDivisionId>(
    'all'
  );
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: ACADEMIC_PROGRAMS[0].title,
    message: '',
  });
  const [formError, setFormError] = useState('');

  /* Live Firestore subscription for PUBLISHED notices & PUBLISHED FAQs */
  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
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

  /* Pre-fill enquiry contact details from authenticated Google profile */
  useEffect(() => {
    if (user) {
      setFormState((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

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
    () => activeNotices.find((n) => n.showAsPopup),
    [activeNotices]
  );

  /* Handle initial direct section URLs (e.g. /about/, /programs/, /faq/, /contact/) + browser navigation */
  useEffect(() => {
    if (route.view === 'home' && route.sectionId) {
      const targetId = route.sectionId;
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [route]);

  useEffect(() => {
    const syncFromBrowserLocation = () => {
      const nextRoute = readBrowserRoute();
      setRoute(nextRoute);
      if (nextRoute.view !== 'home' || !nextRoute.sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', syncFromBrowserLocation);
    window.addEventListener('hashchange', syncFromBrowserLocation);
    return () => {
      window.removeEventListener('popstate', syncFromBrowserLocation);
      window.removeEventListener('hashchange', syncFromBrowserLocation);
    };
  }, []);

  /* Lock background scroll and allow Escape dismissal when Admission Enquiry modal is open */
  useEffect(() => {
    if (!enquiryOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEnquiryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enquiryOpen]);

  /* Sync document title & meta description for SEO across views */
  useEffect(() => {
    let nextTitle = 'Capitol Hill College | Quality Education in Teku, Kathmandu';
    let nextDescription =
      'Capitol Hill College in Teku, Kathmandu offers NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS) programs.';

    if (route.view === 'programs') {
      nextTitle = 'Academic Programs | Capitol Hill College — NEB (+2), BBS & MBS';
      nextDescription =
        'Explore Capitol Hill College academic programs in Teku, Kathmandu: NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS).';
    } else if (route.view === 'program-detail') {
      const program = getAcademicProgramBySlug(route.programSlug);
      if (program) {
        nextTitle = program.seo.title;
        nextDescription = program.seo.description;
      }
    } else if (route.view === 'leadership') {
      nextTitle = 'Leadership & Governance | Capitol Hill College — Teku, Kathmandu';
      nextDescription =
        'Meet the Chairman, Board of Directors, and institutional governance leadership behind Capitol Hill College in Teku, Kathmandu.';
    } else if (route.view === 'team') {
      nextTitle = 'Academic & Professional Team | Capitol Hill College';
      nextDescription =
        'Meet the Board of Directors, dedicated faculty across 15 academic departments, and professional staff at Capitol Hill College, Teku, Kathmandu.';
    } else if (route.view === 'facilities') {
      nextTitle = 'Facilities & Services | Capitol Hill College — Teku, Kathmandu';
      nextDescription =
        'Explore classrooms, library, specialized laboratories, cafeteria, ECA & CCA, and sports facilities at Capitol Hill College in Teku, Kathmandu.';
    } else if (route.view === 'gallery') {
      nextTitle = 'Our Gallery | Capitol Hill College — Student Life & Campus Moments';
      nextDescription =
        'Discover student classroom life, sports, educational tours, welcome programs, quiz competitions, science practicals, and farewell memories at Capitol Hill College, Teku, Kathmandu.';
    } else if (route.view === 'alumni') {
      nextTitle = 'Alumni & Testimonials | Capitol Hill College — Teku, Kathmandu';
      nextDescription =
        'Explore Capitol Hill College alumni pathways, student perspectives, and institutional values across NEB (+2) and Tribhuvan University programs in Teku, Kathmandu.';
    } else if (route.view === 'notices') {
      nextTitle = 'Notices & Announcements | Capitol Hill College';
      nextDescription =
        'Official admission updates, examination schedules, events, and academic notices from Capitol Hill College.';
    } else if (route.view === 'portal') {
      nextTitle = 'Staff & Student Portal | Capitol Hill College';
    }

    document.title = nextTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', nextDescription);
    }
  }, [route]);

  const navigateHome = (sectionId?: string) => {
    const knownSection =
      sectionId === 'about' ||
      sectionId === 'programs' ||
      sectionId === 'faq' ||
      sectionId === 'contact'
        ? sectionId
        : undefined;

    setRoute({ view: 'home', sectionId: knownSection });
    setMobileMenuOpen(false);

    if (sectionId) {
      navigateBrowserUrl(knownSection ? `/${knownSection}` : `/#${sectionId}`);
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 40);
    } else {
      navigateBrowserUrl('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToPrograms = (slug?: AcademicProgramSlug) => {
    setMobileMenuOpen(false);
    if (slug) {
      setRoute({ view: 'program-detail', programSlug: slug });
      navigateBrowserUrl(`/academic-programs/${slug}`);
    } else {
      setRoute({ view: 'programs' });
      navigateBrowserUrl('/academic-programs');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLeadership = () => {
    setRoute({ view: 'leadership' });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/leadership-governance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToFacilities = () => {
    setRoute({ view: 'facilities' });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/facilities-services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTeam = () => {
    setRoute({ view: 'team' });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/team-member');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToGallery = () => {
    setRoute({ view: 'gallery' });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAlumni = () => {
    setRoute({ view: 'alumni' });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/alumni');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToNotices = (slug?: string | null) => {
    const cleanSlug = slug ?? null;
    setRoute({ view: 'notices', slug: cleanSlug });
    setMobileMenuOpen(false);
    navigateBrowserUrl(cleanSlug ? `/notices/${encodeURIComponent(cleanSlug)}` : '/notices');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPortal = (tab?: PortalTab) => {
    setRoute({ view: 'portal', tab });
    setMobileMenuOpen(false);
    const targetPath =
      tab === 'faqs' ? '/admin/faqs' : isAdmin ? '/admin' : '/portal';
    navigateBrowserUrl(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (programTitle?: string) => {
    if (programTitle) {
      setFormState((prev) => ({ ...prev, program: programTitle }));
    }
    setSubmitted(false);
    setFormError('');
    setEnquiryOpen(true);
    setMobileMenuOpen(false);
  };

  const handleChatbotAction = (action: ChatbotQuickAction) => {
    switch (action.action) {
      case 'open-enquiry':
        handleOpenEnquiry(action.programTitle);
        break;
      case 'open-programs':
      case 'scroll-programs':
        navigateToPrograms();
        break;
      case 'open-program-detail':
        navigateToPrograms(action.programSlug);
        break;
      case 'scroll-contact':
        navigateHome('contact');
        break;
      case 'scroll-about':
        navigateHome('about');
        break;
      case 'open-leadership':
        navigateToLeadership();
        break;
      case 'open-facilities':
        navigateToFacilities();
        break;
      case 'open-gallery':
        navigateToGallery();
        break;
      case 'open-team':
        navigateToTeam();
        break;
      case 'open-notices':
        navigateToNotices(null);
        break;
      case 'external-link':
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseConfigured || !user || !profileReady) {
      setFormError('Please sign in with Google below so we can securely record your enquiry.');
      return;
    }

    const cleanName = formState.fullName.trim();
    const cleanPhone = formState.phone.trim();
    const cleanEmail = (formState.email.trim() || user.email || '').trim();
    const cleanMessage = formState.message.trim();

    if (cleanName.length < SCHEMA_LIMITS.ENQUIRY_NAME_MIN) {
      setFormError('Please provide your full name (at least 2 characters).');
      return;
    }
    if (
      cleanPhone.length < SCHEMA_LIMITS.PHONE_MIN ||
      cleanPhone.length > SCHEMA_LIMITS.PHONE_MAX ||
      !SCHEMA_LIMITS.PHONE_PATTERN.test(cleanPhone)
    ) {
      setFormError('Please enter a valid contact phone number (7–25 digits).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setSubmittingEnquiry(true);
    const enquiryId = toSafeDocId('enq');

    try {
      await setDoc(doc(db, 'enquiries', enquiryId), {
        userId: user.uid,
        fullName: cleanName.slice(0, SCHEMA_LIMITS.ENQUIRY_NAME_MAX),
        phone: cleanPhone.slice(0, SCHEMA_LIMITS.PHONE_MAX),
        email: cleanEmail.slice(0, SCHEMA_LIMITS.EMAIL_MAX),
        program: formState.program.slice(0, SCHEMA_LIMITS.ENQUIRY_PROGRAM_MAX),
        message: cleanMessage.slice(0, SCHEMA_LIMITS.ENQUIRY_MESSAGE_MAX),
        status: EnquiryStatus.NEW,
        adminNotes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `enquiries/${enquiryId}`);
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[var(--color-ink)]">
      {/* Shared Main Navigation Bar — Official Website-Wide Deep Red University Header */}
      <SiteHeader
        activeView={route.view}
        activeProgramSlug={route.view === 'program-detail' ? route.programSlug : null}
        userSignedIn={Boolean(user)}
        isAdmin={isAdmin}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onNavigateHome={(sectionId) => navigateHome(sectionId)}
        onNavigatePrograms={navigateToPrograms}
        onNavigateLeadership={navigateToLeadership}
        onNavigateFacilities={navigateToFacilities}
        onNavigateGallery={navigateToGallery}
        onNavigateTeam={navigateToTeam}
        onNavigateAlumni={navigateToAlumni}
        onNavigateNotices={() => navigateToNotices(null)}
        onNavigatePortal={() => navigateToPortal()}
        onSignIn={() => {
          setMobileMenuOpen(false);
          void signInWithGoogle();
        }}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Full-width continuous announcement slider directly beneath the main navigation bar */}
      <AnnouncementBar
        notices={announcementNotices}
        onNavigateToNotices={(slug) => navigateToNotices(slug ?? null)}
      />

      <main id="top" className="flex-1">
        {route.view === 'portal' ? (
          <PortalDashboard
            publicNotices={activeNotices}
            hasFirestoreNotices={firestoreNotices.length > 0}
            hasFirestoreFaqs={firestoreFaqs.length > 0}
            initialTab={route.tab}
            onBackToHome={() => navigateHome()}
            onOpenNotice={(slug) => navigateToNotices(slug)}
            onOpenEnquiryModal={() => handleOpenEnquiry()}
          />
        ) : route.view === 'programs' ? (
          <AcademicProgramsPage
            onNavigateHome={(sectionId) => navigateHome(sectionId)}
            onSelectProgram={(slug) => navigateToPrograms(slug)}
            onNavigateFacilities={navigateToFacilities}
            onOpenEnquiry={handleOpenEnquiry}
          />
        ) : route.view === 'program-detail' ? (
          (() => {
            const activeProgram = getAcademicProgramBySlug(route.programSlug);
            if (!activeProgram) {
              return (
                <AcademicProgramsPage
                  onNavigateHome={(sectionId) => navigateHome(sectionId)}
                  onSelectProgram={(slug) => navigateToPrograms(slug)}
                  onNavigateFacilities={navigateToFacilities}
                  onOpenEnquiry={handleOpenEnquiry}
                />
              );
            }
            return (
              <AcademicProgramDetailPage
                program={activeProgram}
                onNavigateHome={(sectionId) => navigateHome(sectionId)}
                onNavigateAllPrograms={() => navigateToPrograms()}
                onSelectProgram={(slug) => navigateToPrograms(slug)}
                onNavigateFacilities={navigateToFacilities}
                onOpenEnquiry={handleOpenEnquiry}
              />
            );
          })()
        ) : route.view === 'leadership' ? (
          <LeadershipPage
            onNavigateHome={(sectionId) => navigateHome(sectionId)}
            onNavigateTeam={navigateToTeam}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        ) : route.view === 'facilities' ? (
          <FacilitiesPage
            onNavigateHome={(sectionId) => navigateHome(sectionId)}
            onExplorePrograms={() => navigateToPrograms()}
            onContactCollege={() => navigateHome('contact')}
            onOpenEnquiry={handleOpenEnquiry}
          />
        ) : route.view === 'team' ? (
          <TeamMembersPage
            onNavigateHome={() => navigateHome()}
            onNavigateLeadership={navigateToLeadership}
            onExplorePrograms={() => navigateToPrograms()}
            onContactUs={() => navigateHome('contact')}
          />
        ) : route.view === 'gallery' ? (
          <CampusGalleryPage
            onNavigateHome={() => navigateHome()}
            onExplorePrograms={() => navigateToPrograms()}
            onContactUs={() => navigateHome('contact')}
          />
        ) : route.view === 'alumni' ? (
          <AlumniTestimonialsPage
            onNavigateHome={() => navigateHome()}
            onExploreFacilities={navigateToFacilities}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        ) : route.view === 'notices' ? (
          <NoticesPage
            notices={activeNotices}
            activeSlug={route.slug}
            onSelectNotice={(slug) => navigateToNotices(slug)}
            onBackToHome={() => navigateHome()}
            onOpenEnquiry={handleOpenEnquiry}
          />
        ) : (
          <>
            {/* Immersive University Hero Showcase */}
            <section
              id="about"
              className="relative w-full overflow-hidden bg-[var(--color-primary-ink)] text-white border-b border-white/10 lg:min-h-[600px] xl:min-h-[670px] lg:h-[78vh] lg:max-h-[780px] lg:flex lg:flex-col lg:justify-between"
            >
              {/* Full-width 16:9 showcase at top on mobile/tablet; full-bleed cinema stage on desktop */}
              <HeroOverviewVideo />

              {/* College Branding, Introduction & Admission Actions */}
              <div className="relative z-10 flex-1 flex items-center w-full lg:pointer-events-none">
                <div className="max-w-7xl w-full mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-10 lg:py-14">
                  <div className="max-w-2xl lg:max-w-[600px] pointer-events-auto">
                    <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-brand-on-dark)] font-semibold mb-3 sm:mb-4">
                      Teku, Kathmandu, Nepal · NEB &amp; TU Affiliated
                    </p>
                    <h1 className="text-[1.95rem] sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-semibold tracking-tight leading-[1.1] text-white">
                      Quality Education for Success with all Excellence
                    </h1>
                    <p className="mt-4 sm:mt-5 text-[15px] sm:text-base lg:text-lg text-neutral-200 lg:text-neutral-100/95 leading-relaxed max-w-[54ch]">
                      Capitol Hill College, located in Teku, Kathmandu, is an educational institution
                      founded by experienced academicians and committed to providing quality and
                      practical education. Affiliated with NEB and TU, the college offers academic
                      programs while focusing on students&apos; intellectual, social and personal
                      growth.
                    </p>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEnquiry()}
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm focus-visible:outline-white"
                      >
                        Request Admission Information
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                      <button
                        type="button"
                        onClick={navigateToFacilities}
                        className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-medium text-white border border-white/35 bg-white/5 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white"
                      >
                        Explore Campus Facilities
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Institutional Contact & Overview Strip */}
              <div className="relative z-10 border-t border-white/15 bg-[#171717]/88 lg:bg-[#171717]/70 lg:backdrop-blur-xs">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-200">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span>Teku, Kathmandu</span>
                    <span aria-hidden="true" className="text-neutral-500">
                      ·
                    </span>
                    <span className="tabular-nums">01-5312399</span>
                    <span aria-hidden="true" className="text-neutral-500">
                      ·
                    </span>
                    <span className="break-all sm:break-normal">
                      info.capitolhillcollege@gmail.com
                    </span>
                    <span aria-hidden="true" className="hidden md:inline text-neutral-500">
                      ·
                    </span>
                    <span className="hidden md:inline text-neutral-300">
                      Affiliations &amp; course lists subject to administrative verification
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-300 whitespace-nowrap shrink-0">
                    Academic &amp; Campus Overview · Representative Preview Reel
                  </span>
                </div>
              </div>
            </section>

            {/* Latest Notices Preview Strip on Homepage */}
            <section className="py-16 bg-white border-b border-[var(--color-hairline)]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                      Official Updates
                    </p>
                    <h2 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
                      Latest Notices &amp; Announcements
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToNotices(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    View All Notices
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeNotices.slice(0, 3).map((notice) => (
                    <article
                      key={notice.id}
                      className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-xl p-6 flex flex-col justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                          <span className="font-semibold text-[var(--color-brand)]">
                            {notice.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={notice.publishedAt} className="tabular-nums">
                            {formatNoticeDate(notice.publishedAt)}
                          </time>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-[var(--color-primary-ink)] leading-snug">
                          <button
                            type="button"
                            onClick={() => navigateToNotices(notice.slug)}
                            className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                          >
                            {notice.title}
                          </button>
                        </h3>
                        <p className="mt-2.5 text-sm text-[var(--color-muted)] line-clamp-3">
                          {notice.excerpt}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-[var(--color-hairline)]">
                        <button
                          type="button"
                          onClick={() => navigateToNotices(notice.slug)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors cursor-pointer"
                        >
                          Read Notice
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Academic Programs Directory */}
            <section
              id="programs"
              className="py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                      Academic Offerings
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                      Academic Programs
                    </h2>
                    <p className="mt-2.5 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                      Higher Secondary (+2) streams affiliated with the National Examinations Board
                      (NEB) alongside undergraduate and postgraduate management degrees affiliated
                      with Tribhuvan University (TU).
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                    <div
                      role="group"
                      aria-label="Filter academic programs by affiliation"
                      className="flex items-center gap-1 p-1 bg-white border border-[var(--color-hairline)] rounded-lg"
                    >
                      {(
                        [
                          { id: 'all', label: 'All Programs (6)' },
                          { id: 'neb-plus-two', label: 'NEB (+2)' },
                          { id: 'tribhuvan-university', label: 'Tribhuvan University' },
                        ] as const
                      ).map((tab) => {
                        const isActive = programDivisionFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setProgramDivisionFilter(tab.id)}
                            aria-pressed={isActive}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isActive
                                ? 'bg-[var(--color-brand)] text-white shadow-2xs'
                                : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateToPrograms()}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      View All Programs
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ACADEMIC_PROGRAMS.filter(
                    (program) =>
                      programDivisionFilter === 'all' ||
                      program.divisionId === programDivisionFilter
                  ).map((program) => (
                    <article
                      key={program.slug}
                      className="bg-white rounded-xl p-7 border border-[var(--color-hairline)] hover:border-neutral-400 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-muted)]">
                          <span className="font-semibold text-[var(--color-brand)]">
                            {program.divisionLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{program.affiliationShort}</span>
                          <span aria-hidden="true">·</span>
                          <span>{program.durationLabel}</span>
                        </div>
                        <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-[var(--color-primary-ink)]">
                          <button
                            type="button"
                            onClick={() => navigateToPrograms(program.slug)}
                            className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                          >
                            {program.title}
                          </button>
                        </h3>
                        <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                          {program.cardSummary}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-[var(--color-hairline)] flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => navigateToPrograms(program.slug)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Explore Program
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEnquiry(program.title)}
                          className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Admission Enquiry
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Campus Facilities Preview Strip on Homepage */}
            <section className="py-18 bg-white border-b border-[var(--color-hairline)]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                      Campus Environment
                    </p>
                    <h2 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
                      Facilities &amp; Services
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={navigateToFacilities}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Explore All 6 Campus Facilities
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-7">
                  {FACILITIES_LIST.slice(0, 3).map((item) => (
                    <article key={item.id} className="group flex flex-col">
                      <div className="rounded-xl overflow-hidden border border-[var(--color-hairline)]">
                        <CollegeImage
                          src={item.image.src}
                          alt={item.image.alt}
                          aspectClassName="aspect-[16/10]"
                          imgClassName="group-hover:scale-[1.02]"
                          fallbackTitle={item.title}
                        />
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-[var(--color-muted)]">
                          <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                            {item.number}
                          </span>
                          <span aria-hidden="true" className="mx-1.5">
                            ·
                          </span>
                          <span>{item.categoryLabel}</span>
                        </p>
                        <h3 className="mt-1.5 text-xl font-semibold text-[var(--color-primary-ink)]">
                          <button
                            type="button"
                            onClick={navigateToFacilities}
                            className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                          >
                            {item.title}
                          </button>
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2">
                          {item.subtitle}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Dedicated Principal's Message & CEO and Directors' Message Sections */}
            <LeadershipMessagesSection onNavigateLeadership={navigateToLeadership} />

            {/* Institutional Leadership & Governance Overview */}
            <section
              id="leadership"
              className="py-20 bg-white border-b border-[var(--color-hairline)]"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                      Institutional Stewardship
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                      Leadership &amp; Academic Administration
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                      Guided by experienced institutional stewards and academic administrators
                      overseeing NEB (+2) streams and Tribhuvan University degree studies in Teku,
                      Kathmandu.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={navigateToLeadership}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Leadership &amp; Governance
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={navigateToTeam}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Faculty &amp; Staff Directory
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ALL_LEADERSHIP_PROFILES.map((leader) => (
                    <button
                      key={leader.id}
                      type="button"
                      onClick={navigateToLeadership}
                      className="text-left bg-[var(--color-canvas)] hover:bg-neutral-200/55 border border-[var(--color-hairline)] hover:border-neutral-400 rounded-xl p-6 flex items-center gap-4 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-hairline)] shrink-0 ${
                          leader.isCutoutPortrait ? 'bg-[#F2F0EC]' : 'bg-white'
                        }`}
                      >
                        <img
                          src={leader.portraitSrc}
                          alt={leader.portraitAlt}
                          className={
                            leader.isCutoutPortrait
                              ? 'w-full h-full object-contain object-bottom pt-1'
                              : 'w-full h-full object-cover object-top'
                          }
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                          {leader.shortDesignation}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-[var(--color-primary-ink)] truncate">
                          {leader.fullName}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">
                          {leader.academicDistinction
                            ? leader.academicDistinction.formattedLine
                            : leader.homepageSummaryRole}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Frequently Asked Questions Accordion Section */}
            <FaqSection
              faqs={activeFaqs}
              isAdmin={isAdmin}
              onOpenEnquiry={() => handleOpenEnquiry()}
              onManageFaqs={() => navigateToPortal('faqs')}
            />

            {/* Contact & Institutional Identity */}
            <section id="contact" className="py-16 bg-[var(--color-canvas)]">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-primary-ink)] flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                    Campus Location
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {OFFICIAL_CAMPUS_LOCATION.address}
                  </p>
                  <a
                    href={OFFICIAL_CAMPUS_LOCATION.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
                  >
                    View on Google Maps
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </div>

                <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-primary-ink)] flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                    Telephone
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] tabular-nums">
                    <a
                      href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                      className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors"
                    >
                      {OFFICIAL_CAMPUS_LOCATION.telephone}
                    </a>
                  </p>
                </div>

                <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-primary-ink)] flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                    Official Email
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] break-all">
                    <a
                      href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                      className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors"
                    >
                      {OFFICIAL_CAMPUS_LOCATION.email}
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Shared Institutional Footer — Official Website-Wide Deep Red Footer */}
      <SiteFooter
        activeView={route.view}
        onNavigateHome={(sectionId) => navigateHome(sectionId)}
        onNavigatePrograms={navigateToPrograms}
        onNavigateLeadership={navigateToLeadership}
        onNavigateFacilities={navigateToFacilities}
        onNavigateGallery={navigateToGallery}
        onNavigateTeam={navigateToTeam}
        onNavigateAlumni={navigateToAlumni}
        onNavigateNotices={() => navigateToNotices(null)}
        onNavigatePortal={() => navigateToPortal()}
      />

      {/* Controlled Announcement Popup Modal */}
      <NoticePopupModal
        notice={popupNotice}
        disabled={enquiryOpen || route.view === 'portal'}
        onReadFullNotice={(slug) => navigateToNotices(slug)}
      />

      {/* Floating College Campus Guide (Local Predefined Dataset — Zero External AI APIs) */}
      <FaqChatbot
        hidden={enquiryOpen || route.view === 'portal'}
        onAction={handleChatbotAction}
      />

      {/* Interactive Admission Enquiry Modal Connected to Firestore */}
      {enquiryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEnquiryOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 border border-[var(--color-hairline)] shadow-xl my-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                  Admissions &amp; Campus Desk
                </p>
                <h2
                  id="enquiry-modal-title"
                  className="mt-1 text-2xl font-semibold text-[var(--color-primary-ink)]"
                >
                  {route.view === 'alumni' ? 'Campus & Alumni Enquiry' : 'Admission Enquiry'}
                </h2>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Capitol Hill College · Teku, Kathmandu
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryOpen(false)}
                aria-label="Close modal"
                className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="mt-6 py-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="text-xl font-semibold text-[var(--color-primary-ink)]">
                  Enquiry Saved to Admissions Portal
                </h3>
                <p className="text-sm text-[var(--color-muted)] max-w-sm mx-auto">
                  Thank you, {formState.fullName}. Your enquiry has been recorded and can be
                  tracked anytime under <strong>My Portal</strong>.
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEnquiryOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnquiryOpen(false);
                      navigateToPortal('enquiries');
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer"
                  >
                    View My Enquiries
                  </button>
                </div>
              </div>
            ) : !user ? (
              <div className="mt-6 py-6 text-center space-y-4">
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {isFirebaseConfigured
                    ? 'Please sign in with your Google account so our campus team can verify your contact identity and let you track responses online.'
                    : 'Online portal sign-in is currently unavailable in this preview environment. Please contact our Teku campus desk directly at 01-5312399 or email info.capitolhillcollege@gmail.com.'}
                </p>
                {isFirebaseConfigured ? (
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer"
                  >
                    Continue with Google Sign-In
                  </button>
                ) : (
                  <a
                    href="mailto:info.capitolhillcollege@gmail.com"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors"
                  >
                    Email Campus Office
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {formError && (
                  <p
                    role="alert"
                    className="text-xs font-medium text-[var(--color-brand)] bg-[var(--color-brand-soft)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2"
                  >
                    {formError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-medium text-[var(--color-ink)] mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    maxLength={SCHEMA_LIMITS.ENQUIRY_NAME_MAX}
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    placeholder="Enter student's full name"
                    className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium text-[var(--color-ink)] mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      maxLength={SCHEMA_LIMITS.PHONE_MAX}
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none tabular-nums"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-[var(--color-ink)] mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      maxLength={SCHEMA_LIMITS.EMAIL_MAX}
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="program"
                    className="block text-xs font-medium text-[var(--color-ink)] mb-1"
                  >
                    Interested Program
                  </label>
                  <select
                    id="program"
                    value={formState.program}
                    onChange={(e) => setFormState({ ...formState, program: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg bg-white focus:border-[var(--color-brand)] focus:outline-none"
                  >
                    {ACADEMIC_PROGRAMS.map((p) => (
                      <option key={p.slug} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium text-[var(--color-ink)] mb-1"
                  >
                    Questions or Notes
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    maxLength={SCHEMA_LIMITS.ENQUIRY_MESSAGE_MAX}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Ask about eligibility, intake dates, or campus visits..."
                    className="w-full px-3.5 py-2 text-sm border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEnquiryOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submittingEnquiry ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
