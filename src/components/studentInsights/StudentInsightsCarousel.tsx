import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageSquareQuote,
  Pause,
  Play,
} from 'lucide-react';
import { STUDENT_STORIES, StudentStory } from '../../data/studentStories';
import { StudentInsightCard } from './StudentInsightCard';
import { StudentInsightModal } from './StudentInsightModal';

interface StudentInsightsCarouselProps {
  onNavigateToAllStories?: () => void;
  stories?: StudentStory[];
  autoSlideIntervalMs?: number;
}

export const StudentInsightsCarousel: React.FC<StudentInsightsCarouselProps> = ({
  onNavigateToAllStories,
  stories = STUDENT_STORIES,
  autoSlideIntervalMs = 5500,
}) => {
  const carouselId = useId();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<StudentStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number>(3);

  // Playback & interaction state
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Touch swipe coordinates
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 45;

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Track responsive screen size (1 card mobile, 2 cards tablet, 3 cards desktop)
  useEffect(() => {
    const updateVisibleCards = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const maxIndex = useMemo(() => {
    return Math.max(0, stories.length - visibleCards);
  }, [stories.length, visibleCards]);

  // Keep currentIndex within valid bounds if screen is resized
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Determine if automatic advancing is currently active
  const isAutoAdvancing =
    !isUserPaused &&
    !prefersReducedMotion &&
    !isHovered &&
    !isFocused &&
    !isTouchInteracting &&
    !isModalOpen &&
    maxIndex > 0;

  // Automatic slide advancement timer (5.5s cycle)
  useEffect(() => {
    if (!isAutoAdvancing) return undefined;

    const intervalTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoSlideIntervalMs);

    return () => clearInterval(intervalTimer);
  }, [currentIndex, isAutoAdvancing, maxIndex, autoSlideIntervalMs]);

  // Navigation handlers with seamless wrapping
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleOpenModal = (story: StudentStory) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  // Touch event handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouchInteracting(true);
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsTouchInteracting(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Percentage step per slide
  const stepPercentage = 100 / visibleCards;
  const translateX = -(currentIndex * stepPercentage);

  return (
    <section
      id="student-insights"
      aria-labelledby={`${carouselId}-heading`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="py-18 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2.5 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 shrink-0 text-[var(--color-brand)]" aria-hidden="true" />
              <span>Student Perspectives</span>
            </p>
            <h2
              id={`${carouselId}-heading`}
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)] leading-tight"
            >
              Insights into College Life
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed max-w-[62ch]">
              Discover the experiences, achievements and perspectives of students who have been part
              of the Capitol Hill College community.
            </p>
          </div>

          {/* Carousel Controls Cluster: Direct Link, Pause/Resume, Counter, Arrows */}
          <div className="flex flex-wrap items-center gap-3.5 self-start lg:self-auto shrink-0">
            {onNavigateToAllStories && (
              <button
                type="button"
                onClick={onNavigateToAllStories}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap cursor-pointer mr-1 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
              >
                <span>View All 7 Voices</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            )}

            {/* Accessible Play / Pause Toggle Button */}
            {!prefersReducedMotion && (
              <button
                type="button"
                onClick={() => setIsUserPaused((prev) => !prev)}
                aria-label={
                  isUserPaused
                    ? 'Resume automatic carousel playback'
                    : 'Pause automatic carousel playback'
                }
                title={isUserPaused ? 'Resume auto-play' : 'Pause auto-play'}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors cursor-pointer shadow-2xs focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
              >
                {isUserPaused ? (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" aria-hidden="true" />
                ) : (
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                )}
              </button>
            )}

            {/* Position Counter Indicator */}
            <span
              aria-live="polite"
              className="font-mono text-xs text-[var(--color-muted)] tabular-nums px-1"
            >
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(maxIndex + 1).padStart(2, '0')}
            </span>

            {/* Arrow Navigation Controls with Cyclic Wrapping */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous student insights"
                aria-controls={`${carouselId}-track`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors cursor-pointer shadow-2xs focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next student insights"
                aria-controls={`${carouselId}-track`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors cursor-pointer shadow-2xs focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Student Insights Carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="mt-8 overflow-hidden focus:outline-2 focus:outline-[var(--color-brand)] rounded-xl py-1 select-none"
        >
          {/* Smooth Sliding Track */}
          <div
            id={`${carouselId}-track`}
            className="flex -mx-3 transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {stories.map((story) => (
              <div
                key={story.id}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3 flex flex-col"
              >
                <StudentInsightCard story={story} onReadMore={handleOpenModal} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots Controls & Assistive Caption */}
        <div className="mt-8 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between flex-wrap gap-4">
          <div
            role="tablist"
            aria-label="Student insights carousel slides"
            className="flex items-center gap-2"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] ${
                    isActive
                      ? 'w-8 bg-[var(--color-brand)]'
                      : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAutoAdvancing ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
              }`}
              aria-hidden="true"
            />
            <span>
              {isAutoAdvancing
                ? 'Advancing every 5.5s · Hover or focus to pause'
                : isModalOpen
                ? 'Paused while viewing testimonial'
                : isHovered || isFocused
                ? 'Paused on inspection'
                : isUserPaused
                ? 'Playback paused'
                : 'Swipe or use arrows to navigate'}
            </span>
          </div>
        </div>
      </div>

      {/* Accessible Full Testimonial Modal Dialog */}
      <StudentInsightModal
        story={selectedStory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};
