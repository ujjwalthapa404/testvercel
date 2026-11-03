import React from 'react';
import {
  EXECUTIVE_OFFICES_FRAMEWORK,
  LEADERSHIP_PAGE_COPY,
  LeadershipMemberProfile,
} from '../../data/leadershipData';
import { LeadershipCard } from './LeadershipCard';

interface ExecutiveLeadershipProps {
  members: LeadershipMemberProfile[];
  onSelectProfile: (
    member: LeadershipMemberProfile,
    triggerElement: HTMLElement | null,
    initialTab?: 'dossier' | 'message'
  ) => void;
}

export const ExecutiveLeadership: React.FC<ExecutiveLeadershipProps> = ({
  members,
  onSelectProfile,
}) => {
  const sortedMembers = [...members].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      id="executive-leadership"
      aria-labelledby="executive-leadership-heading"
      className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            {LEADERSHIP_PAGE_COPY.executiveSection.kicker}
          </p>
          <h2
            id="executive-leadership-heading"
            className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
          >
            {LEADERSHIP_PAGE_COPY.executiveSection.title}
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
            {LEADERSHIP_PAGE_COPY.executiveSection.description}
          </p>
        </div>

        {/* Populated Executive Profiles Grid */}
        {sortedMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedMembers.map((leader) => (
              <LeadershipCard
                key={leader.id}
                member={leader}
                variant="standard"
                onSelectProfile={onSelectProfile}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--color-hairline)] rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] bg-[var(--color-canvas)]/45">
            {EXECUTIVE_OFFICES_FRAMEWORK.map((office, index) => (
              <div key={office.officeTitle} className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-[var(--color-brand)]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--color-primary-ink)]">
                    {office.officeTitle}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                    {office.scopeSummary}
                  </p>
                </div>

                <p className="mt-6 pt-4 border-t border-[var(--color-hairline)] text-xs font-medium text-[var(--color-ink)]">
                  {office.statusNote}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
