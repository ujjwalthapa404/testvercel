import React, { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { NoticeItem } from '../types/notice';
import { formatNoticeDate } from '../data/notices';

interface NoticePopupModalProps {
  notice?: NoticeItem;
  disabled?: boolean;
  onReadFullNotice: (slug: string) => void;
}

const POPUP_DISMISS_PREFIX = 'chc_popup_dismissed_';

/**
 * Controlled announcement popup modal.
 * Respects >=10s dwell + user interaction intent, expiry status, and persistent dismissal.
 */
export const NoticePopupModal: React.FC<NoticePopupModalProps> = ({
  notice,
  disabled = false,
  onReadFullNotice,
}) => {
  const [eligibleByDwell, setEligibleByDwell] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!notice) {
      setDismissed(true);
      return;
    }
    try {
      const stored = localStorage.getItem(`${POPUP_DISMISS_PREFIX}${notice.id}`);
      setDismissed(stored === '1');
    } catch {
      setDismissed(false);
    }
  }, [notice]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEligibleByDwell(true);
    }, 10500);

    const markInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener('scroll', markInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', markInteraction, { passive: true, once: true });
    window.addEventListener('keydown', markInteraction, { passive: true, once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', markInteraction);
      window.removeEventListener('pointerdown', markInteraction);
      window.removeEventListener('keydown', markInteraction);
    };
  }, []);

  const isVisible = Boolean(
    notice && !disabled && !dismissed && eligibleByDwell && hasInteracted
  );

  const handleClose = () => {
    if (!notice) return;
    setDismissed(true);
    try {
      localStorage.setItem(`${POPUP_DISMISS_PREFIX}${notice.id}`, '1');
    } catch {
      // Ignore storage restrictions
    }
  };

  useEffect(() => {
    if (!isVisible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isVisible, notice]);

  if (!isVisible || !notice) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-notice-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 border border-[var(--color-hairline)] shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-brand)]">
              {notice.category}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={notice.publishedAt} className="tabular-nums">
              {formatNoticeDate(notice.publishedAt)}
            </time>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close announcement popup"
            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2
          id="popup-notice-title"
          className="mt-3 text-2xl font-semibold text-[var(--color-primary-ink)] leading-snug"
        >
          {notice.title}
        </h2>

        <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
          {notice.excerpt}
        </p>

        <div className="mt-6 pt-5 border-t border-[var(--color-hairline)] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => {
              handleClose();
              onReadFullNotice(notice.slug);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Read Full Notice
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
