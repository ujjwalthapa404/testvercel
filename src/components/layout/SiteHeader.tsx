import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import {
  AcademicProgramSlug,
  NEB_PLUS_TWO_PROGRAMS,
  OFFICIAL_CAMPUS_LOCATION,
  TU_DEGREE_PROGRAMS,
} from '../../data/academicPrograms';
import { CollegeLogo } from '../CollegeImage';

export type ActiveSiteView =
  | 'home'
  | 'programs'
  | 'program-detail'
  | 'leadership'
  | 'advisory'
  | 'facilities'
  | 'team'
  | 'gallery'
  | 'alumni'
  | 'notices'
  | 'contact';

interface SiteHeaderProps {
  activeView: ActiveSiteView;
  activeProgramSlug?: AcademicProgramSlug | null;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigateHome: (sectionId?: string) => void;
  onNavigatePrograms: (slug?: AcademicProgramSlug) => void;
  onNavigateLeadership: () => void;
  onNavigateAdvisory: () => void;
  onNavigateFacilities: () => void;
  onNavigateGallery: () => void;
  onNavigateTeam: () => void;
  onNavigateAlumni: () => void;
  onNavigateNotices: () => void;
  onNavigateContact: () => void;
  onOpenEnquiry: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  activeView,
  activeProgramSlug = null,
  mobileMenuOpen,
  onToggleMobileMenu,
  onNavigateHome,
  onNavigatePrograms,
  onNavigateLeadership,
  onNavigateAdvisory,
  onNavigateFacilities,
  onNavigateGallery,
  onNavigateTeam,
  onNavigateAlumni,
  onNavigateNotices,
  onNavigateContact,
  onOpenEnquiry,
}) => {
  const [programsMenuOpen, setProgramsMenuOpen] = useState(false);
  const [leadershipMenuOpen, setLeadershipMenuOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);

  const programsMenuRef = useRef<HTMLDivElement | null>(null);
  const leadershipMenuRef = useRef<HTMLDivElement | null>(null);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);

  const isProgramsActive = activeView === 'programs' || activeView === 'program-detail';
  const isLeadershipActive = activeView === 'leadership' || activeView === 'advisory';

  useEffect(() => {
    setProgramsMenuOpen(false);
    setLeadershipMenuOpen(false);
    setExploreMenuOpen(false);
  }, [activeView, activeProgramSlug]);

  useEffect(() => {
    if (!programsMenuOpen && !leadershipMenuOpen && !exploreMenuOpen) return;

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (programsMenuRef.current && !programsMenuRef.current.contains(target)) {
        setProgramsMenuOpen(false);
      }
      if (leadershipMenuRef.current && !leadershipMenuRef.current.contains(target)) {
        setLeadershipMenuOpen(false);
      }
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(target)) {
        setExploreMenuOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProgramsMenuOpen(false);
        setLeadershipMenuOpen(false);
        setExploreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [programsMenuOpen, leadershipMenuOpen, exploreMenuOpen]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[4.45rem] sm:h-[4.75rem] flex items-center justify-between gap-4 lg:gap-5">
        {/* Zone 1: Official Crest Logo + Prominent Uppercase College Name & Subordinate Tagline */}
        <button
          type="button"
          onClick={() => onNavigateHome()}
          className="flex items-center gap-3 sm:gap-3.5 whitespace-nowrap shrink-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-white"
        >
          <CollegeLogo size="header" variant="light" />
          <span className="flex flex-col justify-center">
            <span className="font-display text-[1.12rem] sm:text-[1.35rem] lg:text-[1.52rem] font-bold tracking-[0.02em] leading-[1.06] text-white uppercase">
              {OFFICIAL_CAMPUS_LOCATION.collegeName}
            </span>
            <span className="mt-1 font-sans text-[10px] sm:text-[10.5px] font-normal tracking-[0.04em] text-white/78 leading-tight">
              {OFFICIAL_CAMPUS_LOCATION.tagline}
            </span>
          </span>
        </button>

        {/* Zone 2: Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[13.5px] 2xl:text-sm font-medium text-white/90"
        >
          <button
            type="button"
            onClick={() => onNavigateHome()}
            aria-current={activeView === 'home' ? 'page' : undefined}
            className={`${navLinkClass(activeView === 'home')} focus-visible:outline-white`}
          >
            Home
          </button>

          {/* Academic Program: Direct Click Opens /academic-programs + Hover/Toggle Dropdown for All 6 Programs */}
          <div
            ref={programsMenuRef}
            className="relative py-2 -my-2"
            onMouseEnter={() => {
              setLeadershipMenuOpen(false);
              setExploreMenuOpen(false);
              setProgramsMenuOpen(true);
            }}
            onMouseLeave={() => setProgramsMenuOpen(false)}
          >
            <div className="inline-flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setProgramsMenuOpen(false);
                  onNavigatePrograms();
                }}
                aria-current={activeView === 'programs' ? 'page' : undefined}
                className={`${navLinkClass(isProgramsActive)} focus-visible:outline-white`}
              >
                Academic Program
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeadershipMenuOpen(false);
                  setExploreMenuOpen(false);
                  setProgramsMenuOpen((prev) => !prev);
                }}
                aria-label="Toggle Academic Programs menu"
                aria-expanded={programsMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center justify-center p-1 rounded text-white/90 hover:text-white cursor-pointer focus-visible:outline-white"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    programsMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {programsMenuOpen && (
              <div
                role="menu"
                aria-label="Academic Programs"
                className="absolute left-0 top-full pt-2 w-64 z-50"
              >
                <div className="rounded-xl bg-white border border-[var(--color-hairline)] shadow-lg py-2 text-[var(--color-ink)]">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProgramsMenuOpen(false);
                      onNavigatePrograms();
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                      activeView === 'programs'
                        ? 'font-semibold text-[var(--color-brand)]'
                        : 'font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)]'
                    }`}
                  >
                    All Academic Programs
                  </button>

                  <div className="my-1.5 border-t border-[var(--color-hairline)]" />

                  <p className="px-4 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    NEB (+2) Programs
                  </p>
                  {NEB_PLUS_TWO_PROGRAMS.map((prog) => {
                    const isCurrentProg =
                      activeView === 'program-detail' && activeProgramSlug === prog.slug;
                    return (
                      <button
                        key={prog.slug}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProgramsMenuOpen(false);
                          onNavigatePrograms(prog.slug);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                          isCurrentProg
                            ? 'font-semibold text-[var(--color-brand)]'
                            : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                        }`}
                      >
                        {prog.navLabel}
                      </button>
                    );
                  })}

                  <div className="my-1.5 border-t border-[var(--color-hairline)]" />

                  <p className="px-4 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Tribhuvan University
                  </p>
                  {TU_DEGREE_PROGRAMS.map((prog) => {
                    const isCurrentProg =
                      activeView === 'program-detail' && activeProgramSlug === prog.slug;
                    return (
                      <button
                        key={prog.slug}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProgramsMenuOpen(false);
                          onNavigatePrograms(prog.slug);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                          isCurrentProg
                            ? 'font-semibold text-[var(--color-brand)]'
                            : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                        }`}
                      >
                        {prog.navLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Leadership & Governance + Advisory Committee Submenu */}
          <div
            ref={leadershipMenuRef}
            className="relative py-2 -my-2"
            onMouseEnter={() => {
              setProgramsMenuOpen(false);
              setExploreMenuOpen(false);
              setLeadershipMenuOpen(true);
            }}
            onMouseLeave={() => setLeadershipMenuOpen(false)}
          >
            <div className="inline-flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setLeadershipMenuOpen(false);
                  onNavigateLeadership();
                }}
                aria-current={activeView === 'leadership' ? 'page' : undefined}
                className={`${navLinkClass(isLeadershipActive)} focus-visible:outline-white`}
              >
                Leadership
              </button>
              <button
                type="button"
                onClick={() => {
                  setProgramsMenuOpen(false);
                  setExploreMenuOpen(false);
                  setLeadershipMenuOpen((prev) => !prev);
                }}
                aria-label="Toggle Leadership and Advisory menu"
                aria-expanded={leadershipMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center justify-center p-1 rounded text-white/90 hover:text-white cursor-pointer focus-visible:outline-white"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    leadershipMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {leadershipMenuOpen && (
              <div
                role="menu"
                aria-label="Leadership and Governance"
                className="absolute left-0 top-full pt-2 w-60 z-50"
              >
                <div className="rounded-xl bg-white border border-[var(--color-hairline)] shadow-lg py-2 text-[var(--color-ink)]">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setLeadershipMenuOpen(false);
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
                      setLeadershipMenuOpen(false);
                      onNavigateAdvisory();
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                      activeView === 'advisory'
                        ? 'font-semibold text-[var(--color-brand)]'
                        : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                    }`}
                  >
                    Advisory Committee
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setLeadershipMenuOpen(false);
                      onNavigateTeam();
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                      activeView === 'team'
                        ? 'font-semibold text-[var(--color-brand)]'
                        : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                    }`}
                  >
                    Academic &amp; Professional Team
                  </button>
                </div>
              </div>
            )}
          </div>

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

          {/* Clean Explore Dropdown housing Governance, Advisory, Faculty, Notices, FAQ & Contact */}
          <div ref={exploreMenuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProgramsMenuOpen(false);
                setLeadershipMenuOpen(false);
                setExploreMenuOpen((prev) => !prev);
              }}
              aria-expanded={exploreMenuOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white hover:text-white ${
                activeView === 'team' ||
                activeView === 'notices' ||
                activeView === 'contact'
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
                className="absolute right-0 mt-3 w-64 rounded-xl bg-white border border-[var(--color-hairline)] shadow-lg py-2 z-50 text-[var(--color-ink)]"
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
                  About CAPITOL HILL COLLEGE
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
                    onNavigateAdvisory();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                    activeView === 'advisory'
                      ? 'font-semibold text-[var(--color-brand)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                  }`}
                >
                  Advisory Committee
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
                    onNavigateContact();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-canvas)] transition-colors cursor-pointer ${
                    activeView === 'contact'
                      ? 'font-semibold text-[var(--color-brand)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-brand)]'
                  }`}
                >
                  Contact &amp; Admission Enquiry
                </button>
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
        <div className="xl:hidden bg-[var(--color-brand-dark)] border-t border-white/15 px-6 py-4 space-y-1 max-h-[82dvh] overflow-y-auto">
          <button
            type="button"
            onClick={() => onNavigateHome()}
            className={mobileNavLinkClass(activeView === 'home')}
          >
            Home
          </button>

          {/* Mobile Academic Program Link + Expandable 6-Program Submenu */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onNavigatePrograms()}
                aria-current={activeView === 'programs' ? 'page' : undefined}
                className={`flex-1 text-left py-2.5 text-sm transition-colors cursor-pointer ${
                  isProgramsActive
                    ? 'font-semibold text-white underline underline-offset-4 decoration-white decoration-2'
                    : 'font-medium text-white/90 hover:text-white'
                }`}
              >
                Academic Program
              </button>
              <button
                type="button"
                onClick={() => setMobileProgramsOpen((prev) => !prev)}
                aria-expanded={mobileProgramsOpen}
                aria-label="Toggle individual academic program links"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    mobileProgramsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {mobileProgramsOpen && (
              <div className="pl-3 pb-2 mt-0.5 space-y-1 border-l border-white/20">
                <button
                  type="button"
                  onClick={() => onNavigatePrograms()}
                  className={`block w-full text-left py-1.5 text-xs transition-colors cursor-pointer ${
                    activeView === 'programs'
                      ? 'font-semibold text-white underline underline-offset-4'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  All Academic Programs
                </button>
                <p className="pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">
                  NEB (+2) Programs
                </p>
                {NEB_PLUS_TWO_PROGRAMS.map((prog) => {
                  const isCurrentProg =
                    activeView === 'program-detail' && activeProgramSlug === prog.slug;
                  return (
                    <button
                      key={prog.slug}
                      type="button"
                      onClick={() => onNavigatePrograms(prog.slug)}
                      className={`block w-full text-left py-1.5 text-xs transition-colors cursor-pointer ${
                        isCurrentProg
                          ? 'font-semibold text-white underline underline-offset-4'
                          : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {prog.navLabel}
                    </button>
                  );
                })}
                <p className="pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">
                  Tribhuvan University
                </p>
                {TU_DEGREE_PROGRAMS.map((prog) => {
                  const isCurrentProg =
                    activeView === 'program-detail' && activeProgramSlug === prog.slug;
                  return (
                    <button
                      key={prog.slug}
                      type="button"
                      onClick={() => onNavigatePrograms(prog.slug)}
                      className={`block w-full text-left py-1.5 text-xs transition-colors cursor-pointer ${
                        isCurrentProg
                          ? 'font-semibold text-white underline underline-offset-4'
                          : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {prog.navLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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
            onClick={onNavigateAdvisory}
            aria-current={activeView === 'advisory' ? 'page' : undefined}
            className={mobileNavLinkClass(activeView === 'advisory')}
          >
            Advisory Committee
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
            onClick={onNavigateContact}
            aria-current={activeView === 'contact' ? 'page' : undefined}
            className={mobileNavLinkClass(activeView === 'contact')}
          >
            Contact &amp; Enquiry
          </button>

          <div className="pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="w-full min-h-11 px-4 py-2.5 text-sm font-semibold text-[var(--color-brand)] bg-white hover:bg-[var(--color-canvas)] rounded-lg transition-colors cursor-pointer"
            >
              Apply for Admission
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
