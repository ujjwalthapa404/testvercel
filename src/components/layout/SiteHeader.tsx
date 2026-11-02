import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { CollegeLogo } from '../CollegeImage';

export type ActiveSiteView =
  | 'home'
  | 'leadership'
  | 'facilities'
  | 'team'
  | 'gallery'
  | 'alumni'
  | 'notices'
  | 'portal';

interface SiteHeaderProps {
  activeView: ActiveSiteView;
  userSignedIn: boolean;
  isAdmin: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateLeadership: () => void;
  onNavigateFacilities: () => void;
  onNavigateGallery: () => void;
  onNavigateTeam: () => void;
  onNavigateAlumni: () => void;
  onNavigateNotices: () => void;
  onNavigatePortal: () => void;
  onSignIn: () => void;
  onOpenEnquiry: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  activeView,
  userSignedIn,
  isAdmin,
  mobileMenuOpen,
  onToggleMobileMenu,
  onNavigateHome,
  onNavigateLeadership,
  onNavigateFacilities,
  onNavigateGallery,
  onNavigateTeam,
  onNavigateAlumni,
  onNavigateNotices,
  onNavigatePortal,
  onSignIn,
  onOpenEnquiry,
}) => {
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setExploreMenuOpen(false);
  }, [activeView]);

  useEffect(() => {
    if (!exploreMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(e.target as Node)) {
        setExploreMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExploreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [exploreMenuOpen]);

  const navLinkClass = (isActive: boolean) =>
    `hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      isActive
        ? 'text-white font-semibold underline decoration-white decoration-2'
        : 'text-white/90'
    }`;

  const mobileNavLinkClass = (isActive = false) =>
    `block w-full text-left py-2.5 text-sm transition-colors cursor-pointer ${
      isActive
        ? 'font-semibold text-white underline underline-offset-4 decoration-white decoration-2'
        : 'font-medium text-white/90 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-brand)] text-white border-b border-white/15 shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-5">
        {/* Zone 1: Official Crest Logo + Single-Line Brand Title */}
        <button
          type="button"
          onClick={() => onNavigateHome()}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-white"
        >
          <CollegeLogo size="sm" variant="light" />
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-white">
            Capitol Hill College
          </span>
        </button>

        {/* Zone 2: Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-5 2xl:gap-6 text-sm font-medium text-white/90"
        >
          <button
            type="button"
            onClick={() => onNavigateHome()}
            aria-current={activeView === 'home' ? 'page' : undefined}
            className={`${navLinkClass(activeView === 'home')} focus-visible:outline-white`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onNavigateHome('programs')}
            className="text-white/90 hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white"
          >
            Academic Program
          </button>

          <button
            type="button"
            onClick={onNavigateLeadership}
            aria-current={activeView === 'leadership' ? 'page' : undefined}
            className={`${navLinkClass(activeView === 'leadership')} focus-visible:outline-white`}
          >
            Leadership
          </button>

          <button
            type="button"
            onClick={onNavigateFacilities}
            aria-current={activeView === 'facilities' ? 'page' : undefined}
            className={`${navLinkClass(activeView === 'facilities')} focus-visible:outline-white`}
          >
            Facilities &amp; Services
          </button>

          <button
            type="button"
            onClick={onNavigateGallery}
            aria-current={activeView === 'gallery' ? 'page' : undefined}
            className={`${navLinkClass(activeView === 'gallery')} focus-visible:outline-white`}
          >
            Gallery
          </button>

          <button
            type="button"
            onClick={onNavigateAlumni}
            aria-current={activeView === 'alumni' ? 'page' : undefined}
            className={`${navLinkClass(activeView === 'alumni')} focus-visible:outline-white`}
          >
            Alumni
          </button>

          {/* Clean Explore Dropdown housing Governance, Faculty, Notices, FAQ, Contact & Portal */}
          <div ref={exploreMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setExploreMenuOpen((prev) => !prev)}
              aria-expanded={exploreMenuOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white hover:text-white ${
                activeView === 'team' || activeView === 'notices' || activeView === 'portal'
                  ? 'text-white font-semibold underline underline-offset-8 decoration-white decoration-2'
                  : 'text-white/90'
              }`}
            >
              Explore
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  exploreMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {exploreMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-60 rounded-xl bg-white border border-[var(--color-hairline)] shadow-lg py-2 z-50 text-[var(--color-ink)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateHome('about');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                >
                  About Capitol Hill College
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateLeadership();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                    activeView === 'leadership'
                      ? 'font-semibold text-[var(--color-brand)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                  }`}
                >
                  Leadership &amp; Governance
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateTeam();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                    activeView === 'team'
                      ? 'font-semibold text-[var(--color-brand)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                  }`}
                >
                  Team Member (Faculty &amp; Staff)
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateAlumni();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                    activeView === 'alumni'
                      ? 'font-semibold text-[var(--color-brand)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                  }`}
                >
                  Alumni &amp; Testimonials
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateNotices();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                    activeView === 'notices'
                      ? 'font-semibold text-[var(--color-brand)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                  }`}
                >
                  Notices &amp; Updates
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateHome('faq');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                >
                  Student FAQ
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setExploreMenuOpen(false);
                    onNavigateHome('contact');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                >
                  Contact
                </button>
                <div className="my-1.5 border-t border-[var(--color-hairline)]" />
                {userSignedIn ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setExploreMenuOpen(false);
                      onNavigatePortal();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-semibold text-[var(--color-brand)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
                  >
                    {isAdmin ? 'Admin Dashboard' : 'My Student Portal'}
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setExploreMenuOpen(false);
                      onSignIn();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-semibold text-[var(--color-brand)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
                  >
                    Staff &amp; Student Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenEnquiry}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[var(--color-brand)] bg-white hover:bg-[var(--color-canvas)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            Apply for Admission
          </button>

          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[var(--color-brand-dark)] border-t border-white/15 px-6 py-4 space-y-1">
          <button
            type="button"
            onClick={() => onNavigateHome()}
            className={mobileNavLinkClass(activeView === 'home')}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('about')}
            className={mobileNavLinkClass()}
          >
            About
          </button>
          <button
            type="button"
            onClick={onNavigateLeadership}
            aria-current={activeView === 'leadership' ? 'page' : undefined}
            className={mobileNavLinkClass(activeView === 'leadership')}
          >
            Leadership &amp; Governance
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('programs')}
            className={mobileNavLinkClass()}
          >
            Academic Program
          </button>
          <button
            type="button"
            onClick={onNavigateFacilities}
            className={mobileNavLinkClass(activeView === 'facilities')}
          >
            Facilities &amp; Services
          </button>
          <button
            type="button"
            onClick={onNavigateTeam}
            className={mobileNavLinkClass(activeView === 'team')}
          >
            Team Member
          </button>
          <button
            type="button"
            onClick={onNavigateGallery}
            className={mobileNavLinkClass(activeView === 'gallery')}
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={onNavigateAlumni}
            aria-current={activeView === 'alumni' ? 'page' : undefined}
            className={mobileNavLinkClass(activeView === 'alumni')}
          >
            Alumni &amp; Testimonials
          </button>
          <button
            type="button"
            onClick={onNavigateNotices}
            className={mobileNavLinkClass(activeView === 'notices')}
          >
            Notices
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('faq')}
            className={mobileNavLinkClass()}
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('contact')}
            className={mobileNavLinkClass()}
          >
            Contact
          </button>

          <div className="pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="w-full min-h-11 px-4 py-2.5 text-sm font-semibold text-[var(--color-brand)] bg-white hover:bg-[var(--color-canvas)] rounded-lg transition-colors cursor-pointer"
            >
              Apply for Admission
            </button>
            {userSignedIn ? (
              <button
                type="button"
                onClick={onNavigatePortal}
                className="w-full min-h-11 px-4 py-2.5 text-sm font-medium text-white border border-white/25 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                {isAdmin ? 'Admin Dashboard' : 'My Portal'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="w-full min-h-11 px-4 py-2.5 text-sm font-medium text-white border border-white/25 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                Staff &amp; Student Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
