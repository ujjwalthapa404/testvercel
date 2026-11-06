import React, { useEffect, useRef } from 'react';
import { Award, Quote, Sparkles, X } from 'lucide-react';
import { StudentStory } from '../../data/studentStories';

interface StudentInsightModalProps {
  story: StudentStory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentInsightModal: React.FC<StudentInsightModalProps> = ({
  story,
  isOpen,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !story) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[var(--color-hairline)] shadow-2xl p-6 sm:p-8 z-10 transition-all">
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close testimonial dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-[var(--color-brand)]"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Student Profile Header */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-14 h-14 rounded-xl bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] font-serif text-xl font-bold flex items-center justify-center shrink-0 shadow-2xs select-none">
            {story.initials}
          </div>

          <div className="min-w-0">
            <h3
              id="student-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-[var(--color-primary-ink)]"
            >
              {story.studentName}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-bold">
                <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{story.achievement}</span>
              </span>
              <span className="text-xs text-[var(--color-muted)] font-medium">
                {story.streamBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Full Quotation */}
        <div className="mt-6 pt-5 border-t border-[var(--color-hairline)] relative">
          <Quote
            className="w-8 h-8 text-[var(--color-brand)]/15 absolute -top-4 left-0 bg-white pr-1"
            aria-hidden="true"
          />

          <blockquote className="mt-2 pl-1 sm:pl-2">
            <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--color-ink)] italic font-normal">
              &ldquo;{story.testimonial}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Modal Footer */}
        <div className="mt-7 pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs text-[var(--color-muted)]">
          <span className="font-sans font-medium text-[var(--color-ink)]">
            CAPITOL HILL COLLEGE · Teku, Kathmandu
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[var(--color-brand)] font-semibold">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified Student Voice</span>
          </span>
        </div>
      </div>
    </div>
  );
};
