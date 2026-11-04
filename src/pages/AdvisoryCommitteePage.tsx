import React, { useMemo } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import {
  ADVISORY_COMMITTEE_MEMBERS,
  ADVISORY_DOMAINS,
  ADVISORY_MANDATE_PILLARS,
  ADVISORY_PAGE_COPY,
  AdvisoryCommitteeMember,
} from '../data/advisoryCommittee';
import { getPersonInitials } from '../data/team';

interface AdvisoryCommitteePageProps {
  onNavigateHome: () => void;
  onNavigateLeadership: () => void;
  onNavigateTeam: () => void;
  onNavigateContact: () => void;
}

const AdvisoryMemberCard: React.FC<{ member: AdvisoryCommitteeMember }> = ({ member }) => {
  const initials = getPersonInitials(member.fullName);

  return (
    <article className="bg-white border border-[var(--color-hairline)] rounded-xl overflow-hidden flex flex-col">
      <div className="aspect-[4/5] w-full bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] overflow-hidden">
        {member.portraitSrc ? (
          <img
            src={member.portraitSrc}
            alt={member.portraitAlt || `${member.fullName}, ${member.advisoryRole} at CAPITOL HILL COLLEGE`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            style={
              member.portraitObjectPosition
                ? { objectPosition: member.portraitObjectPosition }
                : undefined
            }
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-primary-ink)] text-white p-8 select-none">
            <span className="font-display text-4xl font-semibold tracking-wider text-white/90">
              {initials}
            </span>
            <span className="mt-3 text-xs uppercase tracking-[0.16em] text-white/65">
              CAPITOL HILL COLLEGE
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
            {member.advisoryRole}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
            {member.fullName}
          </h3>
          {member.qualifications && (
            <p className="mt-1 text-xs font-medium text-[var(--color-ink)]">
              {member.qualifications}
            </p>
          )}
          {member.institutionalAffiliation && (
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {member.institutionalAffiliation}
            </p>
          )}
          {member.shortBio && (
            <p className="mt-4 pt-4 border-t border-[var(--color-hairline)] text-sm text-[var(--color-ink)] leading-relaxed">
              {member.shortBio}
            </p>
          )}
        </div>

        {member.focusArea && (
          <p className="mt-4 pt-3 border-t border-[var(--color-hairline)] text-xs text-[var(--color-muted)]">
            Advisory Focus · {member.focusArea}
          </p>
        )}
      </div>
    </article>
  );
};

export const AdvisoryCommitteePage: React.FC<AdvisoryCommitteePageProps> = ({
  onNavigateHome,
  onNavigateLeadership,
  onNavigateTeam,
  onNavigateContact,
}) => {
  const sortedMembers = useMemo(
    () => [...ADVISORY_COMMITTEE_MEMBERS].sort((a, b) => a.sortOrder - b.sortOrder),
    []
  );

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
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-6"
          >
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <button
              type="button"
              onClick={onNavigateLeadership}
              className="hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              Leadership &amp; Governance
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-medium text-[var(--color-primary-ink)]">
              {ADVISORY_PAGE_COPY.pageName}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                {ADVISORY_PAGE_COPY.kicker}
              </p>

              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight leading-[1.08] text-[var(--color-primary-ink)]">
                {ADVISORY_PAGE_COPY.mainHeading}
              </h1>

              <p className="mt-3 font-display text-xl sm:text-2xl font-medium text-[var(--color-ink)]">
                {ADVISORY_PAGE_COPY.supportingHeading}
              </p>

              <p className="mt-5 text-[15px] sm:text-base lg:text-[17px] text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
                {ADVISORY_PAGE_COPY.introduction}
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
                      onClick={() => scrollToSection('advisory-roster')}
                      className="w-full flex items-center justify-between text-left font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                    >
                      <span>Committee Roster</span>
                      <span className="font-mono text-xs text-[var(--color-muted)] tabular-nums">
                        01
                      </span>
                    </button>
                  </li>
                  <li className="py-2.5">
                    <button
                      type="button"
                      onClick={() => scrollToSection('advisory-mandate')}
                      className="w-full flex items-center justify-between text-left font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                    >
                      <span>Consultative Mandate</span>
                      <span className="font-mono text-xs text-[var(--color-muted)] tabular-nums">
                        02
                      </span>
                    </button>
                  </li>
                  <li className="py-2.5 last:pb-0">
                    <button
                      type="button"
                      onClick={() => scrollToSection('advisory-domains')}
                      className="w-full flex items-center justify-between text-left font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
                    >
                      <span>Academic Advisory Domains</span>
                      <span className="font-mono text-xs text-[var(--color-muted)] tabular-nums">
                        03
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Structured Committee Members Section */}
      <section
        id="advisory-roster"
        aria-labelledby="advisory-roster-heading"
        className="scroll-mt-20 py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                {ADVISORY_PAGE_COPY.rosterSectionKicker}
              </p>
              <h2
                id="advisory-roster-heading"
                className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
              >
                {ADVISORY_PAGE_COPY.rosterSectionHeading}
              </h2>
              <p className="mt-3 text-base text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
                {ADVISORY_PAGE_COPY.rosterSectionIntro}
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateLeadership}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>Board &amp; Executive Leadership</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {sortedMembers.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {sortedMembers.map((member) => (
                <AdvisoryMemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="mt-10 bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                    Official Institutional Roster · CAPITOL HILL COLLEGE
                  </p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
                    Committee Appointments &amp; Verification Framework
                  </h3>
                  <p className="mt-3.5 text-[15px] sm:text-base text-[var(--color-ink)] leading-relaxed max-w-[64ch]">
                    CAPITOL HILL COLLEGE maintains a strict institutional policy of publishing only
                    formally verified biographical profiles, academic credentials, and official
                    appointments approved by the Board of Directors.
                  </p>
                  <p className="mt-3 text-sm sm:text-[15px] text-[var(--color-muted)] leading-relaxed max-w-[64ch]">
                    Individual Advisory Committee dossiers—including full names, academic
                    affiliations, areas of specialization, and portraits—are published directly in
                    this directory upon formal administrative confirmation. For current governance
                    and academic leadership profiles, please consult our Board of Directors and
                    Faculty directories.
                  </p>

                  <div className="mt-6 pt-5 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={onNavigateLeadership}
                      className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>View Board &amp; Executive Leadership</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateTeam}
                      className="inline-flex items-center justify-center min-h-11 px-5 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Explore Academic Faculty
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[var(--color-canvas)]/70 border border-[var(--color-hairline)] rounded-xl p-5 sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-primary-ink)]">
                    Governance Relationship
                  </p>
                  <dl className="mt-4 divide-y divide-[var(--color-hairline)] text-sm">
                    <div className="py-3 first:pt-0">
                      <dt className="text-xs font-semibold text-[var(--color-muted)]">
                        Appointing Authority
                      </dt>
                      <dd className="mt-0.5 font-medium text-[var(--color-primary-ink)]">
                        Board of Directors · CAPITOL HILL COLLEGE
                      </dd>
                    </div>
                    <div className="py-3">
                      <dt className="text-xs font-semibold text-[var(--color-muted)]">
                        Institutional Role
                      </dt>
                      <dd className="mt-0.5 font-medium text-[var(--color-primary-ink)]">
                        Consultative Academic &amp; Strategic Counsel
                      </dd>
                    </div>
                    <div className="py-3">
                      <dt className="text-xs font-semibold text-[var(--color-muted)]">
                        Academic Scope
                      </dt>
                      <dd className="mt-0.5 font-medium text-[var(--color-primary-ink)]">
                        NEB Higher Secondary (+2) &amp; TU Degree Programs (BBS, MBS)
                      </dd>
                    </div>
                    <div className="py-3 last:pb-0">
                      <dt className="text-xs font-semibold text-[var(--color-muted)]">
                        Campus Secretariat
                      </dt>
                      <dd className="mt-0.5 font-medium text-[var(--color-primary-ink)]">
                        Teku, Kathmandu · 01-5312399
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 02: Consultative Mandate Pillars */}
      <section
        id="advisory-mandate"
        aria-labelledby="advisory-mandate-heading"
        className="scroll-mt-20 py-16 sm:py-20 bg-white border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              Consultative Framework
            </p>
            <h2
              id="advisory-mandate-heading"
              className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              Role &amp; Mandate of the Advisory Committee
            </h2>
            <p className="mt-3 text-base text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
              Working alongside our Board of Directors and Principal&apos;s Office, the Advisory
              Committee contributes external insight across curriculum enrichment, student career
              preparation, and institutional development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {ADVISORY_MANDATE_PILLARS.map((pillar) => (
              <div
                key={pillar.indexLabel}
                className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-6 sm:p-8"
              >
                <span className="font-mono text-xs font-semibold text-[var(--color-brand)] tabular-nums">
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

      {/* Section 03: Academic Advisory Domains */}
      <section
        id="advisory-domains"
        aria-labelledby="advisory-domains-heading"
        className="scroll-mt-20 py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              Subject &amp; Program Alignment
            </p>
            <h2
              id="advisory-domains-heading"
              className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              Areas of Institutional Consultation
            </h2>
          </div>

          <div className="bg-white border border-[var(--color-hairline)] rounded-xl divide-y divide-[var(--color-hairline)]">
            {ADVISORY_DOMAINS.map((item) => (
              <div
                key={item.indexLabel}
                className="p-6 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-[var(--color-brand)] tabular-nums">
                    {item.indexLabel}.
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--color-primary-ink)]">
                    {item.domain}
                  </h3>
                </div>
                <p className="text-sm text-[var(--color-muted)] md:max-w-xl md:text-right">
                  {item.scope}
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
              CAPITOL HILL COLLEGE · Teku, Kathmandu
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Institutional Enquiries &amp; Academic Correspondence
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
              For institutional correspondence, academic partnerships, or admission enquiries,
              connect directly with our campus administration in Teku, Kathmandu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={onNavigateContact}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Contact &amp; Enquiries</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={onNavigateLeadership}
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-medium text-white border border-white/30 bg-white/5 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Leadership &amp; Governance
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
