/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { NoticesPage } from './pages/NoticesPage';
import { NoticePopupModal } from './components/NoticePopupModal';
import { FaqSection } from './components/FaqSection';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { CampusGalleryPage } from './pages/CampusGalleryPage';
import { TeamMembersPage } from './pages/TeamMembersPage';
import { AlumniTestimonialsPage } from './pages/AlumniTestimonials';
import { LeadershipPage } from './pages/LeadershipPage';
import { AdvisoryCommitteePage } from './pages/AdvisoryCommitteePage';
import { ContactPage } from './pages/ContactPage';
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
  isDeferredPortalPath,
  navigateBrowserUrl,
  ParsedRoute,
  parseLocationRoute,
} from './utils/routing';
import { LeadershipMessagesSection } from './components/LeadershipMessagesSection';
import { StudentInsightsCarousel } from './components/studentInsights/StudentInsightsCarousel';
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
  FaqCategory,
  FaqEntry,
  NoticeCategory,
  NoticeItem,
  NoticePriority,
  NoticeStatus,
} from './types/notice';
import {
  db,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
} from './lib/firebase';
import {
  PRINCIPAL_PORTRAIT_THUMB_BG_CLASS,
  PRINCIPAL_PORTRAIT_THUMB_IMG_CLASS,
} from './utils/portraitFraming';

type RouteState =
  | { view: 'home'; sectionId?: 'about' | 'programs' | 'faq' | 'contact' }
  | { view: 'programs' }
  | { view: 'program-detail'; programSlug: AcademicProgramSlug }
  | { view: 'leadership' }
  | { view: 'advisory' }
  | { view: 'facilities' }
  | { view: 'team' }
  | { view: 'gallery' }
  | { view: 'alumni' }
  | { view: 'notices'; slug: string | null }
  | { view: 'contact'; initialProgram?: string };

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
    case 'advisory':
      return { view: 'advisory' };
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
    case 'contact':
      return { view: 'contact' };
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
  const [route, setRoute] = useState<RouteState>(() => readBrowserRoute());
  const [firestoreNotices, setFirestoreNotices] = useState<NoticeItem[]>([]);
  const [hasLoadedFirestoreNotices, setHasLoadedFirestoreNotices] = useState(false);

  const [firestoreFaqs, setFirestoreFaqs] = useState<FaqEntry[]>([]);
  const [hasLoadedFirestoreFaqs, setHasLoadedFirestoreFaqs] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programDivisionFilter, setProgramDivisionFilter] = useState<'all' | AcademicDivisionId>(
    'all'
  );

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
    if (
      typeof window !== 'undefined' &&
      isDeferredPortalPath(window.location.pathname, window.location.hash)
    ) {
      window.history.replaceState(null, '', '/');
    }

    const syncFromBrowserLocation = () => {
      if (isDeferredPortalPath(window.location.pathname, window.location.hash)) {
        window.history.replaceState(null, '', '/');
      }
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

  /* Sync document title & meta description for SEO across views */
  useEffect(() => {
    let nextTitle = 'CAPITOL HILL COLLEGE | ...Shaping Futures Since 2005... · Teku, Kathmandu';
    let nextDescription =
      'CAPITOL HILL COLLEGE (...Shaping Futures Since 2005...) in Teku, Kathmandu offers NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS) programs.';

    if (route.view === 'programs') {
      nextTitle = 'Academic Programs | CAPITOL HILL COLLEGE — NEB (+2), BBS & MBS';
      nextDescription =
        'Explore CAPITOL HILL COLLEGE academic programs in Teku, Kathmandu: NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS).';
    } else if (route.view === 'program-detail') {
      const program = getAcademicProgramBySlug(route.programSlug);
      if (program) {
        nextTitle = program.seo.title;
        nextDescription = program.seo.description;
      }
    } else if (route.view === 'leadership') {
      nextTitle = 'Leadership & Governance | CAPITOL HILL COLLEGE — Teku, Kathmandu';
      nextDescription =
        'Meet the Chairman, Board of Directors, and Principal leading CAPITOL HILL COLLEGE in Teku, Kathmandu.';
    } else if (route.view === 'advisory') {
      nextTitle = 'Advisory Committee | CAPITOL HILL COLLEGE — Teku, Kathmandu';
      nextDescription =
        'Consultative governance, academic quality advisory mandate, and institutional guidance at CAPITOL HILL COLLEGE, Teku, Kathmandu.';
    } else if (route.view === 'team') {
      nextTitle = 'Academic & Professional Team | CAPITOL HILL COLLEGE';
      nextDescription =
        'Meet the Board of Directors, Principal, dedicated faculty across 15 academic departments, and professional staff at CAPITOL HILL COLLEGE, Teku, Kathmandu.';
    } else if (route.view === 'facilities') {
      nextTitle = 'Facilities & Services | CAPITOL HILL COLLEGE — Teku, Kathmandu';
      nextDescription =
        'Explore classrooms, library, specialized laboratories, cafeteria, ECA & CCA, and sports facilities at CAPITOL HILL COLLEGE in Teku, Kathmandu.';
    } else if (route.view === 'gallery') {
      nextTitle = 'Our Gallery | CAPITOL HILL COLLEGE — Student Life & Campus Moments';
      nextDescription =
        'Discover student classroom life, sports, educational tours, welcome programs, quiz competitions, science practicals, and farewell memories at CAPITOL HILL COLLEGE, Teku, Kathmandu.';
    } else if (route.view === 'alumni') {
      nextTitle = 'Student Voices & Achievements | CAPITOL HILL COLLEGE — Our Students, Our Pride';
      nextDescription =
        'Discover inspiring student voices, academic achievements, board toppers, and authentic testimonials from CAPITOL HILL COLLEGE students in Teku, Kathmandu.';
    } else if (route.view === 'notices') {
      nextTitle = 'Notices & Announcements | CAPITOL HILL COLLEGE';
      nextDescription =
        'Official admission updates, examination schedules, events, and academic notices from CAPITOL HILL COLLEGE, Teku, Kathmandu.';
    } else if (route.view === 'contact') {
      nextTitle = 'Contact & Admission Enquiry | CAPITOL HILL COLLEGE — Teku, Kathmandu';
      nextDescription =
        'Contact CAPITOL HILL COLLEGE in Teku, Kathmandu (01-5312399 · info.capitolhillcollege@gmail.com) or submit an online admission enquiry for NEB (+2), BBS, and MBS programs.';
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

  const navigateToAdvisory = () => {
    setRoute({ view: 'advisory' });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/advisory-committee');
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

  const navigateToContact = (programTitle?: string) => {
    setRoute({ view: 'contact', initialProgram: programTitle });
    setMobileMenuOpen(false);
    navigateBrowserUrl('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (programTitle?: string) => {
    navigateToContact(programTitle);
  };

  const handleChatbotAction = (action: ChatbotQuickAction) => {
    switch (action.action) {
      case 'open-enquiry':
        navigateToContact(action.programTitle);
        break;
      case 'open-programs':
      case 'scroll-programs':
        navigateToPrograms();
        break;
      case 'open-program-detail':
        navigateToPrograms(action.programSlug);
        break;
      case 'scroll-contact':
        navigateToContact();
        break;
      case 'scroll-about':
        navigateHome('about');
        break;
      case 'open-leadership':
        navigateToLeadership();
        break;
      case 'open-advisory':
        navigateToAdvisory();
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-[var(--color-ink)]">
      {/* Shared Main Navigation Bar — Official Website-Wide Deep Red University Header */}
      <SiteHeader
        activeView={route.view}
        activeProgramSlug={route.view === 'program-detail' ? route.programSlug : null}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onNavigateHome={(sectionId) => navigateHome(sectionId)}
        onNavigatePrograms={navigateToPrograms}
        onNavigateLeadership={navigateToLeadership}
        onNavigateAdvisory={navigateToAdvisory}
        onNavigateFacilities={navigateToFacilities}
        onNavigateGallery={navigateToGallery}
        onNavigateTeam={navigateToTeam}
        onNavigateAlumni={navigateToAlumni}
        onNavigateNotices={() => navigateToNotices(null)}
        onNavigateContact={() => navigateToContact()}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Full-width continuous announcement slider directly beneath the main navigation bar */}
      <AnnouncementBar
        notices={announcementNotices}
        onNavigateToNotices={(slug) => navigateToNotices(slug ?? null)}
      />

      <main id="top" className="flex-1">
        {route.view === 'programs' ? (
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
            onNavigateAdvisory={navigateToAdvisory}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        ) : route.view === 'advisory' ? (
          <AdvisoryCommitteePage
            onNavigateHome={() => navigateHome()}
            onNavigateLeadership={navigateToLeadership}
            onNavigateTeam={navigateToTeam}
            onNavigateContact={() => navigateToContact()}
          />
        ) : route.view === 'facilities' ? (
          <FacilitiesPage
            onNavigateHome={(sectionId) => navigateHome(sectionId)}
            onExplorePrograms={() => navigateToPrograms()}
            onContactCollege={() => navigateToContact()}
            onOpenEnquiry={handleOpenEnquiry}
          />
        ) : route.view === 'team' ? (
          <TeamMembersPage
            onNavigateHome={() => navigateHome()}
            onNavigateLeadership={navigateToLeadership}
            onExplorePrograms={() => navigateToPrograms()}
            onContactUs={() => navigateToContact()}
          />
        ) : route.view === 'gallery' ? (
          <CampusGalleryPage
            onNavigateHome={() => navigateHome()}
            onExplorePrograms={() => navigateToPrograms()}
            onContactUs={() => navigateToContact()}
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
        ) : route.view === 'contact' ? (
          <ContactPage
            initialProgram={route.initialProgram}
            onNavigateHome={() => navigateHome()}
            onNavigatePrograms={() => navigateToPrograms()}
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
                  <div className="max-w-2xl lg:max-w-[620px] pointer-events-auto">
                    <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-brand-on-dark)] font-semibold mb-3 sm:mb-4">
                      CAPITOL HILL COLLEGE · Teku, Kathmandu · NEB &amp; TU Affiliated
                    </p>
                    <h1 className="text-[2rem] sm:text-4xl lg:text-5xl xl:text-[3.45rem] font-semibold tracking-tight leading-[1.08] text-white text-balance">
                      Inspiring Minds. Shaping Futures.
                    </h1>
                    <p className="mt-3 sm:mt-3.5 font-sans text-sm sm:text-base lg:text-lg font-medium tracking-[0.02em] text-white/90">
                      Quality Education • Practical Skills • Global Opportunities
                    </p>
                    <p className="mt-4 sm:mt-5 text-[15px] sm:text-base text-neutral-200 lg:text-neutral-100/95 leading-relaxed max-w-[54ch]">
                      Founded by experienced academicians in Teku, Kathmandu, CAPITOL HILL COLLEGE
                      offers Higher Secondary (+2 Management, +2 Humanities, +2 Science, and +2 Law)
                      and Tribhuvan University (BBS &amp; MBS) degree programs focused on
                      intellectual rigor, practical inquiry, and personal character.
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

              {/* Bottom Institutional Operational Utility Strip */}
              <div className="relative z-10 border-t border-white/15 bg-[#171717]/88 lg:bg-[#171717]/70 lg:backdrop-blur-xs">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-200">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span>Teku, Kathmandu</span>
                    <span aria-hidden="true" className="text-neutral-500">
                      ·
                    </span>
                    <a
                      href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                      className="tabular-nums hover:text-white transition-colors"
                    >
                      01-5312399
                    </a>
                    <span aria-hidden="true" className="text-neutral-500">
                      ·
                    </span>
                    <a
                      href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                      className="break-all sm:break-normal hover:text-white transition-colors"
                    >
                      info.capitolhillcollege@gmail.com
                    </a>
                  </div>
                  <span className="text-[11px] font-medium tracking-[0.06em] text-neutral-300 whitespace-nowrap shrink-0">
                    ...Shaping Futures Since 2005...
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

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={navigateToLeadership}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Leadership &amp; Governance
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={navigateToAdvisory}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Advisory Committee
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={navigateToTeam}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                          leader.isCutoutPortrait
                            ? PRINCIPAL_PORTRAIT_THUMB_BG_CLASS
                            : 'bg-white'
                        }`}
                      >
                        <img
                          src={leader.portraitSrc}
                          alt={leader.portraitAlt}
                          referrerPolicy="no-referrer"
                          style={
                            !leader.isCutoutPortrait && leader.portraitObjectPosition
                              ? { objectPosition: leader.portraitObjectPosition }
                              : undefined
                          }
                          className={
                            leader.isCutoutPortrait
                              ? PRINCIPAL_PORTRAIT_THUMB_IMG_CLASS
                              : 'w-full h-full object-cover object-top'
                          }
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                            {leader.shortDesignation}
                          </p>
                          {leader.academicDistinction && (
                            <span className="font-mono text-[10px] font-bold text-[var(--color-brand)] bg-[var(--color-brand-soft)] px-1.5 py-0.5 rounded border border-[var(--color-brand)]/20 truncate">
                              {leader.academicDistinction.degreeTitle}
                            </span>
                          )}
                        </div>
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

            {/* Student Perspectives: Insights into College Life Carousel */}
            <StudentInsightsCarousel onNavigateToAllStories={navigateToAlumni} />

            {/* Frequently Asked Questions Accordion Section */}
            <FaqSection
              faqs={activeFaqs}
              onOpenEnquiry={() => handleOpenEnquiry()}
            />

            {/* Contact & Institutional Identity */}
            <section id="contact" className="py-16 bg-[var(--color-canvas)]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                      CAPITOL HILL COLLEGE · Admissions &amp; Campus Desk
                    </p>
                    <h2 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
                      Contact &amp; Campus Location
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToContact()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    Open Admission &amp; Enquiry Form
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
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
        onNavigateAdvisory={navigateToAdvisory}
        onNavigateFacilities={navigateToFacilities}
        onNavigateGallery={navigateToGallery}
        onNavigateTeam={navigateToTeam}
        onNavigateAlumni={navigateToAlumni}
        onNavigateNotices={() => navigateToNotices(null)}
        onNavigateContact={() => navigateToContact()}
      />

      {/* Controlled Announcement Popup Modal */}
      <NoticePopupModal
        notice={popupNotice}
        onReadFullNotice={(slug) => navigateToNotices(slug)}
      />

      {/* Floating College Campus Guide (Local Predefined Dataset — Zero External AI APIs) */}
      <FaqChatbot onAction={handleChatbotAction} />
    </div>
  );
}
