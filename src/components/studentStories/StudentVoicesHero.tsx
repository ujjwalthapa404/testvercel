import React from 'react';
import { ArrowDownRight, ArrowRight, ChevronRight, GraduationCap, Sparkles, Trophy } from 'lucide-react';
import { STUDENT_VOICES_HERO_CONTENT } from '../../data/studentStories';
import { CollegeImage } from '../CollegeImage';

interface StudentVoicesHeroProps {
  onNavigateHome: () => void;
  onExploreStories: () => void;
  onOpenEnquiry: () => void;
}

export const StudentVoicesHero: React.FC<StudentVoicesHeroProps> = ({
  onNavigateHome,
  onExploreStories,
  onOpenEnquiry,
}) => {
  const content = STUDENT_VOICES_HERO_CONTENT;

  return (
    <section
      aria-labelledby="student-voices-hero-heading"
      className="bg-white border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-14 lg:py-18">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
            <li>
              <button
                type="button"
                onClick={onNavigateHome}
                className="hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                {content.breadcrumbParent}
              </button>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </li>
            <li
              aria-current="page"
              className="font-semibold text-[var(--color-primary-ink)]"
            >
              {content.breadcrumbCurrent}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading & Concise Professional Institutional Intro */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {content.eyebrow}
            </p>

            <h1
              id="student-voices-hero-heading"
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-[var(--color-primary-ink)]"
            >
              {content.heading}
            </h1>

            <p className="mt-4 font-sans text-lg sm:text-xl font-semibold text-[var(--color-brand)] leading-snug">
              {content.supportingHeading}
            </p>

            <p className="mt-4 text-[15px] sm:text-base text-[var(--color-muted)] leading-relaxed max-w-[56ch]">
              {content.introduction}
            </p>

            {/* Action Buttons */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreStories}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{content.primaryCtaLabel}</span>
                <ArrowDownRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenEnquiry}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{content.secondaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* Institutional Recognition Pillars */}
            <div className="mt-8 pt-5 border-t border-[var(--color-hairline)] grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="flex items-center gap-2 text-[var(--color-ink)]">
                <Trophy className="w-4 h-4 text-[var(--color-brand)] shrink-0" aria-hidden="true" />
                <span className="font-medium">Board &amp; MECEE Honors</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-ink)]">
                <GraduationCap className="w-4 h-4 text-[var(--color-brand)] shrink-0" aria-hidden="true" />
                <span className="font-medium">Science &amp; Mgmt Toppers</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-ink)]">
                <Sparkles className="w-4 h-4 text-[var(--color-brand)] shrink-0" aria-hidden="true" />
                <span className="font-medium">7 Authentic Testimonials</span>
              </div>
            </div>
          </div>

          {/* Right Framed Cohort Photograph */}
          <div className="lg:col-span-6">
            <figure className="rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
              <CollegeImage
                src={content.heroImage.src}
                alt={content.heroImage.alt}
                aspectClassName="aspect-[16/10]"
                priority
                fallbackTitle="Capitol Hill College Students & Academic Gatherings"
              />
              <figcaption className="px-4 sm:px-5 py-3.5 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] text-xs text-[var(--color-muted)] leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>{content.heroImage.caption}</span>
                <span className="font-mono text-[11px] text-[var(--color-brand)] font-semibold whitespace-nowrap shrink-0">
                  Teku Campus
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
