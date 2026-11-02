export type ActiveView =
  | 'home'
  | 'notices'
  | 'facilities'
  | 'gallery'
  | 'team'
  | 'leadership'
  | 'alumni'
  | 'portal';

export type PortalTabId = 'notices' | 'faqs' | 'enquiries' | 'saved';

export interface ParsedRoute {
  view: ActiveView;
  noticeSlug?: string;
  portalTab?: PortalTabId;
  sectionId?: 'about' | 'programs' | 'faq' | 'contact';
}

function normalizeSegment(raw: string): string {
  return raw
    .trim()
    .replace(/^#+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
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
    lower === 'alumni' ||
    lower === 'alumni-testimonials' ||
    lower === 'testimonials'
  ) {
    return { view: 'alumni' };
  }
  if (lower === 'admin/faqs' || lower === 'portal/faqs') {
    return { view: 'portal', portalTab: 'faqs' };
  }
  if (lower === 'portal' || lower === 'admin') {
    return { view: 'portal' };
  }
  if (lower === 'about' || lower === 'about-us') {
    return { view: 'home', sectionId: 'about' };
  }
  if (
    lower === 'programs' ||
    lower === 'academic-programs' ||
    lower === 'courses'
  ) {
    return { view: 'home', sectionId: 'programs' };
  }
  if (lower === 'faq' || lower === 'faqs') {
    return { view: 'home', sectionId: 'faq' };
  }
  if (lower === 'contact' || lower === 'contact-us') {
    return { view: 'home', sectionId: 'contact' };
  }

  return null;
}

/**
 * Resolves both clean URL pathnames (e.g., `/about/`, `/contact/`, `/team-member/`,
 * `/leadership-governance/`, `/notices/slug`) and hash fragments (`#team-member`, `#about`)
 * so direct URL opens, page refreshes on Vercel, and in-page anchor links all work reliably.
 */
export function parseLocationRoute(pathname: string, hash: string): ParsedRoute {
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
