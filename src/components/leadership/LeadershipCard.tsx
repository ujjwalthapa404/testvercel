import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LeadershipMemberProfile } from '../../data/leadershipData';

interface LeadershipCardProps {
  member: LeadershipMemberProfile;
  variant?: 'featured' | 'standard';
  onSelectProfile: (
    member: LeadershipMemberProfile,
    triggerElement: HTMLElement | null
  ) => void;
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

export const LeadershipCard: React.FC<LeadershipCardProps> = ({
  member,
  variant = 'standard',
  onSelectProfile,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showPortrait = Boolean(member.portraitSrc) && !imageFailed;
  const initials = getInitials(member.fullName);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    onSelectProfile(member, e.currentTarget);
  };

  if (variant === 'featured') {
    return (
      <article className="group bg-white border border-[var(--color-hairline)] hover:border-neutral-400 rounded-xl overflow-hidden transition-colors duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Portrait Column — Clickable */}
          <div className="lg:col-span-5 bg-[var(--color-canvas)] border-b lg:border-b-0 lg:border-r border-[var(--color-hairline)]">
            <button
              type="button"
              onClick={handleOpen}
              aria-label={`View full leadership profile of ${member.fullName}`}
              className="block w-full h-full text-left overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:-outline-offset-2"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200 relative">
                {showPortrait ? (
                  <img
                    src={member.portraitSrc}
                    alt={member.portraitAlt}
                    loading="eager"
                    onError={() => setImageFailed(true)}
                    style={
                      member.portraitObjectPosition
                        ? { objectPosition: member.portraitObjectPosition }
                        : undefined
                    }
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-primary-ink)] text-white p-8">
                    <span className="font-display text-4xl font-semibold tracking-wider text-white/90">
                      {initials}
                    </span>
                    <span className="mt-3 text-xs uppercase tracking-[0.16em] text-white/60">
                      Capitol Hill College
                    </span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Executive Dossier Preview Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                Office of the Chairman · Board of Directors
              </p>

              <h3 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2rem] font-semibold tracking-tight text-[var(--color-primary-ink)]">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="text-left hover:text-[var(--color-brand)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
                >
                  {member.fullName}
                </button>
              </h3>

              <p className="mt-1.5 text-base font-medium text-[var(--color-ink)]">
                {member.designation}
              </p>

              {member.professionalTagline && (
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {member.professionalTagline}
                </p>
              )}

              <div className="my-6 border-t border-[var(--color-hairline)]" />

              <p className="text-[15px] sm:text-base text-[var(--color-ink)] leading-relaxed max-w-[60ch]">
                {member.cardOverview ?? member.leadershipProfile[0]}
              </p>

              {member.professionalLeadership && member.professionalLeadership.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[var(--color-hairline)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] mb-3">
                    Selected Institutional Appointments
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--color-ink)]">
                    {member.professionalLeadership.slice(0, 3).map((role) => (
                      <li key={role} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0"
                        />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-5 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[var(--color-muted)]">
                Complete Leadership Dossier &amp; Credentials
              </span>

              <button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Profile</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white border border-[var(--color-hairline)] hover:border-neutral-400 rounded-xl overflow-hidden flex flex-col transition-colors duration-200">
      {/* Clickable Portrait */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`View profile of ${member.fullName}`}
        className="block w-full text-left overflow-hidden bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:-outline-offset-2"
      >
        <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200">
          {showPortrait ? (
            <img
              src={member.portraitSrc}
              alt={member.portraitAlt}
              loading="lazy"
              onError={() => setImageFailed(true)}
              style={
                member.portraitObjectPosition
                  ? { objectPosition: member.portraitObjectPosition }
                  : undefined
              }
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-primary-ink)] text-white p-6">
              <span className="font-display text-3xl font-semibold tracking-wider text-white/90">
                {initials}
              </span>
              <span className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/60">
                Capitol Hill College
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
            <button
              type="button"
              onClick={handleOpen}
              className="text-left hover:text-[var(--color-brand)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
            >
              {member.fullName}
            </button>
          </h3>

          <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
            {member.designation}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 min-h-10 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
