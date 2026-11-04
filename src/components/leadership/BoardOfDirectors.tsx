import React from 'react';
import {
  LEADERSHIP_PAGE_COPY,
  LeadershipMemberProfile,
} from '../../data/leadershipData';
import { LeadershipCard } from './LeadershipCard';

interface BoardOfDirectorsProps {
  members: LeadershipMemberProfile[];
  onSelectProfile: (
    member: LeadershipMemberProfile,
    triggerElement: HTMLElement | null,
    initialTab?: 'dossier' | 'message'
  ) => void;
}

export const BoardOfDirectors: React.FC<BoardOfDirectorsProps> = ({
  members,
  onSelectProfile,
}) => {
  const sortedMembers = [...members].sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredChair = sortedMembers.find((m) => m.isFeaturedChair);
  const remainingDirectors = featuredChair
    ? sortedMembers.filter((m) => m.id !== featuredChair.id)
    : sortedMembers;
  const ceoDirector = remainingDirectors.find((m) => m.id === 'nischal-gautam');
  const otherBoardDirectors = ceoDirector
    ? remainingDirectors.filter((m) => m.id !== ceoDirector.id)
    : remainingDirectors;

  return (
    <section
      id="board-of-directors"
      aria-labelledby="board-of-directors-heading"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            {LEADERSHIP_PAGE_COPY.boardSection.kicker}
          </p>
          <h2
            id="board-of-directors-heading"
            className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
          >
            {LEADERSHIP_PAGE_COPY.boardSection.title}
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted)] leading-relaxed max-w-[65ch]">
            {LEADERSHIP_PAGE_COPY.boardSection.description}
          </p>
        </div>

        {/* Featured Chairman Presentation */}
        {featuredChair && (
          <div className="mb-8 sm:mb-10">
            <LeadershipCard
              member={featuredChair}
              variant="featured"
              onSelectProfile={onSelectProfile}
            />
          </div>
        )}

        {/* CEO & Director Presentation with Dedicated Institutional Introduction */}
        {ceoDirector && (
          <div className={otherBoardDirectors.length > 0 ? 'mb-8 sm:mb-10' : ''}>
            <LeadershipCard
              member={ceoDirector}
              variant="executive"
              onSelectProfile={onSelectProfile}
            />
          </div>
        )}

        {/* Additional Board Directors Grid (Automatically scales as directors are added) */}
        {otherBoardDirectors.length > 0 && (
          <div
            className={
              otherBoardDirectors.length === 1
                ? 'space-y-8'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
            }
          >
            {otherBoardDirectors.map((director) => (
              <LeadershipCard
                key={director.id}
                member={director}
                variant={otherBoardDirectors.length === 1 ? 'executive' : 'standard'}
                onSelectProfile={onSelectProfile}
              />
            ))}
          </div>
        )}

        {/* Understated Institutional Record Note */}
        <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
          <p>{LEADERSHIP_PAGE_COPY.boardSection.publicationNote}</p>
          <span className="font-medium text-[var(--color-primary-ink)] shrink-0">
            CAPITOL HILL COLLEGE · Kathmandu, Nepal
          </span>
        </div>
      </div>
    </section>
  );
};
