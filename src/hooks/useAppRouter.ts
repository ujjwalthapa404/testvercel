import { useCallback, useEffect, useState } from 'react';
import {
  AcademicProgramSlug,
  getAcademicProgramBySlug,
} from '../data/academicPrograms';
import {
  isDeferredPortalPath,
  navigateBrowserUrl,
  ParsedRoute,
  parseLocationRoute,
} from '../utils/routing';

export type RouteState =
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

function getRouteSeoMetadata(route: RouteState): { title: string; description: string } {
  switch (route.view) {
    case 'programs':
      return {
        title: 'Academic Programs | CAPITOL HILL COLLEGE — NEB (+2), BBS & MBS',
        description:
          'Explore CAPITOL HILL COLLEGE academic programs in Teku, Kathmandu: NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS).',
      };
    case 'program-detail': {
      const program = getAcademicProgramBySlug(route.programSlug);
      if (program) {
        return {
          title: program.seo.title,
          description: program.seo.description,
        };
      }
      break;
    }
    case 'leadership':
      return {
        title: 'Leadership & Governance | CAPITOL HILL COLLEGE — Teku, Kathmandu',
        description:
          'Meet the Chairman, Board of Directors, and Principal leading CAPITOL HILL COLLEGE in Teku, Kathmandu.',
      };
    case 'advisory':
      return {
        title: 'Advisory Committee | CAPITOL HILL COLLEGE — Teku, Kathmandu',
        description:
          'Consultative governance, academic quality advisory mandate, and institutional guidance at CAPITOL HILL COLLEGE, Teku, Kathmandu.',
      };
    case 'team':
      return {
        title: 'Academic & Professional Team | CAPITOL HILL COLLEGE',
        description:
          'Meet the Board of Directors, Principal, dedicated faculty across 15 academic departments, and professional staff at CAPITOL HILL COLLEGE, Teku, Kathmandu.',
      };
    case 'facilities':
      return {
        title: 'Facilities & Services | CAPITOL HILL COLLEGE — Teku, Kathmandu',
        description:
          'Explore classrooms, library, specialized laboratories, cafeteria, ECA & CCA, and sports facilities at CAPITOL HILL COLLEGE in Teku, Kathmandu.',
      };
    case 'gallery':
      return {
        title: 'Our Gallery | CAPITOL HILL COLLEGE — Student Life & Campus Moments',
        description:
          'Discover student classroom life, sports, educational tours, welcome programs, quiz competitions, science practicals, and farewell memories at CAPITOL HILL COLLEGE, Teku, Kathmandu.',
      };
    case 'alumni':
      return {
        title: 'Student Voices & Achievements | CAPITOL HILL COLLEGE — Our Students, Our Pride',
        description:
          'Discover inspiring student voices, academic achievements, board toppers, and authentic testimonials from CAPITOL HILL COLLEGE students in Teku, Kathmandu.',
      };
    case 'notices':
      return {
        title: 'Notices & Announcements | CAPITOL HILL COLLEGE',
        description:
          'Official admission updates, examination schedules, events, and academic notices from CAPITOL HILL COLLEGE, Teku, Kathmandu.',
      };
    case 'contact':
      return {
        title: 'Contact & Admission Enquiry | CAPITOL HILL COLLEGE — Teku, Kathmandu',
        description:
          'Contact CAPITOL HILL COLLEGE in Teku, Kathmandu (01-5312399 · info.capitolhillcollege@gmail.com) or submit an online admission enquiry for NEB (+2), BBS, and MBS programs.',
      };
    case 'home':
    default:
      break;
  }

  return {
    title: 'CAPITOL HILL COLLEGE | ...Shaping Futures Since 2005... · Teku, Kathmandu',
    description:
      'CAPITOL HILL COLLEGE (...Shaping Futures Since 2005...) in Teku, Kathmandu offers NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS) programs.',
  };
}

/**
 * Manages client-side SPA routing, history synchronization, deferred portal route guards,
 * smooth section scrolling, and per-route document metadata.
 */
export function useAppRouter(onNavigateSideEffect?: () => void) {
  const [route, setRoute] = useState<RouteState>(() => readBrowserRoute());

  /* Scroll to section anchor when navigating directly to a homepage section URL */
  useEffect(() => {
    if (route.view === 'home' && route.sectionId) {
      const targetId = route.sectionId;
      const timer = window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [route]);

  /* Sync with browser Back/Forward navigation and guard deferred Phase 2 portal URLs */
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

  /* Sync document title and meta description for SEO across views */
  useEffect(() => {
    const { title, description } = getRouteSeoMetadata(route);
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [route]);

  const navigateHome = useCallback(
    (sectionId?: string) => {
      const knownSection =
        sectionId === 'about' ||
        sectionId === 'programs' ||
        sectionId === 'faq' ||
        sectionId === 'contact'
          ? sectionId
          : undefined;

      setRoute({ view: 'home', sectionId: knownSection });
      onNavigateSideEffect?.();

      if (sectionId) {
        navigateBrowserUrl(knownSection ? `/${knownSection}` : `/#${sectionId}`);
        window.setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 40);
      } else {
        navigateBrowserUrl('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [onNavigateSideEffect]
  );

  const navigateToPrograms = useCallback(
    (slug?: AcademicProgramSlug) => {
      onNavigateSideEffect?.();
      if (slug) {
        setRoute({ view: 'program-detail', programSlug: slug });
        navigateBrowserUrl(`/academic-programs/${slug}`);
      } else {
        setRoute({ view: 'programs' });
        navigateBrowserUrl('/academic-programs');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [onNavigateSideEffect]
  );

  const navigateToLeadership = useCallback(() => {
    setRoute({ view: 'leadership' });
    onNavigateSideEffect?.();
    navigateBrowserUrl('/leadership-governance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateSideEffect]);

  const navigateToAdvisory = useCallback(() => {
    setRoute({ view: 'advisory' });
    onNavigateSideEffect?.();
    navigateBrowserUrl('/advisory-committee');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateSideEffect]);

  const navigateToFacilities = useCallback(() => {
    setRoute({ view: 'facilities' });
    onNavigateSideEffect?.();
    navigateBrowserUrl('/facilities-services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateSideEffect]);

  const navigateToTeam = useCallback(() => {
    setRoute({ view: 'team' });
    onNavigateSideEffect?.();
    navigateBrowserUrl('/team-member');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateSideEffect]);

  const navigateToGallery = useCallback(() => {
    setRoute({ view: 'gallery' });
    onNavigateSideEffect?.();
    navigateBrowserUrl('/gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateSideEffect]);

  const navigateToAlumni = useCallback(() => {
    setRoute({ view: 'alumni' });
    onNavigateSideEffect?.();
    navigateBrowserUrl('/alumni');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateSideEffect]);

  const navigateToNotices = useCallback(
    (slug?: string | null) => {
      const cleanSlug = slug ?? null;
      setRoute({ view: 'notices', slug: cleanSlug });
      onNavigateSideEffect?.();
      navigateBrowserUrl(cleanSlug ? `/notices/${encodeURIComponent(cleanSlug)}` : '/notices');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [onNavigateSideEffect]
  );

  const navigateToContact = useCallback(
    (programTitle?: string) => {
      setRoute({ view: 'contact', initialProgram: programTitle });
      onNavigateSideEffect?.();
      navigateBrowserUrl('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [onNavigateSideEffect]
  );

  return {
    route,
    navigateHome,
    navigateToPrograms,
    navigateToLeadership,
    navigateToAdvisory,
    navigateToFacilities,
    navigateToTeam,
    navigateToGallery,
    navigateToAlumni,
    navigateToNotices,
    navigateToContact,
  };
}
