import React, { useState } from 'react';
import { Award, Quote, Sparkles } from 'lucide-react';
import { StudentStory } from '../../data/studentStories';

interface StudentStoryCardProps {
  story: StudentStory;
  featured?: boolean;
}

export const StudentStoryCard: React.FC<StudentStoryCardProps> = ({ story, featured = false }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidPhoto = Boolean(story.photoUrl && story.photoUrl.trim().length > 0 && !imgFailed);

  return (
    <article
      className={`group relative rounded-xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
        featured
          ? 'border-[var(--color-brand)] shadow-sm ring-1 ring-[var(--color-brand)]/20'
          : 'border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:shadow-sm'
      }`}
    >
      {/* Top Header: Student Profile, Initials Avatar & Prominent Achievement Label */}
      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
          {/* Avatar & Student Name */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Initials-based avatar / monogram */}
            <div
              className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center font-serif text-base font-bold tracking-wider select-none border transition-colors ${
                hasValidPhoto
                  ? 'overflow-hidden border-[var(--color-hairline)] bg-[var(--color-canvas)]'
                  : 'bg-[var(--color-brand-soft)] border-[var(--color-brand)]/25 text-[var(--color-brand)] group-hover:border-[var(--color-brand)] group-hover:bg-[var(--color-brand)] group-hover:text-white'
              }`}
            >
              {hasValidPhoto ? (
                <img
                  src={story.photoUrl}
                  alt={story.photoAlt || story.studentName}
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span>{story.initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--color-primary-ink)] truncate">
                {story.studentName}
              </h3>
              <p className="text-xs text-[var(--color-muted)] font-medium">
                {story.streamBadge}
              </p>
            </div>
          </div>

          {/* Prominent Achievement Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] shrink-0 self-start">
            <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="font-sans text-xs font-bold tracking-wide">
              {story.achievement}
            </span>
          </div>
        </div>

        {/* Subtle decorative divider */}
        <div className="mt-5 pt-5 border-t border-[var(--color-hairline)] relative">
          <Quote
            className="w-6 h-6 text-[var(--color-brand)]/20 absolute -top-3 left-0 bg-white pr-1"
            aria-hidden="true"
          />

          {/* Original Testimonial Quotation */}
          <blockquote className="mt-2">
            <p className="text-[14.5px] sm:text-[15px] text-[var(--color-ink)] leading-relaxed italic font-normal">
              &ldquo;{story.testimonial}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Card Footer: Institutional Verification Note */}
      <div className="mt-6 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between gap-2 text-[11px] text-[var(--color-muted)]">
        <span className="font-sans font-medium text-[var(--color-ink)]">
          CAPITOL HILL COLLEGE
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[var(--color-brand)] font-medium">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          <span>Student Voice</span>
        </span>
      </div>
    </article>
  );
};
