import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { TESTIMONIALS_SECTION_HEADER } from '../../data/testimonialsData';
import { StudentTestimonial } from '../../types/alumni';
import { AlumniAvatar } from './AlumniAvatar';

interface TestimonialsSectionProps {
  testimonials: StudentTestimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToConnect = () => {
    const el = document.getElementById('alumni-connect');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (testimonials.length === 0) {
    return (
      <section
        id="student-testimonials"
        aria-labelledby="testimonials-section-heading"
        className="py-16 sm:py-20 bg-white border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl pb-7 border-b border-[var(--color-hairline)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {TESTIMONIALS_SECTION_HEADER.eyebrow}
            </p>
            <h2
              id="testimonials-section-heading"
              className="mt-2.5 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              {TESTIMONIALS_SECTION_HEADER.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              {TESTIMONIALS_SECTION_HEADER.description}
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] p-6 sm:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="w-11 h-11 rounded-lg bg-white border border-[var(--color-hairline)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                  Editorial Integrity Standard
                </p>
                <h3 className="mt-1.5 text-lg sm:text-xl font-semibold text-[var(--color-primary-ink)]">
                  Verified Student &amp; Graduate Reflections Only
                </h3>
                <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                  Capitol Hill College does not publish synthetic or unverified student quotes.
                  Current students and graduates of +2 Science, +2 Management, and BBS who wish to
                  share their campus experience may submit a reflection through the Administration
                  Desk for official review and publication.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToConnect}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start lg:self-center cursor-pointer"
            >
              <span>Share Your Reflection</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  const safeIndex = activeIndex >= testimonials.length ? 0 : activeIndex;
  const featured = testimonials[safeIndex];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      id="student-testimonials"
      aria-labelledby="testimonials-section-heading"
      className="py-16 sm:py-20 bg-white border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-7 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {TESTIMONIALS_SECTION_HEADER.eyebrow}
            </p>
            <h2
              id="testimonials-section-heading"
              className="mt-2.5 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              {TESTIMONIALS_SECTION_HEADER.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              {TESTIMONIALS_SECTION_HEADER.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              aria-live="polite"
              className="font-mono text-xs font-medium text-[var(--color-muted)] tabular-nums mr-1"
            >
              {String(safeIndex + 1).padStart(2, '0')} /{' '}
              {String(testimonials.length).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured student testimonial"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="mt-8 bg-[var(--color-canvas)] rounded-xl border border-[var(--color-hairline)] p-6 sm:p-10 focus:outline-2 focus:outline-[var(--color-brand)]"
        >
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
              <span className="font-semibold text-[var(--color-brand)]">
                {featured.academicProgram}
              </span>
              <span aria-hidden="true" className="text-neutral-400">
                ·
              </span>
              <span className="text-[var(--color-muted)]">{featured.academicStatus}</span>
            </div>

            <blockquote className="mt-5">
              <p className="font-display text-xl sm:text-2xl lg:text-[1.65rem] text-[var(--color-primary-ink)] leading-relaxed">
                &ldquo;{featured.quotation}&rdquo;
              </p>
            </blockquote>

            <div className="mt-7 pt-5 border-t border-[var(--color-hairline)] flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                <AlumniAvatar
                  fullName={featured.studentName}
                  initials={featured.initials}
                  photoUrl={featured.photoUrl}
                  photoAlt={featured.photoAlt}
                  isSamplePlaceholder={featured.isSamplePlaceholder}
                  variant="avatar"
                />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary-ink)]">
                    {featured.studentName}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {featured.academicProgram} · {featured.academicStatus}
                  </p>
                </div>
              </div>

              <div
                role="tablist"
                aria-label="Select testimonial"
                className="flex items-center gap-2"
              >
                {testimonials.map((item, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`View testimonial ${idx + 1}: ${item.studentName}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 rounded-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'w-7 bg-[var(--color-brand)]'
                          : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item, idx) => {
            const isCurrent = idx === safeIndex;
            return (
              <article
                key={item.id}
                className={`rounded-xl p-6 border transition-colors flex flex-col justify-between bg-white ${
                  isCurrent
                    ? 'border-[var(--color-brand)]'
                    : 'border-[var(--color-hairline)] hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[var(--color-brand)]">
                      {item.academicProgram}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-muted)] tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <blockquote className="mt-3.5">
                    <p className="text-sm text-[var(--color-ink)] leading-relaxed line-clamp-4">
                      &ldquo;{item.quotation}&rdquo;
                    </p>
                  </blockquote>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <AlumniAvatar
                      fullName={item.studentName}
                      initials={item.initials}
                      photoUrl={item.photoUrl}
                      photoAlt={item.photoAlt}
                      isSamplePlaceholder={item.isSamplePlaceholder}
                      variant="avatar"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--color-primary-ink)] truncate">
                        {item.studentName}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)] truncate">
                        {item.academicStatus}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className="text-xs font-semibold text-[var(--color-brand)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Read
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
