import React from 'react';
import {
  BookOpen,
  Briefcase,
  Compass,
  FlaskConical,
  Trophy,
  Users,
} from 'lucide-react';
import { ALUMNI_VALUES_HEADER } from '../../data/alumniData';
import { CollegeValuePillar, ValuePillarIconKey } from '../../types/alumni';

interface AlumniValuesSectionProps {
  pillars: CollegeValuePillar[];
  onExploreFacilities: () => void;
}

const ValuePillarIcon: React.FC<{ iconKey: ValuePillarIconKey; className?: string }> = ({
  iconKey,
  className = 'w-5 h-5',
}) => {
  switch (iconKey) {
    case 'compass':
      return <Compass className={className} aria-hidden="true" />;
    case 'users':
      return <Users className={className} aria-hidden="true" />;
    case 'flask':
      return <FlaskConical className={className} aria-hidden="true" />;
    case 'book-open':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'trophy':
      return <Trophy className={className} aria-hidden="true" />;
    case 'briefcase':
      return <Briefcase className={className} aria-hidden="true" />;
  }
};

export const AlumniValuesSection: React.FC<AlumniValuesSectionProps> = ({
  pillars,
  onExploreFacilities,
}) => {
  return (
    <section
      id="why-students-value"
      aria-labelledby="alumni-values-heading"
      className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-7 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {ALUMNI_VALUES_HEADER.eyebrow}
            </p>
            <h2
              id="alumni-values-heading"
              className="mt-2.5 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              {ALUMNI_VALUES_HEADER.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              {ALUMNI_VALUES_HEADER.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onExploreFacilities}
            className="text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            View Campus Facilities &rarr;
          </button>
        </div>

        <div className="mt-9 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {pillars.map((pillar) => (
            <article
              key={pillar.id}
              className="rounded-xl border border-[var(--color-hairline)] bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-[var(--color-brand)] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
                    <ValuePillarIcon iconKey={pillar.iconKey} className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[var(--color-brand)] tabular-nums">
                    {pillar.number}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[var(--color-primary-ink)] leading-snug">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-hairline)]">
                <p className="text-xs font-medium text-[var(--color-ink)]">
                  {pillar.campusEvidence}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
