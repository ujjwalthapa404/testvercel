import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';
import {
  ALUMNI_PROGRAM_FILTERS,
  ALUMNI_SECTION_HEADER,
  GRADUATE_STREAM_PATHWAYS,
} from '../../data/alumniData';
import { AlumniProfile, AlumniProgramFilterId } from '../../types/alumni';
import { AlumniAvatar } from './AlumniAvatar';

interface AlumniSuccessStoriesProps {
  profiles: AlumniProfile[];
}

export const AlumniSuccessStories: React.FC<AlumniSuccessStoriesProps> = ({ profiles }) => {
  const [selectedProgram, setSelectedProgram] = useState<AlumniProgramFilterId>('all');

  const programCounts = useMemo(() => {
    const counts: Record<AlumniProgramFilterId, number> = {
      all: profiles.length,
      'plus-two-science': 0,
      'plus-two-management': 0,
      bbs: 0,
    };
    for (const item of profiles) {
      counts[item.programId] += 1;
    }
    return counts;
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    if (selectedProgram === 'all') {
      return profiles;
    }
    return profiles.filter((profile) => profile.programId === selectedProgram);
  }, [profiles, selectedProgram]);

  const scrollToConnect = () => {
    const el = document.getElementById('alumni-connect');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="alumni-stories"
      aria-labelledby="alumni-stories-heading"
      className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section Heading & Optional Program Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {ALUMNI_SECTION_HEADER.eyebrow}
            </p>
            <h2
              id="alumni-stories-heading"
              className="mt-2.5 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              {ALUMNI_SECTION_HEADER.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              {ALUMNI_SECTION_HEADER.description}
            </p>
          </div>

          {profiles.length > 0 && (
            <div
              role="group"
              aria-label="Filter alumni profiles by academic program"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[var(--color-hairline)] rounded-lg self-start lg:self-auto"
            >
              {ALUMNI_PROGRAM_FILTERS.map((filter) => {
                const isActive = selectedProgram === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setSelectedProgram(filter.id)}
                    aria-pressed={isActive}
                    className={`min-h-9 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-brand)] text-white shadow-2xs'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                    }`}
                  >
                    <span>{filter.shortLabel}</span>
                    <span
                      className={`ml-1.5 font-mono tabular-nums ${
                        isActive ? 'text-white/85' : 'text-[var(--color-muted)]'
                      }`}
                    >
                      ({programCounts[filter.id]})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {profiles.length === 0 ? (
          <>
            {/* Verified Stream Progression Pathways */}
            <div className="mt-9 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-7">
              {GRADUATE_STREAM_PATHWAYS.map((pathway) => (
                <article
                  key={pathway.id}
                  className="bg-white rounded-xl border border-[var(--color-hairline)] p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[var(--color-brand)]">
                        {pathway.streamBadge}
                      </span>
                      <span className="text-[var(--color-muted)]">{pathway.affiliation}</span>
                    </div>

                    <h3 className="mt-3.5 text-xl font-semibold text-[var(--color-primary-ink)] leading-snug">
                      {pathway.title}
                    </h3>

                    <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                      {pathway.summary}
                    </p>

                    <ul className="mt-5 pt-4 border-t border-[var(--color-hairline)] space-y-2.5 text-xs sm:text-[13px] text-[var(--color-ink)]">
                      {pathway.progressionAreas.map((area) => (
                        <li key={area} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-[var(--color-hairline)] flex items-center justify-between text-[11px] text-[var(--color-muted)]">
                    <span>Capitol Hill College · Teku</span>
                    <span className="font-medium text-[var(--color-primary-ink)]">
                      Academic Pathway
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Institutional Alumni Directory Verification Callout */}
            <div className="mt-8 rounded-xl bg-white border border-[var(--color-hairline)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4 max-w-3xl">
                <div className="w-11 h-11 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                    Official Alumni Directory Compilation
                  </p>
                  <h3 className="mt-1.5 text-lg sm:text-xl font-semibold text-[var(--color-primary-ink)]">
                    Verified Individual Alumni Profiles Published With Graduate Consent
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    In accordance with Capitol Hill College institutional standards, individual
                    graduate names, photographs, universities, and professional designations are
                    published only after formal verification and consent through the Administration
                    Office. Graduates are invited to submit their academic and career milestones
                    below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToConnect}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start lg:self-center cursor-pointer"
              >
                <span>Submit Alumni Update</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </>
        ) : filteredProfiles.length === 0 ? (
          <div className="mt-10 py-14 text-center rounded-xl border border-[var(--color-hairline)] bg-white px-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">
              No alumni profiles are currently listed under this program filter.
            </p>
            <button
              type="button"
              onClick={() => setSelectedProgram('all')}
              className="mt-3 text-xs font-semibold text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer"
            >
              Show all alumni profiles
            </button>
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProfiles.map((alumni) => (
              <article
                key={alumni.id}
                className="group bg-white rounded-xl border border-[var(--color-hairline)] hover:border-[var(--color-brand)] transition-colors overflow-hidden flex flex-col h-full"
              >
                <AlumniAvatar
                  fullName={alumni.fullName}
                  initials={alumni.initials}
                  photoUrl={alumni.photoUrl}
                  photoAlt={alumni.photoAlt}
                  isSamplePlaceholder={alumni.isSamplePlaceholder}
                  variant="card"
                />

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="font-semibold text-[var(--color-brand)]">
                      {alumni.programCompleted}
                    </span>
                    <span aria-hidden="true" className="text-neutral-400">
                      ·
                    </span>
                    <span className="text-[var(--color-muted)] tabular-nums">
                      {alumni.graduationYear}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-xl font-semibold text-[var(--color-primary-ink)] leading-snug">
                    {alumni.fullName}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-[var(--color-hairline)]">
                    <p className="text-sm font-semibold text-[var(--color-ink)] leading-snug">
                      {alumni.currentRole}
                    </p>
                    {alumni.currentOrganization && (
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {alumni.currentOrganization}
                      </p>
                    )}
                  </div>

                  <p className="mt-3.5 text-sm text-[var(--color-muted)] leading-relaxed flex-1">
                    {alumni.achievementSummary}
                  </p>

                  <div className="mt-5 pt-3.5 border-t border-[var(--color-hairline)] flex items-center justify-between gap-2 text-[11px] text-[var(--color-muted)]">
                    <span>Capitol Hill College · Teku</span>
                    <span className="font-mono text-[var(--color-brand)]">Verified Graduate</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
