import React from 'react';
import { ArrowDownRight, ArrowRight, ChevronRight } from 'lucide-react';
import { AlumniHeroContent } from '../../types/alumni';
import { CollegeImage } from '../CollegeImage';

interface AlumniHeroProps {
  content: AlumniHeroContent;
  onNavigateHome: () => void;
  onExploreStories: () => void;
  onReconnect: () => void;
}

export const AlumniHero: React.FC<AlumniHeroProps> = ({
  content,
  onNavigateHome,
  onExploreStories,
  onReconnect,
}) => {
  return (
    <section
      aria-labelledby="alumni-hero-heading"
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
          {/* Left Editorial Column */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {content.eyebrow}
            </p>

            <h1
              id="alumni-hero-heading"
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
                onClick={onReconnect}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{content.secondaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 pt-5 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-muted)]">
              <span className="font-semibold text-[var(--color-primary-ink)]">
                Academic Streams Represented
              </span>
              <span aria-hidden="true">·</span>
              <span>+2 Science (NEB)</span>
              <span aria-hidden="true">·</span>
              <span>+2 Management (NEB)</span>
              <span aria-hidden="true">·</span>
              <span>Bachelor of Business Studies (TU)</span>
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
                fallbackTitle="Capitol Hill College Alumni & Graduating Cohort"
              />
              <figcaption className="px-4 sm:px-5 py-3.5 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] text-xs text-[var(--color-muted)] leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>{content.heroImage.caption}</span>
                {content.heroImage.isPlaceholderAsset && (
                  <span className="font-mono text-[11px] text-[var(--color-brand)] whitespace-nowrap shrink-0">
                    Sample Hero Asset
                  </span>
                )}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
