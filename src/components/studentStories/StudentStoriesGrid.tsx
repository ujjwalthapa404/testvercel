import React, { useMemo, useState } from 'react';
import { Award, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import {
  STUDENT_FILTER_OPTIONS,
  STUDENT_STORIES,
  STUDENT_STORIES_SECTION_HEADER,
  StudentStory,
  StudentStreamCategory,
} from '../../data/studentStories';
import { StudentStoryCard } from './StudentStoryCard';

interface StudentStoriesGridProps {
  onOpenEnquiry?: () => void;
}

export const StudentStoriesGrid: React.FC<StudentStoriesGridProps> = ({ onOpenEnquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState<StudentStreamCategory>('all');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const filteredStories = useMemo(() => {
    if (selectedCategory === 'all') {
      return STUDENT_STORIES;
    }
    return STUDENT_STORIES.filter((item) => item.streamCategory === selectedCategory);
  }, [selectedCategory]);

  const activeSpotlight = filteredStories[spotlightIndex] || filteredStories[0] || STUDENT_STORIES[0];

  const handlePrevSpotlight = () => {
    setSpotlightIndex((prev) => (prev === 0 ? filteredStories.length - 1 : prev - 1));
  };

  const handleNextSpotlight = () => {
    setSpotlightIndex((prev) => (prev === filteredStories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="student-stories"
      aria-labelledby="student-stories-heading"
      className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section Header & Category Filter Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {STUDENT_STORIES_SECTION_HEADER.eyebrow}
            </p>
            <h2
              id="student-stories-heading"
              className="mt-2.5 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
            >
              {STUDENT_STORIES_SECTION_HEADER.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              {STUDENT_STORIES_SECTION_HEADER.description}
            </p>
          </div>

          {/* Stream Category Filters */}
          <div
            role="group"
            aria-label="Filter student stories by category"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[var(--color-hairline)] rounded-lg self-start lg:self-auto"
          >
            {STUDENT_FILTER_OPTIONS.map((filter) => {
              const isActive = selectedCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(filter.id);
                    setSpotlightIndex(0);
                  }}
                  aria-pressed={isActive}
                  className={`min-h-9 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-brand)] text-white shadow-2xs'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                  }`}
                >
                  <span>{filter.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Reflection Spotlight Banner */}
        <div className="mt-9 rounded-xl bg-white border border-[var(--color-hairline)] p-6 sm:p-9 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--color-hairline)]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                Featured Student Reflection Spotlight
              </p>
            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <span className="font-mono text-xs text-[var(--color-muted)] mr-2 tabular-nums">
                {String(spotlightIndex + 1).padStart(2, '0')} /{' '}
                {String(filteredStories.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={handlePrevSpotlight}
                aria-label="Previous student story"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNextSpotlight}
                aria-label="Next student story"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Student Info & Monogram */}
            <div className="lg:col-span-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-2xs">
                {activeSpotlight.initials}
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-primary-ink)]">
                  {activeSpotlight.studentName}
                </h3>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-bold">
                  <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{activeSpotlight.achievement}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted)] font-medium">
                  {activeSpotlight.streamBadge}
                </p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="lg:col-span-8 lg:border-l lg:border-[var(--color-hairline)] lg:pl-8">
              <blockquote className="relative">
                <Quote
                  className="w-8 h-8 text-[var(--color-brand)]/15 absolute -top-4 -left-2"
                  aria-hidden="true"
                />
                <p className="font-serif text-lg sm:text-xl lg:text-[1.35rem] leading-relaxed text-[var(--color-ink)] italic pl-6 sm:pl-7">
                  &ldquo;{activeSpotlight.testimonial}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Section Cards: All 7 Cards Rendered in a Responsive Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-primary-ink)]">
              {selectedCategory === 'all'
                ? 'All Featured Student Voices (7)'
                : `${filteredStories.length} Matching Profiles`}
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Official student statements recorded verbatim
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredStories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => setSpotlightIndex(idx)}
                className="cursor-pointer"
              >
                <StudentStoryCard
                  story={story}
                  featured={story.id === activeSpotlight.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Integrity Notice & Enquiry Link */}
        <div className="mt-12 rounded-xl bg-white border border-[var(--color-hairline)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-11 h-11 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                Academic Excellence &amp; Guidance
              </p>
              <h4 className="mt-1.5 text-lg font-bold text-[var(--color-primary-ink)]">
                Inspiring the Next Generation of Thinkers and Leaders
              </h4>
              <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
                Capitol Hill College maintains an open, supportive learning environment where academic
                discipline is reinforced with practical laboratory inquiry, personalized faculty guidance,
                and comprehensive career counseling.
              </p>
            </div>
          </div>

          {onOpenEnquiry && (
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start lg:self-center cursor-pointer"
            >
              <span>Admission Enquiry</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
