import React, { useCallback, useRef, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import {
  BOARD_OF_DIRECTORS,
  EXECUTIVE_LEADERSHIP,
  GOVERNANCE_PILLARS,
  LEADERSHIP_PAGE_COPY,
  LeadershipMemberProfile,
} from '../data/leadershipData';
import { BoardOfDirectors } from '../components/leadership/BoardOfDirectors';
import { ExecutiveLeadership } from '../components/leadership/ExecutiveLeadership';
import { LeadershipProfileModal } from '../components/leadership/LeadershipProfileModal';

interface LeadershipPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateTeam: () => void;
  onOpenEnquiry: () => void;
}

export const LeadershipPage: React.FC<LeadershipPageProps> = ({
  onNavigateHome,
  onNavigateTeam,
  onOpenEnquiry,
}) => {
  const [selectedMember, setSelectedMember] =
    useState<LeadershipMemberProfile | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const handleOpenProfile = useCallback(
    (member: LeadershipMemberProfile, triggerEl: HTMLElement | null) => {
      lastTriggerRef.current = triggerEl;
      setSelectedMember(member);
    },
    []
  );

  const handleCloseProfile = useCallback(() => {
    setSelectedMember(null);
    const previousTrigger = lastTriggerRef.current;
    if (previousTrigger) {
      window.requestAnimationFrame(() => {
        previousTrigger.focus();
      });
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-[var(--color-ink)]">
      {/* Editorial Institutional Page Header */}
      <section className="bg-white border-b border-[var(--color-hairline)] pt-10 pb-14 sm:pt-14 sm:pb-18 lg:pt-18 lg:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-6"
          >
            <button
              type="button"
              onClick={() => onNavigateHome()}
              className="hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-medium text-[var(--color-primary-ink)]">
              {LEADERSHIP_PAGE_COPY.pageName}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                {LEADERSHIP_PAGE_COPY.kicker}
              </p>

              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight leading-[1.08] text-[var(--color-primary-ink)]">
                {LEADERSHIP_PAGE_COPY.mainHeading}
              </h1>

              <p className="mt-3 font-display text-xl sm:text-2xl font-medium text-[var(--color-ink)]">
                {LEADERSHIP_PAGE_COPY.supportingHeading}
              </p>

              <p className="mt-5 text-[15px] sm:text-base lg:text-[17px] text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
                {LEADERSHIP_PAGE_COPY.introduction}
              </p>
            </div>

            {/* Right-aligned Institutional Quick Directory */}
            <div className="lg:col-span-4">
              <div className="border border-[var(--color-hairline)] rounded-xl bg-[var(--color-canvas)]/55 p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)] mb-3">
                  On This Page
                </p>
                <ul className="divide-y divide-[var(--color-hairline)] text-sm">
                  <li className="py-2.5 first:pt-0">
                    <button
                      type="button"
                      onClick={() => scrollToSection('board-of-directors')}
                      className="w-full flex items-center justify-between text-left font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                    >
                      <span>Board of Directors</span>
                      <span className="font-mono text-xs text-[var(--color-muted)]">01</span>
                    </button>
                  </li>
                  <li className="py-2.5">
                    <button
                      type="button"
                      onClick={() => scrollToSection('executive-leadership')}
                      className="w-full flex items-center justify-between text-left font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                    >
                      <span>Executive Leadership</span>
                      <span className="font-mono text-xs text-[var(--color-muted)]">02</span>
                    </button>
                  </li>
                  <li className="py-2.5 last:pb-0">
                    <button
                      type="button"
                      onClick={() => scrollToSection('governance-mandate')}
                      className="w-full flex items-center justify-between text-left font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                    >
                      <span>Governance Principles</span>
                      <span className="font-mono text-xs text-[var(--color-muted)]">03</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Board of Directors */}
      <BoardOfDirectors
        members={BOARD_OF_DIRECTORS}
        onSelectProfile={handleOpenProfile}
      />

      {/* Section 02: Executive Leadership */}
      <ExecutiveLeadership
        members={EXECUTIVE_LEADERSHIP}
        onSelectProfile={handleOpenProfile}
      />

      {/* Section 03: Institutional Governance Principles */}
      <section
        id="governance-mandate"
        aria-labelledby="governance-mandate-heading"
        className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              Institutional Stewardship
            </p>
            <h2
              id="governance-mandate-heading"
              className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              Governance &amp; Academic Accountability
            </h2>
            <p className="mt-3 text-base text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
              Leadership at Capitol Hill College operates through clear accountability between
              board-level strategic oversight and day-to-day academic management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {GOVERNANCE_PILLARS.map((pillar) => (
              <div
                key={pillar.indexLabel}
                className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-8"
              >
                <span className="font-mono text-xs font-semibold text-[var(--color-brand)]">
                  {pillar.indexLabel}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-[var(--color-primary-ink)]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authoritative Institutional Closing Band */}
      <section className="bg-[var(--color-primary-ink)] text-white border-t-4 border-t-[var(--color-brand)] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)]">
              Academic Community &amp; Admissions
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Connect with Capitol Hill College
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
              Explore our academic departments and faculty directory, or reach out to our Teku
              campus office for institutional partnerships and admission enquiries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Contact Admissions Desk</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={onNavigateTeam}
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-medium text-white border border-white/30 bg-white/5 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              View Faculty &amp; Staff Directory
            </button>
          </div>
        </div>
      </section>

      {/* Accessible Profile Modal */}
      <LeadershipProfileModal
        member={selectedMember}
        onClose={handleCloseProfile}
      />
    </div>
  );
};
