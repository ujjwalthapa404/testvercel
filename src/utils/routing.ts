import { AcademicProgramSlug, isAcademicProgramSlug } from '../data/academicPrograms';

export type ActiveView =
  | 'home'
  | 'programs'
  | 'program-detail'
  | 'notices'
  | 'facilities'
  | 'gallery'
  | 'team'
  | 'leadership'
  | 'advisory'
  | 'alumni'
  | 'contact';

export type PortalTabId = 'notices' | 'faqs' | 'enquiries' | 'saved';

export interface ParsedRoute {
  view: ActiveView;
  programSlug?: AcademicProgramSlug;
  noticeSlug?: string;
  portalTab?: PortalTabId;
  sectionId?: 'about' | 'programs' | 'faq' | 'contact';
}

const LEGACY_PROGRAM_ROUTE_ALIASES: Record<string, AcademicProgramSlug> = {
  '2management': 'management',
  'plus-two-management': 'management',
  '2humanities': 'humanities',
  'plus-two-humanities': 'humanities',
  '2science': 'science',
  'plus-two-science': 'science',
  '2law': 'law',
  'plus-two-law': 'law',
  bbs: 'bbs',
  mbs: 'mbs',
};

function normalizeSegment(raw: string): string {
  return raw
    .trim()
    .replace(/^#+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

export function isDeferredPortalPath(pathname: string, hash = ''): boolean {
  const cleanPath = normalizeSegment(pathname);
  const cleanHash = normalizeSegment(hash);
  return (
    cleanPath === 'portal' ||
    cleanPath.startsWith('portal/') ||
    cleanPath === 'admin' ||
    cleanPath.startsWith('admin/') ||
    cleanHash === 'portal' ||
    cleanHash.startsWith('portal/') ||
    cleanHash === 'admin' ||
    cleanHash.startsWith('admin/')
  );
}

function matchRouteToken(rawSegment: string): ParsedRoute | null {
  const cleaned = rawSegment
    .trim()
    .replace(/^#+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!cleaned) {
    return null;
  }

  const lower = cleaned.toLowerCase();

  if (lower.startsWith('academic-programs/') || lower.startsWith('programs/')) {
    const prefix = lower.startsWith('academic-programs/') ? 'academic-programs/' : 'programs/';
    const rawProgSlug = lower.slice(prefix.length).replace(/\/+$/, '');
    if (isAcademicProgramSlug(rawProgSlug)) {
      return {
        view: 'program-detail',
        programSlug: rawProgSlug,
      };
    }
    const aliasSlug = LEGACY_PROGRAM_ROUTE_ALIASES[rawProgSlug];
    if (aliasSlug) {
      return {
        view: 'program-detail',
        programSlug: aliasSlug,
      };
    }
    return { view: 'programs' };
  }

  if (lower in LEGACY_PROGRAM_ROUTE_ALIASES) {
    return {
      view: 'program-detail',
      programSlug: LEGACY_PROGRAM_ROUTE_ALIASES[lower],
    };
  }

  if (
    lower === 'academic-programs' ||
    lower === 'academic-program' ||
    lower === 'programs' ||
    lower === 'services' ||
    lower === 'courses'
  ) {
    return { view: 'programs' };
  }

  if (lower.startsWith('notices/')) {
    const rawSlug = cleaned.slice('notices/'.length).replace(/\/+$/, '');
    if (rawSlug) {
      return {
        view: 'notices',
        noticeSlug: decodeURIComponent(rawSlug),
      };
    }
    return { view: 'notices' };
  }

  if (lower === 'notices' || lower === 'announcements') {
    return { view: 'notices' };
  }
  if (lower === 'facilities-services' || lower === 'facilities') {
    return { view: 'facilities' };
  }
  if (lower === 'gallery' || lower === 'campus-gallery') {
    return { view: 'gallery' };
  }
  if (
    lower === 'team-member' ||
    lower === 'team-members' ||
    lower === 'team' ||
    lower === 'faculty'
  ) {
    return { view: 'team' };
  }
  if (
    lower === 'leadership-governance' ||
    lower === 'leadership' ||
    lower === 'governance' ||
    lower === 'board-of-directors'
  ) {
    return { view: 'leadership' };
  }
  if (
    lower === 'advisory-committee' ||
    lower === 'advisory' ||
    lower === 'advisory-board'
  ) {
    return { view: 'advisory' };
  }
  if (
    lower === 'alumni' ||
    lower === 'alumni-testimonials' ||
    lower === 'testimonials'
  ) {
    return { view: 'alumni' };
  }
  if (
    lower === 'contact' ||
    lower === 'contact-us' ||
    lower === 'enquiry' ||
    lower === 'admission-enquiry' ||
    lower === 'admissions-enquiry'
  ) {
    return { view: 'contact' };
  }
  /* Student & Admin Portal routes are deferred to Phase 2; redirect cleanly to Homepage */
  if (
    lower === 'portal' ||
    lower.startsWith('portal/') ||
    lower === 'admin' ||
    lower.startsWith('admin/')
  ) {
    return { view: 'home' };
  }
  if (lower === 'about' || lower === 'about-us') {
    return { view: 'home', sectionId: 'about' };
  }
  if (lower === 'faq' || lower === 'faqs') {
    return { view: 'home', sectionId: 'faq' };
  }

  return null;
}

/**
 * Resolves both clean URL pathnames (e.g., `/about/`, `/contact/`, `/team-member/`,
 * `/leadership-governance/`, `/notices/slug`) and hash fragments (`#team-member`, `#about`)
 * so direct URL opens, page refreshes on Vercel, and in-page anchor links all work reliably.
 */
export function parseLocationRoute(pathname: string, hash = ''): ParsedRoute {
  const hashClean = normalizeSegment(hash);
  if (hashClean) {
    const fromHash = matchRouteToken(hash);
    if (fromHash) {
      return fromHash;
    }
  }

  const fromPathname = matchRouteToken(pathname);
  if (fromPathname) {
    return fromPathname;
  }

  return { view: 'home' };
}

/**
 * Updates the browser URL cleanly without triggering a full document reload.
 */
export function navigateBrowserUrl(targetPath: string): void {
  if (typeof window === 'undefined') return;
  const normalizedTarget = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  const currentFull = `${window.location.pathname}${window.location.hash}`;
  if (currentFull !== normalizedTarget) {
    window.history.pushState(null, '', normalizedTarget);
  }
}
