import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { LeadershipMemberProfile } from '../../data/leadershipData';
import {
  PRINCIPAL_PORTRAIT_4X5_IMG_CLASS,
  PRINCIPAL_PORTRAIT_BG_CLASS,
} from '../../utils/portraitFraming';

export type ProfileModalTab = 'dossier' | 'message';

interface LeadershipProfileModalProps {
  member: LeadershipMemberProfile | null;
  initialTab?: ProfileModalTab;
  onClose: () => void;
}

function getInitials(fullName: string): string {
  const cleaned = fullName
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Er\.)\s+/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const LeadershipProfileModal: React.FC<LeadershipProfileModalProps> = ({
  member,
  initialTab = 'dossier',
  onClose,
}) => {
  const [entered, setEntered] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileModalTab>('dossier');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setImageFailed(false);
    if (!member) {
      setEntered(false);
      return;
    }

    const resolvedTab: ProfileModalTab =
      initialTab === 'message' && member.officialMessage ? 'message' : 'dossier';
    setActiveTab(resolvedTab);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const rafId = window.requestAnimationFrame(() => {
      setEntered(true);
      closeBtnRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [member, initialTab, onClose]);

  const handleSwitchTab = (tab: ProfileModalTab) => {
    setActiveTab(tab);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!member) {
    return null;
  }

  const showPortrait = Boolean(member.portraitSrc) && !imageFailed;
  const initials = getInitials(member.fullName);
  const hasMessage = Boolean(member.officialMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${member.fullName} — Leadership Profile`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs transition-opacity duration-200 ${
        entered ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={dialogRef}
        className={`relative w-full max-w-5xl max-h-[90vh] bg-white border border-[var(--color-hairline)] rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          entered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.99]'
        }`}
      >
        {/* Top Institutional Bar with Accessible Close Control */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)] truncate">
            CAPITOL HILL COLLEGE · Official Leadership Profile
          </p>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close leadership profile"
            className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:bg-white border border-transparent hover:border-[var(--color-hairline)] transition-colors cursor-pointer shrink-0"
          >
            <span>Close</span>
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Scrollable Two-Column Dossier Content */}
        <div ref={scrollContainerRef} className="overflow-y-auto overscroll-contain flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Formal Portrait & Institutional Summary */}
            <div className="lg:col-span-5 bg-[var(--color-canvas)]/65 border-b lg:border-b-0 lg:border-r border-[var(--color-hairline)] p-6 sm:p-8 flex flex-col">
              <div
                className={`aspect-[4/5] w-full max-w-sm mx-auto lg:max-w-none rounded-lg overflow-hidden border border-[var(--color-hairline)] ${
                  member.isCutoutPortrait ? PRINCIPAL_PORTRAIT_BG_CLASS : 'bg-neutral-200'
                }`}
              >
                {showPortrait ? (
                  <img
                    src={member.portraitSrc}
                    alt={member.portraitAlt}
                    onError={() => setImageFailed(true)}
                    style={
                      !member.isCutoutPortrait && member.portraitObjectPosition
                        ? { objectPosition: member.portraitObjectPosition }
                        : undefined
                    }
                    className={
                      member.isCutoutPortrait
                        ? PRINCIPAL_PORTRAIT_4X5_IMG_CLASS
                        : 'w-full h-full object-cover object-top'
                    }
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-primary-ink)] text-white p-8">
                    <span className="font-display text-4xl font-semibold tracking-wider text-white/90">
                      {initials}
                    </span>
                    <span className="mt-3 text-xs uppercase tracking-[0.16em] text-white/60">
                      CAPITOL HILL COLLEGE
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile / Tablet Profile Header (Shown below portrait on < lg) */}
              <div className="mt-6 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                  {member.modalRoleLine}
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
                  {member.fullName}
                </h2>
                {member.professionalTagline && (
                  <p className="mt-1.5 text-sm font-medium text-[var(--color-muted)]">
                    {member.professionalTagline}
                  </p>
                )}
                {member.academicDistinction && (
                  <div className="mt-4 bg-white border border-[var(--color-hairline)] rounded-lg px-4 py-3">
                    <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
                      Academic Distinction
                    </p>
                    <p className="mt-1 font-display text-sm sm:text-[15px] font-semibold text-[var(--color-primary-ink)]">
                      {member.academicDistinction.formattedLine}
                    </p>
                  </div>
                )}
              </div>

              {/* Institutional Affiliation Metadata */}
              <div className="mt-6 pt-5 border-t border-[var(--color-hairline)] space-y-3 text-xs text-[var(--color-muted)]">
                <div>
                  <span className="block font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-ink)]">
                    Institution
                  </span>
                  <span className="mt-0.5 block">
                    CAPITOL HILL COLLEGE · Teku, Kathmandu, Nepal
                  </span>
                </div>
                <div>
                  <span className="block font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-ink)]">
                    Governance Division
                  </span>
                  <span className="mt-0.5 block">
                    {member.category === 'board'
                      ? 'Board of Directors'
                      : 'Executive Leadership'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Structured Biographical Sections OR Canonical Official Message */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 space-y-8">
              {/* Desktop Profile Header */}
              <header className="hidden lg:block pb-6 border-b border-[var(--color-hairline)]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                  {member.modalRoleLine}
                </p>
                <h2
                  id="leadership-profile-modal-name"
                  className="mt-2 text-3xl xl:text-[2.15rem] font-semibold tracking-tight text-[var(--color-primary-ink)]"
                >
                  {member.fullName}
                </h2>
                {member.professionalTagline && (
                  <p className="mt-2 text-sm font-medium text-[var(--color-muted)]">
                    {member.professionalTagline}
                  </p>
                )}

                {member.academicDistinction && (
                  <div className="mt-5 bg-[var(--color-canvas)]/70 border border-[var(--color-hairline)] rounded-lg px-4 py-3.5">
                    <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
                      Academic Distinction
                    </p>
                    <p className="mt-1 font-display text-base font-semibold tracking-tight text-[var(--color-primary-ink)]">
                      {member.academicDistinction.formattedLine}
                    </p>
                  </div>
                )}
              </header>

              {/* Editorial View Switcher (Only shown when leader has a canonical Official Message) */}
              {hasMessage && member.officialMessage && (
                <div
                  role="tablist"
                  aria-label="Profile view options"
                  className="flex items-center gap-6 border-b border-[var(--color-hairline)]"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'dossier'}
                    onClick={() => handleSwitchTab('dossier')}
                    className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'dossier'
                        ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                        : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                    }`}
                  >
                    Leadership Profile
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'message'}
                    onClick={() => handleSwitchTab('message')}
                    className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'message'
                        ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                        : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                    }`}
                  >
                    {member.officialMessage.sectionHeading}
                  </button>
                </div>
              )}

              {activeTab === 'message' && member.officialMessage ? (
                /* Canonical Verbatim Official Message View */
                <article className="space-y-6 max-w-[65ch]">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
                      {member.officialMessage.sectionKicker}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-[var(--color-primary-ink)]">
                      {member.officialMessage.sectionHeading}
                    </h3>
                  </div>

                  <p className="font-display text-lg font-medium text-[var(--color-primary-ink)]">
                    {member.officialMessage.salutation}
                  </p>

                  <div className="space-y-4 text-[15px] sm:text-base text-[var(--color-ink)] leading-[1.8]">
                    {member.officialMessage.openingParagraphs.map((paragraph, idx) => (
                      <p key={`msg-open-${idx}`}>{paragraph}</p>
                    ))}
                  </div>

                  {member.officialMessage.subsections?.map((sub) => (
                    <div
                      key={sub.subheading}
                      className="pt-6 border-t border-[var(--color-hairline)] space-y-3.5"
                    >
                      <h4 className="font-display text-xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
                        {sub.subheading}
                      </h4>
                      <div className="space-y-4 text-[15px] sm:text-base text-[var(--color-ink)] leading-[1.8]">
                        {sub.paragraphs.map((paragraph, pIdx) => (
                          <p key={`${sub.subheading}-${pIdx}`}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-[var(--color-hairline)]">
                    <p className="text-sm text-[var(--color-muted)]">
                      {member.officialMessage.closingPhrase}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-[var(--color-primary-ink)]">
                      {member.fullName}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                      {member.designation}
                    </p>
                  </div>
                </article>
              ) : (
                /* Structured Biographical Dossier View */
                <div className="space-y-8">
                  {/* Section 1: Leadership Profile */}
                  {member.leadershipProfile.length > 0 && (
                    <section aria-labelledby="modal-section-leadership-profile">
                      <h3
                        id="modal-section-leadership-profile"
                        className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)] mb-3"
                      >
                        Leadership Profile
                      </h3>
                      <div className="space-y-3.5 text-[15px] sm:text-base text-[var(--color-ink)] leading-relaxed max-w-[65ch]">
                        {member.leadershipProfile.map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 2: Professional Leadership */}
                  {member.professionalLeadership && member.professionalLeadership.length > 0 && (
                    <section
                      aria-labelledby="modal-section-professional-leadership"
                      className="pt-6 border-t border-[var(--color-hairline)]"
                    >
                      <h3
                        id="modal-section-professional-leadership"
                        className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)] mb-4"
                      >
                        Professional Leadership
                      </h3>
                      <ul className="divide-y divide-[var(--color-hairline)] border-t border-b border-[var(--color-hairline)]">
                        {member.professionalLeadership.map((item) => (
                          <li
                            key={item}
                            className="py-3 text-sm sm:text-[15px] text-[var(--color-ink)] leading-relaxed flex items-start gap-3"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Section 3: Core Strengths */}
                  {member.coreStrengths && member.coreStrengths.length > 0 && (
                    <section
                      aria-labelledby="modal-section-core-strengths"
                      className="pt-6 border-t border-[var(--color-hairline)]"
                    >
                      <h3
                        id="modal-section-core-strengths"
                        className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)] mb-4"
                      >
                        Core Strengths
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {member.coreStrengths.map((strength) => (
                          <li
                            key={strength}
                            className="text-sm text-[var(--color-ink)] leading-relaxed flex items-start gap-2.5"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary-ink)] shrink-0"
                            />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Section 4: Qualifications & Academic Recognition */}
                  {member.qualificationsAndRecognition &&
                    member.qualificationsAndRecognition.length > 0 && (
                      <section
                        aria-labelledby="modal-section-qualifications"
                        className="pt-6 border-t border-[var(--color-hairline)]"
                      >
                        <h3
                          id="modal-section-qualifications"
                          className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)] mb-4"
                        >
                          Qualifications &amp; Academic Recognition
                        </h3>
                        <ul className="space-y-2.5">
                          {member.qualificationsAndRecognition.map((credential) => (
                            <li
                              key={credential}
                              className="text-sm sm:text-[15px] text-[var(--color-ink)] leading-relaxed flex items-start gap-3"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0"
                              />
                              <span>{credential}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                  {/* Optional Achievements Section */}
                  {member.achievements && member.achievements.length > 0 && (
                    <section
                      aria-labelledby="modal-section-achievements"
                      className="pt-6 border-t border-[var(--color-hairline)]"
                    >
                      <h3
                        id="modal-section-achievements"
                        className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)] mb-4"
                      >
                        Institutional Milestones &amp; Achievements
                      </h3>
                      <ul className="space-y-2.5">
                        {member.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="text-sm sm:text-[15px] text-[var(--color-ink)] leading-relaxed flex items-start gap-3"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0"
                            />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Direct Cross-Link to Canonical Official Message if Available */}
                  {member.officialMessage && (
                    <div className="pt-6 border-t border-[var(--color-hairline)]">
                      <button
                        type="button"
                        onClick={() => handleSwitchTab('message')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors cursor-pointer"
                      >
                        <span>Read {member.officialMessage.sectionHeading}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
