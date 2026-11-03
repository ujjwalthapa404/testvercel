import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { NoticeItem } from '../../types/notice';

interface AnnouncementBarProps {
  notices?: NoticeItem[];
  notice?: NoticeItem;
  onNavigateToNotices: (noticeSlug?: string) => void;
}

const DISMISS_STORAGE_KEY = 'chc_dismissed_announcement_signature';

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  notices,
  notice,
  onNavigateToNotices,
}) => {
  const activeItems = useMemo(() => {
    if (notices && notices.length > 0) {
      return notices;
    }
    if (notice) {
      return [notice];
    }
    return [];
  }, [notices, notice]);

  const signature = useMemo(
    () => activeItems.map((item) => item.id).join('|'),
    [activeItems]
  );

  const [dismissedSignature, setDismissedSignature] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isManualStepped, setIsManualStepped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (saved) {
        setDismissedSignature(saved);
      }
    } catch {
      // Ignore storage access errors in restricted browsing contexts
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (currentIndex >= activeItems.length) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  /* Build a repeatable half-track wide enough to seamlessly fill ultrawide displays without blank gaps */
  const marqueeHalfTrackItems = useMemo(() => {
    if (activeItems.length === 0) return [];
    const repeats = activeItems.length === 1 ? 4 : activeItems.length === 2 ? 2 : 1;
    const expanded: Array<{ item: NoticeItem; instanceKey: string }> = [];
    for (let r = 0; r < repeats; r += 1) {
      for (const item of activeItems) {
        expanded.push({ item, instanceKey: `${item.id}-r${r}` });
      }
    }
    return expanded;
  }, [activeItems]);

  if (activeItems.length === 0 || (signature && dismissedSignature === signature)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedSignature(signature);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, signature);
    } catch {
      // Ignore storage access errors
    }
  };

  const handlePrevious = () => {
    setIsManualStepped(true);
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleNext = () => {
    setIsManualStepped(true);
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const handleTogglePlayPause = () => {
    if (isPaused || isManualStepped) {
      setIsManualStepped(false);
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const showSteppedView = prefersReducedMotion || isManualStepped;
  const activeSingleNotice = activeItems[currentIndex] ?? activeItems[0];
  /* Calm, institutional reading speed (~12 seconds per notice in the half-track) */
  const marqueeDurationSeconds = Math.max(28, marqueeHalfTrackItems.length * 12);

  return (
    <div
      role="region"
      aria-label="Official college announcements"
      className="w-full bg-[var(--color-canvas)] text-[var(--color-primary-ink)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
        {/* Static Institutional Label on Tablet/Desktop */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="font-semibold uppercase tracking-[0.14em] text-[11px] text-[var(--color-brand)]">
            Official Updates
          </span>
          <span aria-hidden="true" className="h-3.5 w-px bg-[var(--color-hairline)]" />
        </div>

        {/* Center Viewport: Continuous Seamless Loop OR Manual/Reduced-Motion Stepped Item */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {showSteppedView ? (
            <div
              aria-live="polite"
              className="flex items-center gap-2.5 min-w-0"
            >
              <span className="font-semibold tracking-wide uppercase text-[11px] whitespace-nowrap shrink-0 text-[var(--color-brand)]">
                {activeSingleNotice.priority === 'HIGH'
                  ? 'Urgent Notice'
                  : activeSingleNotice.category}
              </span>
              <span aria-hidden="true" className="shrink-0 text-neutral-400">
                ·
              </span>
              <button
                type="button"
                onClick={() => onNavigateToNotices(activeSingleNotice.slug)}
                className="font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:underline underline-offset-4 truncate text-left transition-colors cursor-pointer"
              >
                {activeSingleNotice.title}
              </button>
              {activeItems.length > 1 && (
                <span className="ml-1 font-mono text-[11px] text-[var(--color-muted)] tabular-nums shrink-0">
                  ({currentIndex + 1}/{activeItems.length})
                </span>
              )}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div
                style={{
                  animationDuration: `${marqueeDurationSeconds}s`,
                  animationPlayState: isPaused ? 'paused' : undefined,
                }}
                className="chc-marquee-track flex w-max items-center"
              >
                {/* Primary Accessible Track */}
                <div className="flex items-center shrink-0">
                  {marqueeHalfTrackItems.map(({ item, instanceKey }) => (
                    <div
                      key={`primary-${instanceKey}`}
                      className="flex items-center gap-2.5 pr-10 sm:pr-14 shrink-0"
                    >
                      <span className="font-semibold tracking-wide uppercase text-[11px] whitespace-nowrap text-[var(--color-brand)]">
                        {item.priority === 'HIGH' ? 'Urgent Notice' : item.category}
                      </span>
                      <span aria-hidden="true" className="text-neutral-400">
                        ·
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigateToNotices(item.slug)}
                        className="font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:underline underline-offset-4 whitespace-nowrap text-left transition-colors cursor-pointer"
                      >
                        {item.title}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Seamless Duplicate Track (aria-hidden & non-tabbable so keyboard focus never duplicates) */}
                <div aria-hidden="true" className="flex items-center shrink-0">
                  {marqueeHalfTrackItems.map(({ item, instanceKey }) => (
                    <div
                      key={`clone-${instanceKey}`}
                      className="flex items-center gap-2.5 pr-10 sm:pr-14 shrink-0"
                    >
                      <span className="font-semibold tracking-wide uppercase text-[11px] whitespace-nowrap text-[var(--color-brand)]">
                        {item.priority === 'HIGH' ? 'Urgent Notice' : item.category}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => onNavigateToNotices(item.slug)}
                        className="font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:underline underline-offset-4 whitespace-nowrap text-left transition-colors cursor-pointer"
                      >
                        {item.title}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: Previous / Pause-Resume / Next + View Notices + Dismiss */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {activeItems.length > 1 && (
            <div
              role="group"
              aria-label="Announcement slider controls"
              className="flex items-center gap-0.5 border border-[var(--color-hairline)] rounded-md bg-white/80 p-0.5"
            >
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous announcement"
                title="Previous announcement"
                className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {!prefersReducedMotion && (
                <button
                  type="button"
                  onClick={handleTogglePlayPause}
                  aria-label={
                    isPaused || isManualStepped
                      ? 'Resume continuous announcement scroll'
                      : 'Pause continuous announcement scroll'
                  }
                  title={
                    isPaused || isManualStepped ? 'Resume auto-scroll' : 'Pause auto-scroll'
                  }
                  className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
                >
                  {isPaused || isManualStepped ? (
                    <Play className="w-3 h-3" />
                  ) : (
                    <Pause className="w-3 h-3" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next announcement"
                title="Next announcement"
                className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigateToNotices()}
            className="hidden md:inline-flex items-center gap-1.5 ml-1 font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement bar"
            className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] hover:bg-neutral-200/75 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
