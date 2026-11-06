import React, { useState } from 'react';
import { Award, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { StudentStory } from '../../data/studentStories';

interface StudentInsightCardProps {
  story: StudentStory;
  onReadMore: (story: StudentStory) => void;
}

export const StudentInsightCard: React.FC<StudentInsightCardProps> = ({ story, onReadMore }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidPhoto = Boolean(story.photoUrl && story.photoUrl.trim().length > 0 && !imgFailed);

  return (
    <article className="group h-full flex flex-col justify-between rounded-xl bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200">
      <div>
        {/* Top Header: Student Profile & Achievement Label */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Initials-based avatar / monogram or student photo */}
            <div
              className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center font-serif text-base font-bold tracking-wider select-none border transition-colors ${
                hasValidPhoto
                  ? 'overflow-hidden border-[var(--color-hairline)] bg-[var(--color-canvas)]'
                  : 'bg-[var(--color-brand-soft)] border-[var(--color-brand)]/25 text-[var(--color-brand)] group-hover:bg-[var(--color-brand)] group-hover:text-white'
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
              <h3 className="font-display text-lg font-bold tracking-tight text-[var(--color-primary-ink)] truncate">
                {story.studentName}
              </h3>
              <p className="text-xs text-[var(--color-muted)] font-medium">
                {story.streamBadge}
              </p>
            </div>
          </div>

          {/* Prominent Achievement Label */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/25 text-[var(--color-brand)] shrink-0">
            <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="font-sans text-xs font-bold tracking-wide">
              {story.achievement}
            </span>
          </div>
        </div>

        {/* Quotation with Stylized Quote Mark */}
        <div className="mt-5 pt-5 border-t border-[var(--color-hairline)] relative">
          <Quote
            className="w-5 h-5 text-[var(--color-brand)]/20 absolute -top-2.5 left-0 bg-white pr-1"
            aria-hidden="true"
          />

          <blockquote className="mt-2">
            <p className="text-[14.5px] text-[var(--color-ink)] leading-relaxed italic font-normal line-clamp-4">
              &ldquo;{story.testimonial}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Card Actions & Institutional Footnote */}
      <div className="mt-6 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onReadMore(story)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors cursor-pointer group-hover:underline underline-offset-4"
        >
          <span>Read Full Insight</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>

        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-muted)]">
          <Sparkles className="w-3 h-3 text-[var(--color-brand)]" aria-hidden="true" />
          <span>Verified Reflection</span>
        </span>
      </div>
    </article>
  );
};
